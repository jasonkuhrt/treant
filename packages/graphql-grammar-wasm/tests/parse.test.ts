import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {  expect, test as base } from 'vitest';
import { Language, Parser } from 'web-tree-sitter';
import { treeSitterAstSerializer } from '../../../tests/serializers/tree-sitter-ast.js';

expect.addSnapshotSerializer(treeSitterAstSerializer);

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = join(__dirname, '..', 'grammar.wasm');

// Create custom test with parser fixture
const test = base.extend<{ parser: Parser }>({
  parser: async ({}, use) => {
    // Initialize parser
    await Parser.init();
    const parser = new Parser();

    // Load GraphQL grammar from WASM
    const wasmBuffer = readFileSync(wasmPath);
    const GraphQL = await Language.load(wasmBuffer);
    parser.setLanguage(GraphQL);

    // Provide parser to tests
    await use(parser);
  },
});

// Register custom snapshot serializer for tree-sitter nodes
test('parses simple GraphQL document', ({ parser }) => {
  const document = readFileSync(
    join(__dirname, '../../../tests/fixtures/simple.graphql'),
    'utf-8',
  );
  const tree = parser.parse(document);
  expect(tree).toBeTruthy();
  expect(tree!.rootNode.hasError).toBe(false);
});

test('parses comprehensive GraphQL document', ({ parser }) => {
  // Load comprehensive GraphQL document from file
  const graphqlDocument = readFileSync(
    join(__dirname, '../../../tests/fixtures/comprehensive.graphql'),
    'utf-8',
  );

  // Parse the document
  const tree = parser.parse(graphqlDocument);

  // Snapshot test the AST structure
  expect(tree).toBeTruthy();
  expect(tree!.rootNode).toMatchSnapshot();
  expect(tree!.rootNode.hasError).toBe(false);
});
