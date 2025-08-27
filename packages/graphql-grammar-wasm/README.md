# @treant/graphql-grammar-wasm

Pre-built WASM binary for the tree-sitter GraphQL parser.

## Installation

```bash
npm install @treant/graphql-grammar-wasm
```

## Usage

### Node.js

```typescript
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Language, Parser } from 'web-tree-sitter';

await Parser.init();
const parser = new Parser();

const require = createRequire(import.meta.url);
const wasmPath = require.resolve('@treant/graphql-grammar-wasm');
const GraphQL = await Language.load(readFileSync(wasmPath));
parser.setLanguage(GraphQL);

const tree = parser.parse(`query { hello }`);
```

### Browser/Vite

```javascript
import grammarUrl from '@treant/graphql-grammar-wasm/grammar.wasm?url';
import { Language, Parser } from 'web-tree-sitter';

await Parser.init();
const parser = new Parser();
const GraphQL = await Language.load(grammarUrl);
parser.setLanguage(GraphQL);

const tree = parser.parse(`query { hello }`);
```

## For TypeScript SDK

Use `@treant/graphql-sdk` or `@treant/graphql` for type-safe AST access.

## License

MIT