# tree-sitter-graphql-grammar-wasm

Pre-built WASM binary for the tree-sitter GraphQL grammar.

## Installation

```bash
npm install tree-sitter-graphql-grammar-wasm
```

## Usage

```javascript
import grammarUrl from 'tree-sitter-graphql-grammar-wasm/grammar.wasm?url'
import Parser from 'web-tree-sitter'

// Initialize the parser
await Parser.init()
const parser = new Parser()

// Load the GraphQL grammar
const GraphQL = await Parser.Language.load(grammarUrl)
parser.setLanguage(GraphQL)

// Parse GraphQL code
const tree = parser.parse(`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
    }
  }
`)

console.log(tree.rootNode.toString())
```

## Credits

This package provides a pre-built WASM binary of the [tree-sitter-graphql](https://github.com/bkegley/tree-sitter-graphql) grammar.

## License

MIT