import { Command, Options as Os } from '@effect/cli';
import * as CommandExecutor from '@effect/platform/CommandExecutor';
import * as PlatformCommand from '@effect/platform/Command';
import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Console, Effect, Option } from 'effect';

export const grammarCommand = Command.make('grammar', {
  input: Os.text('input').pipe(
    Os.withAlias('i'),
    Os.withDescription('Path to grammar.js file'),
    Os.withDefault('grammar/grammar.js'),
  ),
  output: Os.text('output').pipe(
    Os.withAlias('o'),
    Os.withDescription('Output directory for generated grammar artifacts'),
    Os.withDefault('grammar-build'),
  ),
  wasm: Os.boolean('wasm').pipe(
    Os.withAlias('w'),
    Os.withDescription('Generate WASM file for runtime parsing'),
    Os.withDefault(false),
  ),
  queries: Os.text('queries').pipe(
    Os.withAlias('q'),
    Os.withDescription('Path to queries directory (e.g., "./queries/graphql")'),
    Os.optional,
  ),
}, (args) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    
    // Resolve the input path
    const resolvedInputPath = path.resolve(args.input);
    
    // Check if input file exists
    const inputExists = yield* fs.exists(resolvedInputPath);
    if (!inputExists) {
      yield* Console.error(`Grammar file not found: ${resolvedInputPath}`);
      return yield* Effect.fail(new Error(`Grammar file not found: ${resolvedInputPath}`));
    }
    
    yield* Console.log(`Loading grammar from: ${resolvedInputPath}`);
    
    // Safety check for output directory
    const outputPath = path.resolve(args.output);
    const outputExists = yield* fs.exists(outputPath);
    
    // Warn about potentially dangerous directories
    const dangerousNames = ['src', 'lib', 'dist', 'build', 'node_modules'];
    const outputBasename = path.basename(outputPath);
    if (dangerousNames.includes(outputBasename)) {
      yield* Console.warn(`⚠️  Warning: Output directory "${outputBasename}" might contain important files`);
      yield* Console.log('Consider using a different output directory like "grammar" or "generated-grammar"');
      // TODO: Add interactive prompt for confirmation in future
    }
    
    if (outputExists) {
      const files = yield* fs.readDirectory(outputPath);
      if (files.length > 0) {
        yield* Console.warn(`⚠️  Output directory "${args.output}" already exists and contains files`);
        yield* Console.log('Files will be overwritten. Press Ctrl+C to cancel.');
        // TODO: Add interactive prompt for confirmation in future
      }
    }
    
    yield* Console.log(`Generating grammar artifacts with tree-sitter...`);
    
    // Instead of using Grammar.build which expects a grammar definition,
    // we'll run tree-sitter directly on the input file
    const tempDir = yield* fs.makeTempDirectory({ prefix: 'treant-cli-' });
    
    try {
      // Copy the original grammar.js to temp directory
      const grammarContent = yield* fs.readFileString(resolvedInputPath);
      yield* fs.writeFileString(path.join(tempDir, 'grammar.js'), grammarContent);
      
      // Check if tree-sitter.json exists in the same directory as grammar.js
      const grammarDir = path.dirname(resolvedInputPath);
      const treeSitterJsonPath = path.join(grammarDir, 'tree-sitter.json');
      const treeSitterJsonExists = yield* fs.exists(treeSitterJsonPath);
      
      if (treeSitterJsonExists) {
        // Copy the existing tree-sitter.json to temp directory
        const treeSitterJsonContent = yield* fs.readFileString(treeSitterJsonPath);
        yield* fs.writeFileString(path.join(tempDir, 'tree-sitter.json'), treeSitterJsonContent);
        yield* Console.log('Using existing tree-sitter.json configuration');
      }
      
      // Create src directory for tree-sitter output
      const srcDir = path.join(tempDir, 'src');
      yield* fs.makeDirectory(srcDir, { recursive: true });
      
      // Run tree-sitter generate
      const executor = yield* CommandExecutor.CommandExecutor;
      
      // Run tree-sitter from the temp directory (helps with imports)
      const generateCommand = PlatformCommand.make('tree-sitter', 'generate', 'grammar.js', '-o', 'src');
      const commandWithCwd = PlatformCommand.workingDirectory(generateCommand, tempDir);
      const process = yield* executor.start(commandWithCwd);
      const exitCode = yield* process.exitCode;
      
      if (exitCode !== 0) {
        yield* Console.error(`tree-sitter generate failed with exit code ${exitCode}`);
        return yield* Effect.fail(new Error('Failed to generate grammar'));
      }
      
      // Read the generated artifacts
      const grammarJsonPath = path.join(srcDir, 'grammar.json');
      const nodeTypesPath = path.join(srcDir, 'node-types.json');
      const parserCPath = path.join(srcDir, 'parser.c');
      
      const grammarJson = JSON.parse(yield* fs.readFileString(grammarJsonPath));
      const nodeTypes = JSON.parse(yield* fs.readFileString(nodeTypesPath));
      const parserC = yield* fs.readFileString(parserCPath);
      
      // Handle WASM generation if requested
      let wasm: Uint8Array | undefined;
      if (args.wasm) {
        yield* Console.log('Generating WASM file...');
        // TODO: Implement WASM generation
        yield* Console.warn('WASM generation not yet implemented in CLI');
      }
      
      // Now write the artifacts to the output directory
      yield* Console.log(`Writing artifacts to: ${outputPath}`);
      
      // Create output directory
      yield* fs.makeDirectory(outputPath, { recursive: true });
      
      // Write grammar.json
      const outputGrammarJsonPath = path.join(outputPath, 'grammar.json');
      yield* fs.writeFileString(outputGrammarJsonPath, JSON.stringify(grammarJson, null, 2));
      yield* Console.log(`  ✓ grammar.json`);
      
      // Write node-types.json
      const outputNodeTypesPath = path.join(outputPath, 'node-types.json');
      yield* fs.writeFileString(outputNodeTypesPath, JSON.stringify(nodeTypes, null, 2));
      yield* Console.log(`  ✓ node-types.json`);
      
      // Write parser.c
      const outputParserCPath = path.join(outputPath, 'parser.c');
      yield* fs.writeFileString(outputParserCPath, parserC);
      yield* Console.log(`  ✓ parser.c`);
      
      // Copy tree_sitter headers if they exist
      const headersSrcDir = path.join(srcDir, 'tree_sitter');
      const headersExist = yield* fs.exists(headersSrcDir);
      if (headersExist) {
        const headersDestDir = path.join(outputPath, 'tree_sitter');
        yield* fs.makeDirectory(headersDestDir, { recursive: true });
        
        const headerFiles = yield* fs.readDirectory(headersSrcDir);
        for (const file of headerFiles) {
          if (file.endsWith('.h')) {
            const content = yield* fs.readFileString(path.join(headersSrcDir, file));
            yield* fs.writeFileString(path.join(headersDestDir, file), content);
            yield* Console.log(`  ✓ tree_sitter/${file}`);
          }
        }
      }
      
      // Write WASM if generated
      if (wasm) {
        const wasmPath = path.join(outputPath, 'grammar.wasm');
        yield* fs.writeFile(wasmPath, wasm);
        yield* Console.log(`  ✓ grammar.wasm`);
      }
    } finally {
      // Cleanup temp directory
      yield* fs.remove(tempDir, { recursive: true });
    }
    
    // Handle query files if specified
    const queriesPath = Option.getOrUndefined(args.queries);
    if (queriesPath) {
      const resolvedQueriesPath = path.resolve(queriesPath);
      const queriesExist = yield* fs.exists(resolvedQueriesPath);
      
      if (queriesExist) {
        yield* Console.log(`Copying query files from: ${resolvedQueriesPath}`);
        const queriesOutputPath = path.join(outputPath, 'queries');
        yield* fs.makeDirectory(queriesOutputPath, { recursive: true });
        
        // Read all .scm files from queries directory
        const queryFiles = yield* fs.readDirectory(resolvedQueriesPath);
        let copiedCount = 0;
        
        for (const file of queryFiles) {
          if (file.endsWith('.scm')) {
            const sourcePath = path.join(resolvedQueriesPath, file);
            const destPath = path.join(queriesOutputPath, file);
            const content = yield* fs.readFileString(sourcePath);
            yield* fs.writeFileString(destPath, content);
            yield* Console.log(`  ✓ queries/${file}`);
            copiedCount++;
          }
        }
        
        if (copiedCount === 0) {
          yield* Console.warn('No .scm query files found in queries directory');
        }
      } else {
        yield* Console.warn(`Queries directory not found: ${resolvedQueriesPath}`);
      }
    }
    
    yield* Console.log(`\n✅ Grammar artifacts generated successfully in ${args.output}/`);
    
    // Provide helpful next steps
    yield* Console.log('\nYou can now add these to your package.json:');
    yield* Console.log('```json');
    yield* Console.log('"files": ["grammar"],');
    yield* Console.log('"exports": {');
    if (args.wasm) {
      yield* Console.log(`  "./${args.output}/wasm": "./${args.output}/grammar.wasm",`);
    }
    yield* Console.log(`  "./${args.output}/grammar.json": "./${args.output}/grammar.json",`);
    yield* Console.log(`  "./${args.output}/node-types.json": "./${args.output}/node-types.json"`);
    yield* Console.log('}');
    yield* Console.log('```');
  }));