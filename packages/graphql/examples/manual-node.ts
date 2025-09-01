import { TreantGraphQL } from '../build/$$.js';

// Parse GraphQL code using the SDK's parser
const tree = await TreantGraphQL.Parser.parse(`
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
function findNodes(
  node: TreantGraphQL.Node.Node,
  type: string,
  results: TreantGraphQL.Node.Node[] = [],
): TreantGraphQL.Node.Node[] {
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
