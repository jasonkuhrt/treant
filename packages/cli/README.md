# @treant/cli

Command-line interface for Treant tree-sitter tools.

## Installation

```bash
npm install -g @treant/cli
```

## Usage

### Generate Library

Generate a TypeScript SDK from a Tree-sitter grammar:

```bash
treant generate library --grammar ./path/to/grammar/src --output ./src-generated
```

Options:
- `--grammar, -g` - Path to directory containing grammar.json and node-types.json
- `--output, -o` - Output directory (default: src-generated)
- `--name, -n` - Display name override (e.g., "GraphQL")

## Commands

- `treant generate library` - Generate TypeScript SDK from Tree-sitter grammar