# @treant/graphql-grammar

Tree-sitter GraphQL grammar assets.

## What's Included

- Pre-compiled WASM parser (`grammar.wasm`)
- Grammar definition (`grammar.json`)
- Node types (`node-types.json`)
- Query files for syntax highlighting and formatting
- C header files for native compilation

## Installation

```bash
npm install @treant/graphql-grammar
```

## Usage

This is an asset-only package. Files can be accessed via `require.resolve()`:

```javascript
const wasmPath = require.resolve('@treant/graphql-grammar/wasm');
const grammarPath = require.resolve('@treant/graphql-grammar/grammar.json');
```

## License

MIT
