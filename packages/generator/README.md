# @treant/generator

Generate TypeScript SDKs from tree-sitter grammars.

## Usage

```bash
tsx @treant/generator --name GraphQL
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
    "@treant/generator": "workspace:*"
  }
}
```

Why peer dependency? The generated code imports web-tree-sitter types.

## License

MIT