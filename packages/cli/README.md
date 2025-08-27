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
treant generate library --grammar graphql --output ./src-generated
```

## Commands

- `treant generate library` - Generate TypeScript SDK from Tree-sitter grammar