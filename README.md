# tree-sitter-graphql-grammar-wasm

Pre-built WASM binary for the tree-sitter GraphQL grammar with optional TypeScript support.

## Installation

### WASM Only (no additional dependencies)

```bash
npm install tree-sitter-graphql-grammar-wasm
```

### With TypeScript Support

```bash
npm install tree-sitter-graphql-grammar-wasm web-tree-sitter
```

The `web-tree-sitter` dependency is optional - install it only if you want to use the generated TypeScript types for AST nodes.

## Usage

### Package Exports

This package provides two main exports:

- **Main export** (`import {} from 'tree-sitter-graphql-grammar-wasm'`): TreeSitterGraphQL namespace with all AST types, guards, and constructors
- **WASM binary** (`import wasmUrl from 'tree-sitter-graphql-grammar-wasm/grammar.wasm?url'`): Pre-compiled parser for tree-sitter

### WASM Grammar (Basic Usage)

#### NodeJS

```typescript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Language, Parser } from 'web-tree-sitter';

// Initialize the parser
await Parser.init();
const parser = new Parser();

// Load the GraphQL grammar
const wasmPath = fileURLToPath(
  new URL(
    './node_modules/tree-sitter-graphql-grammar-wasm/grammar.wasm',
    import.meta.url,
  ),
);
const wasmBuffer = readFileSync(wasmPath);
const GraphQL = await Language.load(wasmBuffer);
parser.setLanguage(GraphQL);

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`);

console.log(tree.rootNode.toString());
```

#### Vite

```typescript
import grammarUrl from 'tree-sitter-graphql-grammar-wasm/grammar.wasm?url';
import { Language, Parser } from 'web-tree-sitter';

// Initialize the parser
await Parser.init();
const parser = new Parser();

// Load the GraphQL grammar
const GraphQL = await Language.load(grammarUrl);
parser.setLanguage(GraphQL);

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`);

console.log(tree.rootNode.toString());
```

### TypeScript Types (Advanced Usage)

When you install `web-tree-sitter`, you get access to strongly-typed AST node interfaces, type guards, and constructor functions.

#### Using the TreeSitterGraphQL Namespace

```typescript
import { TreeSitterGraphQL } from 'tree-sitter-graphql-grammar-wasm';
import { Parser } from 'web-tree-sitter';

// Type-safe access to all GraphQL AST node types
type AnyGraphQLNode = TreeSitterGraphQL.Node;
type FieldNode = TreeSitterGraphQL.FieldNode;

// Use type guards for runtime type checking
function processNode(node: AnyGraphQLNode) {
  if (TreeSitterGraphQL.isFieldNode(node)) {
    // TypeScript now knows node is FieldNode
    console.log(`Field: ${node.type}`); // node.type is 'field'
  }
}

// Create nodes with constructors (useful for testing)
const field = TreeSitterGraphQL.FieldNode({
  name: TreeSitterGraphQL.NameNode({/* ... */}),
  // other properties...
});
```

#### Direct Node Type Imports

```typescript
import { TreeSitterGraphQL } from 'tree-sitter-graphql-grammar-wasm';

// Access specific types from the namespace
type ArgumentNode = TreeSitterGraphQL.ArgumentNode;
type FieldNode = TreeSitterGraphQL.FieldNode;
const { isFieldNode } = TreeSitterGraphQL;

function analyzeField(node: FieldNode) {
  // Full type safety for GraphQL field nodes
  console.log(node.children); // Typed as specific child node types
}
```

#### Why web-tree-sitter?

The TypeScript types extend `Node` from `web-tree-sitter` for the following reasons:

- **Universal compatibility**: Works in both Node.js and browser environments
- **WASM alignment**: Matches our WASM-based distribution model
- **Single distribution**: No platform-specific builds required

**Note**: web-tree-sitter's TypeScript definitions are less complete than node-tree-sitter's, but the runtime API is fully functional. See the [known limitations](https://github.com/tree-sitter/tree-sitter/issues/349) for details.

## Development

### Prerequisites

- Node.js 24+
- pnpm

### Setup

```bash
pnpm install
pnpm build          # Full build: TypeScript → Parser → WASM
pnpm check:types    # Type check TypeScript files
pnpm test           # Run integration tests
```

### Build Commands

```bash
pnpm build:grammar  # Compile TypeScript grammar to JavaScript
pnpm gen:parser     # Generate C parser from compiled grammar
pnpm gen:grammar-lib    # Generate TypeScript library from parser metadata
pnpm build:wasm     # Compile C parser to WASM (requires Docker)
pnpm build          # Run full build pipeline
```

## Architecture

### Project Structure

```
.
├── grammar-definition/         # Tree-sitter grammar source
│   └── grammar.ts              # Tree-sitter grammar definition (TypeScript)
├── grammar-definition-js/      # Compiled JavaScript grammar (git-ignored)
│   └── grammar.js              # Compiled grammar for tree-sitter CLI
├── grammar-lib/                # Generated TypeScript AST library (git-ignored)
│   ├── $.ts                    # Namespace export (TreeSitterGraphQL)
│   ├── $$.ts                   # Barrel export + Node union type
│   ├── types.ts                # Re-exports from web-tree-sitter + documentation
│   └── nodes/                  # AST node definitions
│       ├── field.ts            # FieldNode interface, guard, constructor
│       ├── argument.ts         # ArgumentNode interface, guard, constructor
│       └── ...                 # One file per AST node type (74 total)
├── parser/                     # Generated parser files (git-ignored)
│   └── src/                    # Generated C parser source files
│       └── node-types.json     # AST node type metadata (generated by tree-sitter)
├── scripts/                    # Build and generation scripts
│   └── gen-grammar-lib.ts      # Generates TypeScript AST node library
├── tree-sitter.json            # Tree-sitter project configuration
├── grammar.wasm                # Pre-built WASM binary (distributed)
├── queries/                    # Legacy query files, unused (see below)
├── tsconfig.json               # TypeScript configuration
├── tsconfig.build.json         # Build-specific TypeScript configuration
└── tests/                      # Integration tests
```

### Flow

1. **Edit Grammar** - Modify `grammar-definition/grammar.ts` to change the GraphQL parsing rules (with full TypeScript support)
2. **Compile TypeScript** - Run `pnpm build:grammar` which compiles `grammar-definition/grammar.ts` → `grammar-definition-js/grammar.js`
3. **Generate Parser** - Run `pnpm gen:parser` which:
   - Uses the compiled JavaScript grammar from `grammar-definition-js/grammar.js`
   - Creates C parser code in `parser/src/` (see Project Structure above for details)
   - Generates `parser/src/node-types.json` with AST metadata
   - Auto-generates TypeScript library in `grammar-lib/` for type-safe AST access
4. **Build WASM** - Run `pnpm build:wasm` to compile `parser/src/parser.c` → `grammar.wasm` (uses Docker for emscripten)
5. **Test** - Run `pnpm test` and `pnpm check:types` to verify the grammar works correctly
6. **Ship** - Only `grammar.wasm` is published to npm for JavaScript/TypeScript consumers; `grammar-definition-js/` and `parser/` are git-ignored

### Type Generation

The project automatically generates TypeScript types from the tree-sitter parser metadata:

#### RuleName Type (for grammar definition)

- **Source**: Derived from `TreeSitterGraphQL.Node['type']` in `grammar-lib/`
- **Purpose**: Type safety for grammar rule references using indexed type access
- **Usage**: `type RuleName = TreeSitterGraphQL.Node['type']` in `grammar.ts`

#### AST Node Library (for consumers)

- **Output**: `grammar-lib/` directory with:
  - TypeScript interfaces for each AST node type (extending web-tree-sitter's `Node`)
  - Type guards (`isFieldNode()`, `isArgumentNode()`, etc.)
  - Constructor functions (`FieldNode()`, `ArgumentNode()`, etc.)
  - `TreeSitterGraphQL` namespace for organized access to all types
- **Purpose**: Type-safe access to parsed GraphQL AST with web-tree-sitter compatibility
- **Structure**:
  - One file per node type with interface, guard, and constructor
  - Namespace pattern: `$.ts` (namespace) and `$$.ts` (barrel + union type)
  - Union type `TreeSitterGraphQL.Node` for any GraphQL AST node

#### Generation Details

- **Source**: `parser/src/node-types.json` (generated by tree-sitter)
- **Generator**: `scripts/gen-grammar-lib.ts`
- **Trigger**: Runs automatically after `pnpm gen:parser` via `postgen:parser` hook
- **Benefits**: Eliminates manual maintenance and ensures types stay synchronized

### Notes

The `queries/` directory contains [tree-sitter query files](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries) for syntax highlighting, inherited from the original tree-sitter-graphql repository. These aren't used by the WASM package and may be removed in a future version of this project.

## Credits

The grammar is based on [tree-sitter-graphql](https://github.com/bkegley/tree-sitter-graphql). I have modernized this package but the basic grammar structure remains the same.
