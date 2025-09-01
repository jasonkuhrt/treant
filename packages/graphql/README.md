# @treant/graphql

All-in-one GraphQL parser with TypeScript SDK.

## Installation

```bash
npm install @treant/graphql
```

## Usage

```typescript
import { TreantGraphQL } from '@treant/graphql';

// Parse GraphQL
const tree = await TreantGraphQL.Parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`);

// Type-safe AST access
if (TreantGraphQL.Node.isOperationDefinition(tree.rootNode)) {
  console.log('Query operation');
}

// Navigate with type safety
const navigator = await TreantGraphQL.Navigator.create(tree);
const fieldName = navigator
  .child() // to document
  .child() // to operation_definition  
  .selectionSet()
  .selections()
  .at(0)
  ?.name();
```

## What's Included

- Pre-compiled WASM parser
- Complete TypeScript SDK
- Type guards for all node types
- Type-safe navigation API
- Tree traversal utilities
- Grammar assets (JSON, query files)

## Also Exports Assets

```javascript
// Access WASM and grammar files directly
const wasmPath = require.resolve('@treant/graphql/assets/wasm');
const grammarPath = require.resolve('@treant/graphql/assets/grammar.json');
```

## License

MIT