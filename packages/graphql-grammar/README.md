# @treant/graphql-grammar

Tree-sitter GraphQL grammar definition (internal package).

## Structure

```
grammar.js          # Grammar source
src/               # Generated C parser (gitignored)
  ├── grammar.json
  ├── node-types.json
  └── parser.c
```

## Notes

- `src/` contains generated files (gitignored)
- Tree-sitter expects generated files in `src/` for WASM compilation
