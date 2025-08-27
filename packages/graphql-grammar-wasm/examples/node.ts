import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Language, type Node, Parser } from 'web-tree-sitter';

// Initialize the parser
await Parser.init();
const parser = new Parser();

// Load the GraphQL grammar from this package
const wasmPath = fileURLToPath(
  new URL('../grammar.wasm', import.meta.url),
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
        posts {
          title
          content
        }
      }
    }
  `);

// Check if parse was successful
if (!tree) {
  console.error('Failed to parse GraphQL');
  process.exit(1);
}

// Traverse the AST
console.log('Root node:', tree.rootNode.type);
console.log('Full tree:', tree.rootNode.toString());

// Find specific nodes
function findNodes(node: Node, type: string, results: Node[] = []): Node[] {
  if (node.type === type) {
    results.push(node);
  }
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      findNodes(child, type, results);
    }
  }
  return results;
}

const fields = findNodes(tree.rootNode, 'field');
console.log('\nFields found:', fields.map(f => f.text));

// Example: Query specific node types
const queries = findNodes(tree.rootNode, 'operation_definition');
console.log('\nQueries found:', queries.length);

// Example: Check for errors
console.log('Has errors:', tree.rootNode.hasError);
