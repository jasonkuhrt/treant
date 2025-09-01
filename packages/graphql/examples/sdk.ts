import { TreantGraphQL } from '../build/$$.js';

// Example GraphQL query
const query = `
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
`;

// Parse the GraphQL query using idiomatic Parser.parse
const ast = await TreantGraphQL.Parser.parse(query);

console.log('Root node type:', ast.rootNode.type);
console.log('Root node is named:', ast.rootNode.isNamed);

// Use type guards to check node types
if (TreantGraphQL.Node.isDocument(ast.rootNode)) {
  console.log('✓ Root is a document node');

  // Navigate through children
  const firstChild = ast.rootNode.firstChild;
  if (firstChild && TreantGraphQL.Node.isDefinition(firstChild)) {
    console.log('✓ First child is a definition');
    console.log('  Definition type:', firstChild.type);
  }
}

// Use Navigator for type-safe navigation
const $ = await TreantGraphQL.Navigator.create(ast);
console.log('Navigator path:', $.path);

// Navigate to the document node
console.log('\nDocument node:', $.child().node);
console.log('Text:', $.child().node.text.substring(0, 50) + '...');
