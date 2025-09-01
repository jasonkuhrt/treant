import * as NodeContext from '@effect/platform-node/NodeContext';
import * as Command from '@effect/platform/Command';
import * as CommandExecutor from '@effect/platform/CommandExecutor';
import * as PlatformError from '@effect/platform/Error';
import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Data, Effect, Scope } from 'effect';
import { createHash } from 'node:crypto';
import type { Grammar } from './generated/dsl/types.js';
import { BuiltGrammar } from './lib/built-grammar/$.js';
import { FileUtils } from './lib/file-utils/$.js';
import { GrammarToSourceCode } from './lib/grammar-to-source-code/$.js';
import * as TreeSitterConfig from './schemas/tree-sitter-config.js';

export interface GenerateOptions {
  /**
   * Enable caching for generated artifacts to speed up subsequent builds.
   *
   * Cache keys are based on grammar content + wasm option, ensuring different
   * configurations are cached separately.
   *
   * @default false - No caching
   *
   * @example
   * ```ts
   * // Use default cache location (node_modules/.cache/treant-grammar)
   * await generate(grammar, { cache: true })
   *
   * // Use custom cache directory
   * await generate(grammar, { cache: { dir: '.my-cache' } })
   *
   * // Disable caching for fresh generation
   * await generate(grammar, { cache: false })
   * ```
   *
   * @remarks
   * - Cache is keyed by SHA-256 hash of grammar content + wasm flag
   * - Default location: `node_modules/.cache/treant-grammar/`
   * - WASM and non-WASM builds are cached separately
   * - Cache hit: ~4x faster than regeneration
   * - Useful for development hot-reloading and CI builds
   */
  cache?: boolean | {
    /**
     * Custom directory for cache storage.
     * @example '.cache/grammars' or '/tmp/treant-cache'
     */
    dir: string;
  };
  /**
   * Generate WebAssembly (WASM) output for browser/Node.js parsing.
   *
   * @default false
   *
   * @remarks
   * - Requires Docker for emscripten compilation
   * - Adds ~2-3 seconds to build time
   * - Output includes `parser.wasm` file
   * - Required for runtime parsing in JavaScript/TypeScript
   */
  wasm?: boolean;
}

export class GenerateError extends Data.TaggedError('GenerateError')<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Generate WASM artifacts for a tree-sitter grammar
 */
const generateWasm = (outputDir: string, grammarName: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const executor = yield* CommandExecutor.CommandExecutor;

    // Create tree-sitter.json config required for WASM build
    const treeSitterConfig = TreeSitterConfig.make({
      grammars: [{
        name: grammarName,
        path: '.',
        scope: `source.${grammarName}`,
        'file-types': [],
      }],
      metadata: {
        version: '0.0.0',
        license: 'MIT',
      },
    });
    yield* FileUtils.writeJson(`${outputDir}/tree-sitter.json`, treeSitterConfig);

    // Build WASM with working directory set to outputDir
    // Use Docker to run emscripten (required for WASM compilation)
    const wasmFileName = `tree-sitter-${grammarName}.wasm`;
    const wasmCommand = Command.make('tree-sitter', 'build', '--docker', '--wasm', '--output', wasmFileName, '.');
    const wasmCommandWithCwd = Command.workingDirectory(wasmCommand, outputDir);

    const wasmProcess = yield* executor.start(wasmCommandWithCwd);

    // Get exit code
    const wasmExitCode = yield* wasmProcess.exitCode;

    if (wasmExitCode !== 0) {
      yield* Effect.fail(
        new GenerateError({
          message: `tree-sitter build --wasm failed with exit code ${wasmExitCode}`,
        }),
      );
    }

    // Rename the WASM file to parser.wasm
    const generatedWasmPath = `${outputDir}/${wasmFileName}`;
    const normalizedWasmPath = `${outputDir}/parser.wasm`;
    yield* fs.rename(generatedWasmPath, normalizedWasmPath);
  });

const getCachePath = (cacheDir: string, content: string, wasm: boolean = false) =>
  Path.Path.pipe(
    Effect.map(path => {
      const hash = createHash('sha256')
        .update(content)
        .update(wasm ? 'wasm' : 'no-wasm')
        .digest('hex');
      return path.join(cacheDir, hash);
    }),
  );

// Main implementation with temp directory
export const build = <RuleName extends string>(
  grammar: Grammar<RuleName>,
  options?: GenerateOptions,
): Effect.Effect<
  BuiltGrammar,
  GenerateError | PlatformError.PlatformError | FileUtils.FileReadError,
  FileSystem.FileSystem | CommandExecutor.CommandExecutor | Scope.Scope | Path.Path
> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;

    // Generate grammar.js source code
    const grammarJs = GrammarToSourceCode.grammarToSourceCode(grammar);

    // Function to run tree-sitter CLI generation
    // Returns the directory where artifacts were generated
    const runTreeSitterCLI = (dir?: string) =>
      Effect.gen(function*() {
        // Use provided dir or create temp dir
        const outputDir = dir ?? (yield* fs.makeTempDirectory({ prefix: 'treant-grammar-' }));

        // Write grammar.js
        yield* fs.writeFileString(`${outputDir}/grammar.js`, grammarJs);

        // Create src directory for tree-sitter output
        const srcDir = `${outputDir}/src`;
        yield* fs.makeDirectory(srcDir, { recursive: true });

        // Run tree-sitter generate
        const executor = yield* CommandExecutor.CommandExecutor;
        const processCommand = Command.make('tree-sitter', 'generate', `${outputDir}/grammar.js`, '-o', srcDir);

        const process = yield* executor.start(processCommand).pipe(
          Effect.catchTag(
            'SystemError',
            (error) =>
              Effect.fail(new GenerateError({ message: `Failed to run tree-sitter: ${error.message}`, cause: error })),
          ),
        );

        const exitCode = yield* process.exitCode;

        if (exitCode !== 0) {
          yield* Effect.fail(
            new GenerateError({
              message: `tree-sitter generate failed with exit code ${exitCode}`,
            }),
          );
        }

        // If wasm option is enabled, compile WASM
        if (options?.wasm) {
          yield* generateWasm(outputDir, grammar.name);
        }

        return outputDir;
      });

    // Determine cache directory
    const cacheDir = yield* (() => {
      if (!options?.cache) return Effect.succeed(null);
      if (options.cache === true) {
        // Default cache location: node_modules/.cache/treant-grammar
        return Path.Path.pipe(
          Effect.map(path => path.join(process.cwd(), 'node_modules', '.cache', 'treant-grammar')),
        );
      }
      return Effect.succeed(options.cache.dir);
    })();

    // Get the directory with artifacts (cached or freshly generated)
    const artifactsDir = cacheDir
      ? yield* FileUtils.withCachedDir(yield* getCachePath(cacheDir, grammarJs, options?.wasm), runTreeSitterCLI)
      : yield* runTreeSitterCLI();

    // Read artifacts from the directory and return as BuiltGrammar
    return yield* BuiltGrammar.read(artifactsDir);
  });

// Curried variant with options pre-configured
export const generateWith = (
  options: GenerateOptions,
) =>
<RuleName extends string>(
  grammar: Grammar<RuleName>,
): Effect.Effect<
  BuiltGrammar,
  GenerateError | PlatformError.PlatformError | FileUtils.FileReadError,
  FileSystem.FileSystem | CommandExecutor.CommandExecutor | Scope.Scope | Path.Path
> => build(grammar, options);

// For non-Effect users with overloads for better typing
export function generateAsync<RuleName extends string>(
  grammar: Grammar<RuleName>,
  options: GenerateOptions & { wasm: true },
): Promise<BuiltGrammar & { wasm: Uint8Array }>;
export function generateAsync<RuleName extends string>(
  grammar: Grammar<RuleName>,
  options?: GenerateOptions,
): Promise<BuiltGrammar>;
export function generateAsync<RuleName extends string>(
  grammar: Grammar<RuleName>,
  options?: GenerateOptions,
): Promise<BuiltGrammar> {
  return build(grammar, options).pipe(
    Effect.scoped,
    Effect.provide(NodeContext.layer),
    Effect.runPromise,
  );
}

// Curried async variant
export const generateAsyncWith = (
  options: GenerateOptions,
) =>
<RuleName extends string>(
  grammar: Grammar<RuleName>,
): Promise<BuiltGrammar> => generateAsync(grammar, options);
