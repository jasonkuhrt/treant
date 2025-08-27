# Development

## Quick Start

```bash
pnpm install
pnpm build    # Builds everything in order
pnpm test     # Run tests
```

## Packages

```
packages/
├── graphql-grammar/      # Grammar definition (private)
├── graphql-grammar-wasm/ # WASM binary
├── generator/            # SDK generator tool  
├── graphql-sdk/          # Generated TypeScript SDK
└── graphql/              # All-in-one wrapper
```

## Common Tasks

**Change the grammar:**
1. Edit `packages/graphql-grammar/grammar.js`
2. Run `pnpm build`

**Work on the SDK:**
1. SDK code is generated - don't edit `src-generated/`
2. To change generation, edit `packages/generator/`
3. Run `pnpm build` to regenerate

**Build specific package:**
```bash
turbo build --filter=@treant/graphql-sdk
```

## How It Works

Turborepo handles the build order automatically:

1. Grammar → C parser
2. Grammar → Generator → SDK
3. Grammar → WASM
4. Everything → Wrapper package

## Publishing

Published packages:
- `@treant/generator` - SDK generator
- `@treant/graphql-grammar-wasm` - WASM binary
- `@treant/graphql-sdk` - TypeScript SDK
- `@treant/graphql` - Complete package

Private:
- `@treant/graphql-grammar` - Internal only