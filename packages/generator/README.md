# @treant/generator

TypeScript SDK generator for Tree-sitter grammars.

Generates type-safe SDKs from Tree-sitter grammar definitions, providing:
- Type guards for every node type
- Type-safe navigation APIs
- Tree traversal utilities
- Full TypeScript type coverage

## Usage

```typescript
import { generate, emit, loadGrammar } from '@treant/generator';

// Load grammar
const grammar = await loadGrammar('./path/to/grammar/src');

// Generate SDK
const sdk = await generate({ grammar });

// Write to disk
await emit(sdk, './output');
```

## Features

- Generates complete TypeScript SDK from grammar.json
- Type guards for every node type
- Navigator API for type-safe tree traversal
- Cursor API for chainable navigation
- Parser wrapper with WASM integration
- Full type safety throughout

## License

MIT
