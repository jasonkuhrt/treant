import { beforeAll, expect, test } from 'vitest';
import type { Parser } from 'web-tree-sitter';
import { TreeSitterGraphQL } from '../grammar-lib/$.js';
import { createGraphQLParser } from '../grammar-lib/parser-helper.js';

let parser: Parser;

beforeAll(async () => {
  parser = await createGraphQLParser({
    treeSitterWasmPath: 'node_modules/web-tree-sitter/tree-sitter.wasm',
    graphqlWasmPath: 'grammar.wasm',
  });
});

const COMPLEX_QUERY = `
  query GetUser($id: ID!) @auth {
    user(id: $id) {
      id
      name @include(if: true)
      ... on PremiumUser {
        premium
      }
      ...Fragment
    }
  }
  fragment Fragment on User { email }
`;

test('all namespaces are exported', () => {
  expect(TreeSitterGraphQL.Utils).toBeDefined();
  expect(TreeSitterGraphQL.Accessors).toBeDefined();
  expect(TreeSitterGraphQL.Extractors).toBeDefined();
  expect(TreeSitterGraphQL.Metadata).toBeDefined();
  expect(TreeSitterGraphQL.Cursor).toBeDefined();
});

test('extract all GraphQL elements', () => {
  const tree = parser.parse(COMPLEX_QUERY)!;
  const root = tree.rootNode;

  const fields = TreeSitterGraphQL.Extractors.extractAllFields(root);
  const variables = TreeSitterGraphQL.Extractors.extractAllVariables(root);
  const directives = TreeSitterGraphQL.Extractors.extractAllDirectives(root);
  const fragments = TreeSitterGraphQL.Extractors.extractAllFragments(root);

  expect(fields.map(f => f.text)).toContain('id');
  expect(fields.map(f => f.text)).toContain('name @include(if: true)');
  expect(variables.map(v => v.text)).toContain('$id');
  expect(directives.map(d => d.text)).toContain('@auth');
  expect(directives.map(d => d.text)).toContain('@include(if: true)');
  expect(fragments.spreads.map(s => s.text)).toContain('...Fragment');
  expect(fragments.inline.length).toBe(1);
});

test('type guards work', () => {
  const tree = parser.parse('{ field }')!;
  const root = tree.rootNode;

  const field = TreeSitterGraphQL.Extractors.extractAllFields(root)[0];
  expect(TreeSitterGraphQL.isFieldNode(field)).toBe(true);
  expect(TreeSitterGraphQL.isFieldNode(root)).toBe(false);
});

test('metadata provides node info', () => {
  const tree = parser.parse('{ field }')!;
  const root = tree.rootNode;

  const metadata = TreeSitterGraphQL.Metadata.getNodeMetadata(root);
  expect(metadata.hasError).toBe(false);
  expect(metadata.childCount).toBeGreaterThan(0);
  expect(TreeSitterGraphQL.Metadata.validateNodeStructure(root)).toBe(true);
});

test('handles null inputs gracefully', () => {
  expect(TreeSitterGraphQL.Utils.findChildByType(null as any, 'field')).toBeNull();
  expect(TreeSitterGraphQL.Metadata.getPossibleChildTypes('invalid_type')).toEqual([]);
  expect(TreeSitterGraphQL.Extractors.extractAllFields(null as any)).toEqual([]);
});
