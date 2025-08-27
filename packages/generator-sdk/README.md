# @treant/generator-sdk

TypeScript SDK generator API for tree-sitter grammars.

## Usage

This package provides the core API for generating TypeScript SDKs. For CLI usage, see `@treant/cli`.

```typescript
import { generate } from '@treant/generator-sdk';

await generate({
  grammarPath: './grammar.json',
  nodeTypesPath: './node-types.json', 
  outputDir: './src-generated',
  nameOverride: 'GraphQL'
});
```

Expects to find:
- `../graphql-grammar/src/grammar.json`
- `../graphql-grammar/src/node-types.json`

Outputs to:
- `src-generated/`

## What You Get

- Type-safe AST nodes
- Type guards with narrowing
- Cursor navigation
- Tree utilities

## SDK Package Setup

```json
{
  "peerDependencies": {
    "web-tree-sitter": "^0.25.0"
  },
  "devDependencies": {
    "web-tree-sitter": "^0.25.8",
    "@treant/cli": "workspace:*"
  }
}
```

Why peer dependency? The generated code imports web-tree-sitter types.

## License

MIT