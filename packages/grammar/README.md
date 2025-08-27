# @treant/grammar

TypeScript types and utilities for tree-sitter grammar definitions.

## Installation

```bash
npm install @treant/grammar
```

## Usage

```typescript
import * as Grammar from '@treant/grammar';

// Type-safe grammar.json structure
const grammar: Grammar.Types.GrammarJson = {
  name: "my-language",
  rules: {
    // ...
  }
};

// Check rule types
if (Grammar.Predicates.isSeqRule(rule)) {
  // Handle sequence rule
}

// Analyze grammar structure
const childTypes = Grammar.Analysis.extractChildTypes(rule);
```

## What's Included

- **Types** - Full TypeScript types for tree-sitter's grammar.json format
- **Predicates** - Type guards for checking grammar rule types
- **Analysis** - Functions for analyzing and extracting information from grammar rules

## License

MIT