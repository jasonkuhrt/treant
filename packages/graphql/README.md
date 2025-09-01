# @treant/graphql

GraphQL parser with TypeScript SDK.

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

// Type-safe AST navigation
const navigator = await TreantGraphQL.Navigator.create(tree);
const fieldName = navigator
  .child() // to document
  .child() // to operation_definition  
  .selectionSet()
  .selections()
  .at(0)
  ?.name();
```

## Exports

- Main: TypeScript SDK via `@treant/graphql`
- Grammar assets: `@treant/graphql/grammar/*`

## License

MIT