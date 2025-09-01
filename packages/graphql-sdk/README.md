# @treant/graphql-sdk

TypeScript SDK for tree-sitter GraphQL parser.

## Installation

```bash
npm install @treant/graphql-sdk web-tree-sitter
```

Note: `web-tree-sitter` is a peer dependency.

## Usage

```typescript
import { TreantGraphQLSdk } from '@treant/graphql-sdk';

// Initialize parser
const parser = await TreantGraphQLSdk.Parser.init();

// Parse GraphQL
const tree = await TreantGraphQLSdk.Parser.parse(`query { user { name } }`);

// Type guards
if (TreantGraphQLSdk.Node.isOperationDefinition(tree.rootNode)) {
  // typed as OperationDefinition
}

// Navigate with type safety
const navigator = await TreantGraphQLSdk.Navigator.create(tree);
const field = navigator
  .child() // to document
  .child() // to operation_definition
  .selectionSet()
  .selections()
  .at(0);
```

## API

- **Parser** - Initialize and parse GraphQL
- **Node** - All AST node types and type guards
- **Navigator** - Type-safe chainable navigation
- **Cursor** - Low-level cursor API
- **Utils** - Tree traversal utilities

## Development

Code is generated - don't edit `src-generated/`.

## License

MIT