# tree-sitter-graphql-grammar-wasm

Pre-built WASM binary for the tree-sitter GraphQL grammar.

## Installation

```bash
npm install tree-sitter-graphql-grammar-wasm
```

## Examples

### NodeJS

```typescript
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Parser, Language } from 'web-tree-sitter'

// Initialize the parser
await Parser.init()
const parser = new Parser()

// Load the GraphQL grammar
const wasmPath = fileURLToPath(new URL('./node_modules/tree-sitter-graphql-grammar-wasm/grammar.wasm', import.meta.url))
const wasmBuffer = readFileSync(wasmPath)
const GraphQL = await Language.load(wasmBuffer)
parser.setLanguage(GraphQL)

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`)

console.log(tree.rootNode.toString())
```

### Vite

```typescript
import grammarUrl from 'tree-sitter-graphql-grammar-wasm/grammar.wasm?url'
import { Parser, Language } from 'web-tree-sitter'

// Initialize the parser
await Parser.init()
const parser = new Parser()

// Load the GraphQL grammar
const GraphQL = await Language.load(grammarUrl)
parser.setLanguage(GraphQL)

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`)

console.log(tree.rootNode.toString())
```

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
pnpm build
pnpm test
```


## Architecture

### Project Structure

```
.
├── grammar.js          # Tree-sitter grammar definition (source)
├── tree-sitter.json    # Tree-sitter project configuration
├── grammar.wasm        # Pre-built WASM binary (distributed)
├── queries/            # Legacy query files, unused (see below)
├── src/                # Generated parser files (git-ignored)
└── tests/              # Integration tests
```

### Flow

1. **Edit Grammar** - Modify `grammar.js` to change the GraphQL parsing rules
2. **Generate Parser** - Run `tree-sitter generate` which:
   - Reads `tree-sitter.json` to find the grammar and understand project configuration
   - Creates C parser code in `src/` (see Project Structure above for details)
3. **Build WASM** - Run `tree-sitter build --wasm -o grammar.wasm` to compile `src/parser.c` → `grammar.wasm`
4. **Test** - Run `vitest` to verify the grammar works correctly
5. **Ship** - Only `grammar.wasm` is published to npm for JavaScript/TypeScript consumers; `src/` is git-ignored

### Notes

The `queries/` directory contains [tree-sitter query files](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries) for syntax highlighting, inherited from the original tree-sitter-graphql repository. These aren't used by the WASM package and may be removed in a future version of this project.

## Credits

The grammar is based on [tree-sitter-graphql](https://github.com/bkegley/tree-sitter-graphql). I have modernized this package but the basic grammar structure remains the same.
