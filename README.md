# tree-sitter-graphql-grammar-wasm

Pre-built WASM binary for the tree-sitter GraphQL grammar.

## Installation

```bash
npm install tree-sitter-graphql-grammar-wasm
```

## Examples

### NodeJS

```typescript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Language, Parser } from 'web-tree-sitter';

// Initialize the parser
await Parser.init();
const parser = new Parser();

// Load the GraphQL grammar
const wasmPath = fileURLToPath(
  new URL(
    './node_modules/tree-sitter-graphql-grammar-wasm/grammar.wasm',
    import.meta.url,
  ),
);
const wasmBuffer = readFileSync(wasmPath);
const GraphQL = await Language.load(wasmBuffer);
parser.setLanguage(GraphQL);

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`);

console.log(tree.rootNode.toString());
```

### Vite

```typescript
import grammarUrl from 'tree-sitter-graphql-grammar-wasm/grammar.wasm?url';
import { Language, Parser } from 'web-tree-sitter';

// Initialize the parser
await Parser.init();
const parser = new Parser();

// Load the GraphQL grammar
const GraphQL = await Language.load(grammarUrl);
parser.setLanguage(GraphQL);

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`);

console.log(tree.rootNode.toString());
```

## Development

### Prerequisites

- Node.js 24+
- pnpm

### Setup

```bash
pnpm install
pnpm build          # Full build: TypeScript → Parser → WASM
pnpm check:types    # Type check TypeScript files
pnpm test           # Run integration tests
```

### Build Commands

```bash
pnpm build:grammar  # Compile TypeScript grammar to JavaScript
pnpm gen:parser     # Generate C parser from compiled grammar
pnpm build:wasm     # Compile C parser to WASM (requires Docker)
pnpm build          # Run full build pipeline
```

## Architecture

### Project Structure

```
.
├── grammar/            # TypeScript source files
│   └── grammar.ts      # Tree-sitter grammar definition (TypeScript)
├── grammar-js/         # Compiled JavaScript (git-ignored)
│   └── grammar.js      # Compiled grammar for tree-sitter
├── parser/             # Generated parser files (git-ignored)
│   └── src/            # Generated C parser source files
├── tree-sitter.json    # Tree-sitter project configuration
├── grammar.wasm        # Pre-built WASM binary (distributed)
├── queries/            # Legacy query files, unused (see below)
├── tsconfig.json       # TypeScript configuration
├── tsconfig.build.json # Build-specific TypeScript configuration
└── tests/              # Integration tests
```

### Flow

1. **Edit Grammar** - Modify `grammar/grammar.ts` to change the GraphQL parsing rules (with full TypeScript support)
2. **Compile TypeScript** - Run `pnpm build:grammar` which compiles `grammar/grammar.ts` → `grammar-js/grammar.js`
3. **Generate Parser** - Run `pnpm gen:parser` which:
   - Uses the compiled JavaScript grammar from `grammar-js/grammar.js`
   - Creates C parser code in `parser/src/` (see Project Structure above for details)
4. **Build WASM** - Run `pnpm build:wasm` to compile `parser/src/parser.c` → `grammar.wasm` (uses Docker for emscripten)
5. **Test** - Run `pnpm test` and `pnpm check:types` to verify the grammar works correctly
6. **Ship** - Only `grammar.wasm` is published to npm for JavaScript/TypeScript consumers; `grammar-js/` and `parser/` are git-ignored

### Notes

The `queries/` directory contains [tree-sitter query files](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries) for syntax highlighting, inherited from the original tree-sitter-graphql repository. These aren't used by the WASM package and may be removed in a future version of this project.

## Credits

The grammar is based on [tree-sitter-graphql](https://github.com/bkegley/tree-sitter-graphql). I have modernized this package but the basic grammar structure remains the same.
