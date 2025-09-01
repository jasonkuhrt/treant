import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Effect, Schema } from 'effect';
import type { GrammarJson } from '../../schemas/grammar-json.js';
import { GrammarJson as GrammarJsonSchema } from '../../schemas/grammar-json.js';
import type { NodeType as NodeTypeSchema } from '../../schemas/node-type.js';
import { NodeType } from '../../schemas/node-type.js';
import { FileUtils } from '../file-utils/$.js';

/**
 * Represents a built/compiled grammar with all its artifacts.
 * This is the output of tree-sitter's grammar generation process.
 */
export interface BuiltGrammar {
  /**
   * The parsed grammar.json file containing the grammar rules and structure.
   */
  grammarJson: GrammarJson;

  /**
   * The parsed node-types.json file containing node type definitions.
   */
  nodeTypes: readonly NodeTypeSchema[];

  /**
   * Optional WASM binary for runtime parsing.
   */
  wasm?: Uint8Array;
  
  /**
   * Generated C parser source code for native compilation.
   */
  parserC: string;
  
  /**
   * Tree-sitter header files needed for compilation.
   */
  headers?: {
    'parser.h'?: string;
    'alloc.h'?: string;
    'array.h'?: string;
  };
}

/**
 * Read tree-sitter generated artifacts from a directory and return as BuiltGrammar.
 * Expects the standard tree-sitter CLI output layout.
 */
export const read = (
  dir: string,
): Effect.Effect<BuiltGrammar, FileUtils.FileReadError, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    // The artifacts are in the src subdirectory
    const srcDir = path.join(dir, 'src');

    // Read standard files using readTree
    const standardFiles = yield* FileUtils.readTree(srcDir, {
      'grammar.json': GrammarJsonSchema,
      'node-types.json': Schema.Array(NodeType),
      'parser.c': Schema.String,
      'tree_sitter': {
        'parser.h': Schema.UndefinedOr(Schema.String),
        'alloc.h': Schema.UndefinedOr(Schema.String),
        'array.h': Schema.UndefinedOr(Schema.String),
      },
    });

    // Check for WASM file separately since readTree doesn't handle binary
    const wasmPath = path.join(dir, 'parser.wasm');
    const wasmExists = yield* fs.exists(wasmPath).pipe(Effect.orElseSucceed(() => false));

    let wasm: Uint8Array | undefined = undefined;
    if (wasmExists) {
      wasm = yield* fs.readFile(wasmPath).pipe(
        Effect.orElse(() => Effect.succeed(undefined)),
      );
    }

    // Build the BuiltGrammar object
    const result: BuiltGrammar = {
      grammarJson: standardFiles['grammar.json'].parsed,
      nodeTypes: standardFiles['node-types.json'].parsed,
      parserC: standardFiles['parser.c'],
    };

    if (wasm) {
      result.wasm = wasm;
    }

    // Add headers if they exist
    if (standardFiles.tree_sitter) {
      const headers: BuiltGrammar['headers'] = {};
      if (standardFiles.tree_sitter['parser.h'] !== undefined) {
        headers['parser.h'] = standardFiles.tree_sitter['parser.h'];
      }
      if (standardFiles.tree_sitter['alloc.h'] !== undefined) {
        headers['alloc.h'] = standardFiles.tree_sitter['alloc.h'];
      }
      if (standardFiles.tree_sitter['array.h'] !== undefined) {
        headers['array.h'] = standardFiles.tree_sitter['array.h'];
      }
      if (Object.keys(headers).length > 0) {
        result.headers = headers;
      }
    }

    return result;
  });

export * as BuiltGrammar from './$.js';