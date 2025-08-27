import { TreeSitterGraphQL } from '@treant/graphql-sdk';

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

async function main() {
  // Create parser
  const parser = await TreeSitterGraphQL.Utils.createGraphQLParser({
    graphqlWasmPath: 'node_modules/@treant/graphql-grammar-wasm/grammar.wasm',
  });

  // Parse the GraphQL query
  const tree = parser.parse(query);

  if (!tree) {
    console.error('Failed to parse query');
    return;
  }

  // Create a cursor for navigation
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  console.log('Root node type:', cursor.nodeType);

  // Navigate through the AST
  const document = cursor.gotoFirstChild();
  if (document) {
    console.log('Document node:', document.nodeType);

    const definition = document.gotoFirstChild();
    if (definition) {
      console.log('Definition type:', definition.nodeType);
    }
  }

  // Use utility functions to find specific nodes
  const fieldNodes = TreeSitterGraphQL.Extractors.extractAllFields(tree.rootNode);
  console.log('\nFields found in query:');
  fieldNodes.forEach(field => {
    console.log('  -', field.text);
  });

  // Get metadata about the AST
  const metadata = TreeSitterGraphQL.Metadata.getNodeMetadata(tree.rootNode);
  console.log('\nAST Metadata:', metadata);
}

main().catch(console.error);
