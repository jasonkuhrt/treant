import { Schema } from 'effect';

/**
 * Schema for tree-sitter.json configuration file
 * Required for tree-sitter CLI operations like WASM builds
 */

const GrammarConfig = Schema.Struct({
  name: Schema.String,
  path: Schema.String,
  scope: Schema.String,
  'file-types': Schema.Array(Schema.String),
});

const Metadata = Schema.Struct({
  version: Schema.String,
  license: Schema.String,
  authors: Schema.optional(Schema.Array(Schema.Struct({
    name: Schema.String,
    email: Schema.optional(Schema.String),
  }))),
});

export const TreeSitterConfig = Schema.Struct({
  grammars: Schema.Array(GrammarConfig),
  metadata: Metadata,
});

export type TreeSitterConfig = Schema.Schema.Type<typeof TreeSitterConfig>;

export const make = TreeSitterConfig.make;
