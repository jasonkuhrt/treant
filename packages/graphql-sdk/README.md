# @treant/graphql-sdk

TypeScript SDK for tree-sitter GraphQL parser.

## Installation

```bash
npm install @treant/graphql-sdk web-tree-sitter
```

Note: `web-tree-sitter` is a peer dependency.

## Usage

```typescript
import { Parser } from 'web-tree-sitter';
import { Node, Utils, Cursor } from '@treant/graphql-sdk';

// Parse (see @treant/graphql-grammar for parser setup)
const tree = parser.parse(`query { user { name } }`);

// Type guards
if (Node.isOperationDefinition(tree.rootNode)) {
  // typed as OperationDefinition
}

// Find nodes
const fields = Utils.findChildrenByType(tree.rootNode, 'field');

// Cursor navigation
const cursor = Cursor.create(tree.rootNode);
const name = cursor
  .child('operation_definition')
  .child('selection_set')
  .child('field')
  .child('name');
```

## API

- **Node** - All AST node types and guards
- **Utils** - Tree traversal utilities
- **Cursor** - Type-safe navigation
- **Extractors** - Query helpers
- **Metadata** - AST introspection

## Development

Code is generated - don't edit `src-generated/`.

## License

MIT