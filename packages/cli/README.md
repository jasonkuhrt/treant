# @treant/cli

Tree-sitter tools CLI.

## Installation

```bash
npm install -g @treant/cli
```

## Commands

### `treant generate all`

Generate both grammar artifacts and TypeScript SDK with caching:

```bash
treant generate all
```

Options:
- `--grammar-dir` - Grammar source directory (default: `grammar`)
- `--out-dir-grammar` - Grammar output directory (default: `grammar-build`)
- `--out-dir-sdk` - SDK output directory (default: `sdk`)
- `--force` - Force regeneration of both
- `--force-grammar` - Force regeneration of grammar only
- `--force-sdk` - Force regeneration of SDK only

### `treant generate grammar`

Generate grammar artifacts from grammar.js:

```bash
treant generate grammar
```

### `treant generate library`

Generate TypeScript SDK from grammar artifacts:

```bash
treant generate library --grammar ./grammar-build
```