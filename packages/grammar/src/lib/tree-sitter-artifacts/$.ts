import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Effect, Schema } from 'effect';
import { GrammarJson as GrammarJsonSchema } from '../../schemas/grammar-json.js';
import { NodeType } from '../../schemas/node-type.js';
import { FileUtils } from '../file-utils/$.js';

export type TreeSitterArtifacts = Effect.Effect.Success<ReturnType<typeof read>>;

/**
 * Read tree-sitter generated artifacts from a directory.
 * Expects the standard tree-sitter CLI output layout.
 */
export const read = (
  dir: string,
) =>
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

    return {
      ...standardFiles,
      'parser.wasm': wasm,
    };
  });

export * as TreeSitterArtifacts from './$.js';
