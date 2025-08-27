# Treant

Tree-sitter GraphQL parser with TypeScript SDK.

## Packages

| Package | Description |
| ------- | ----------- |
| `@treant/graphql` | All-in-one GraphQL parser |
| `@treant/graphql-sdk` | TypeScript SDK only |
| `@treant/graphql-grammar-wasm` | WASM binary only |
| `@treant/generator` | Generate SDKs for any grammar |

## Quick Start

```bash
npm install @treant/graphql
```

```typescript
import { parse, Node } from '@treant/graphql';

const tree = await parse(`query { hello }`);

if (Node.isOperationDefinition(tree.rootNode)) {
  console.log('It's a query!');
}
```

## Development

```bash
pnpm install
pnpm build
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for details.

## Credits

Grammar based on [treant](https://github.com/bkegley/treant).