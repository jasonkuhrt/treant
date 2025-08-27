# @treant/graphql

All-in-one GraphQL parser with TypeScript SDK.

## Installation

```bash
npm install @treant/graphql
```

## Usage

```typescript
import { parse, Node } from '@treant/graphql';

// Parse GraphQL
const tree = await parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`);

// Type-safe AST access
if (Node.isOperationDefinition(tree.rootNode)) {
  console.log('Query operation');
}

// Find all fields
const fields = tree.rootNode
  .descendantsOfType('field')
  .map(f => f.text);
```

## What's Included

- WASM parser binary
- TypeScript SDK with full type safety
- Auto-initialization
- Tree traversal utilities

## Sync Parsing

```typescript
import { initializeParser, parseSync } from '@treant/graphql';

await initializeParser(); // Once at startup
const tree = parseSync(code); // Fast sync parsing
```

## License

MIT