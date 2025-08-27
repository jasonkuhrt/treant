# @treant/core

Core utilities for treant tree-sitter tools.

## Features

- Grammar resolution and discovery
- Input parsing (PathOrLiteral schema)
- Package utilities
- String case conversion utilities

## Usage

```typescript
import { resolveGrammarPaths, GrammarInputSchema } from '@treant/core';

// Resolve grammar paths
const { grammarPath, nodeTypesPath } = await resolveGrammarPaths(grammarInput);
```