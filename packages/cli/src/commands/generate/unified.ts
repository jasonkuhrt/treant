import { Command, Options as Os } from '@effect/cli';
import * as CommandExecutor from '@effect/platform/CommandExecutor';
import * as PlatformCommand from '@effect/platform/Command';
import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Generator } from '@treant/generator';
import { Core } from '@treant/core';
import { Console, Effect, Option } from 'effect';
import { createHash } from 'node:crypto';

/**
 * Compute hash of file contents
 */
const computeFileHash = (content: string): string => {
  return createHash('sha256').update(content).digest('hex');
};

/**
 * Compute combined hash of multiple files
 */
const computeCombinedHash = (contents: string[]): string => {
  const combined = contents.join('\n---FILE_SEPARATOR---\n');
  return computeFileHash(combined);
};

export const unifiedGenerateCommand = Command.make('all', {
  grammarDir: Os.text('grammar-dir').pipe(
    Os.withDescription('Path to grammar directory'),
    Os.withDefault('grammar'),
  ),
  outDirGrammar: Os.text('out-dir-grammar').pipe(
    Os.withDescription('Output directory for grammar artifacts'),
    Os.withDefault('grammar-build'),
  ),
  outDirSdk: Os.text('out-dir-sdk').pipe(
    Os.withDescription('Output directory for SDK'),
    Os.withDefault('sdk'),
  ),
  force: Os.boolean('force').pipe(
    Os.withDescription('Force regeneration of both grammar and SDK'),
    Os.withDefault(false),
  ),
  forceGrammar: Os.boolean('force-grammar').pipe(
    Os.withDescription('Force regeneration of grammar only'),
    Os.withDefault(false),
  ),
  forceSdk: Os.boolean('force-sdk').pipe(
    Os.withDescription('Force regeneration of SDK only'),
    Os.withDefault(false),
  ),
}, (args) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    
    // Step 1: Check if grammar directory exists
    const grammarDirPath = path.resolve(args.grammarDir);
    const grammarDirExists = yield* fs.exists(grammarDirPath);
    
    if (!grammarDirExists) {
      yield* Console.error(`Grammar directory not found: ${grammarDirPath}`);
      return yield* Effect.fail(new Error('Grammar directory not found'));
    }
    
    // Step 2: Generate grammar artifacts with caching
    const grammarJsPath = path.join(grammarDirPath, 'grammar.js');
    const treeSitterJsonPath = path.join(grammarDirPath, 'tree-sitter.json');
    const grammarBuildPath = path.resolve(args.outDirGrammar);
    const grammarHashPath = path.join(grammarBuildPath, 'hash.txt');
    
    // Check if grammar.js exists
    const grammarJsExists = yield* fs.exists(grammarJsPath);
    if (!grammarJsExists) {
      yield* Console.error(`Grammar file not found: ${grammarJsPath}`);
      return yield* Effect.fail(new Error('Grammar file not found'));
    }
    
    // Compute hash of grammar inputs
    const grammarJsContent = yield* fs.readFileString(grammarJsPath);
    const treeSitterJsonExists = yield* fs.exists(treeSitterJsonPath);
    const treeSitterJsonContent = treeSitterJsonExists 
      ? yield* fs.readFileString(treeSitterJsonPath)
      : '';
    
    const grammarHash = computeCombinedHash([grammarJsContent, treeSitterJsonContent]);
    
    // Check if we can skip grammar generation
    let skipGrammar = false;
    if (!args.force && !args.forceGrammar) {
      const grammarBuildExists = yield* fs.exists(grammarBuildPath);
      if (grammarBuildExists) {
        const hashFileExists = yield* fs.exists(grammarHashPath);
        if (hashFileExists) {
          const existingHash = yield* fs.readFileString(grammarHashPath);
          if (existingHash.trim() === grammarHash) {
            skipGrammar = true;
            yield* Console.log('✓ Grammar artifacts up-to-date (cached)');
          }
        }
      }
    }
    
    // Generate grammar if needed
    if (!skipGrammar) {
      yield* Console.log('Generating grammar artifacts...');
      
      // Create temp directory for tree-sitter
      const tempDir = yield* fs.makeTempDirectory({ prefix: 'treant-generate-' });
      
      try {
        // Copy grammar.js to temp directory
        yield* fs.writeFileString(path.join(tempDir, 'grammar.js'), grammarJsContent);
        
        // Copy tree-sitter.json if it exists
        if (treeSitterJsonExists) {
          yield* fs.writeFileString(path.join(tempDir, 'tree-sitter.json'), treeSitterJsonContent);
        }
        
        // Create src directory for tree-sitter output
        const srcDir = path.join(tempDir, 'src');
        yield* fs.makeDirectory(srcDir, { recursive: true });
        
        // Run tree-sitter generate
        const executor = yield* CommandExecutor.CommandExecutor;
        const generateCommand = PlatformCommand.make('tree-sitter', 'generate', 'grammar.js', '-o', 'src');
        const commandWithCwd = PlatformCommand.workingDirectory(generateCommand, tempDir);
        const process = yield* executor.start(commandWithCwd);
        const exitCode = yield* process.exitCode;
        
        if (exitCode !== 0) {
          yield* Console.error(`tree-sitter generate failed with exit code ${exitCode}`);
          return yield* Effect.fail(new Error('Failed to generate grammar'));
        }
        
        // Copy artifacts to output directory
        yield* fs.makeDirectory(grammarBuildPath, { recursive: true });
        
        // Copy grammar.json
        const grammarJsonContent = yield* fs.readFileString(path.join(srcDir, 'grammar.json'));
        yield* fs.writeFileString(path.join(grammarBuildPath, 'grammar.json'), grammarJsonContent);
        
        // Copy node-types.json
        const nodeTypesContent = yield* fs.readFileString(path.join(srcDir, 'node-types.json'));
        yield* fs.writeFileString(path.join(grammarBuildPath, 'node-types.json'), nodeTypesContent);
        
        // Copy parser.c
        const parserCContent = yield* fs.readFileString(path.join(srcDir, 'parser.c'));
        yield* fs.writeFileString(path.join(grammarBuildPath, 'parser.c'), parserCContent);
        
        // Copy tree_sitter headers if they exist
        const headersSrcDir = path.join(srcDir, 'tree_sitter');
        const headersExist = yield* fs.exists(headersSrcDir);
        if (headersExist) {
          const headersDestDir = path.join(grammarBuildPath, 'tree_sitter');
          yield* fs.makeDirectory(headersDestDir, { recursive: true });
          
          const headerFiles = yield* fs.readDirectory(headersSrcDir);
          for (const file of headerFiles) {
            if (file.endsWith('.h')) {
              const content = yield* fs.readFileString(path.join(headersSrcDir, file));
              yield* fs.writeFileString(path.join(headersDestDir, file), content);
            }
          }
        }
        
        // Generate WASM file
        yield* Console.log('Generating WASM file...');
        const wasmBuildCommand = PlatformCommand.make('tree-sitter', 'build', '--wasm');
        const wasmCommandWithCwd = PlatformCommand.workingDirectory(wasmBuildCommand, tempDir);
        const wasmProcess = yield* executor.start(wasmCommandWithCwd);
        const wasmExitCode = yield* wasmProcess.exitCode;
        
        if (wasmExitCode !== 0) {
          yield* Console.error(`tree-sitter build --wasm failed with exit code ${wasmExitCode}`);
          return yield* Effect.fail(new Error('Failed to generate WASM'));
        }
        
        // The WASM file is generated as tree-sitter-<grammar>.wasm in the temp directory
        // Find and copy it to grammar.wasm
        const grammarJsonContentParsed = JSON.parse(grammarJsonContent);
        const grammarNameFromJson = grammarJsonContentParsed.name;
        const generatedWasmPath = path.join(tempDir, `tree-sitter-${grammarNameFromJson}.wasm`);
        const targetWasmPath = path.join(grammarBuildPath, 'grammar.wasm');
        
        const wasmExists = yield* fs.exists(generatedWasmPath);
        if (wasmExists) {
          const wasmContent = yield* fs.readFile(generatedWasmPath);
          yield* fs.writeFile(targetWasmPath, wasmContent);
        } else {
          yield* Console.error(`WASM file not found at expected path: ${generatedWasmPath}`);
          return yield* Effect.fail(new Error('WASM file not found'));
        }
        
        // Write hash file
        yield* fs.writeFileString(grammarHashPath, grammarHash);
        
        yield* Console.log(`✓ Grammar artifacts generated in ${args.outDirGrammar}`);
      } finally {
        // Cleanup temp directory
        yield* fs.remove(tempDir, { recursive: true });
      }
    }
    
    // Step 3: Generate SDK with caching
    const sdkPath = path.resolve(args.outDirSdk);
    const sdkHashPath = path.join(sdkPath, 'hash.txt');
    
    // Compute hash of SDK inputs
    const grammarJsonPath = path.join(grammarBuildPath, 'grammar.json');
    const nodeTypesPath = path.join(grammarBuildPath, 'node-types.json');
    
    const grammarJsonContent = yield* fs.readFileString(grammarJsonPath);
    const nodeTypesJsonContent = yield* fs.readFileString(nodeTypesPath);
    
    const sdkHash = computeCombinedHash([grammarJsonContent, nodeTypesJsonContent]);
    
    // Check if we can skip SDK generation
    let skipSdk = false;
    if (!args.force && !args.forceSdk) {
      const sdkExists = yield* fs.exists(sdkPath);
      if (sdkExists) {
        const hashFileExists = yield* fs.exists(sdkHashPath);
        if (hashFileExists) {
          const existingHash = yield* fs.readFileString(sdkHashPath);
          if (existingHash.trim() === sdkHash) {
            skipSdk = true;
            yield* Console.log('✓ SDK up-to-date (cached)');
          }
        }
      }
    }
    
    // Generate SDK if needed
    if (!skipSdk) {
      yield* Console.log('Generating SDK...');
      
      // Validate grammar paths exist
      yield* Core.FirstPartyGrammars.resolveGrammarPaths(grammarBuildPath);
      
      // Load the complete grammar
      const grammar = yield* Effect.promise(() => Generator.loadGrammar(grammarBuildPath));
      
      // Generate the SDK with path to WASM in grammar-build
      const relativePath = path.relative(sdkPath, grammarBuildPath);
      const wasmPath = path.join(relativePath, 'grammar.wasm');
      const sdk = yield* Effect.promise(() => Generator.generate({ 
        grammar,
        wasmPath,
        emitArtifacts: false 
      }));
      
      // Emit the SDK files
      yield* Effect.promise(() => Generator.emit(sdk, sdkPath));
      
      // Write hash file
      yield* fs.writeFileString(sdkHashPath, sdkHash);
      
      yield* Console.log(`✓ SDK generated in ${args.outDirSdk}`);
    }
    
    yield* Console.log('\n✅ Generation complete!');
  }));