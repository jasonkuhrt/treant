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

const QUERY = `
  query GetUser($id: ID!) @auth {
    user(id: $id) {
      name
      email @include(if: true)
      ... on Admin { role }
      ...UserData
    }
  }
  fragment UserData on User { avatar }
`;

test('extract all fields', () => {
  const tree = parser.parse(QUERY)!;
  const fields = TreeSitterGraphQL.Extractors.extractAllFields(tree.rootNode);

  const fieldTexts = fields.map(f => f.text);
  // Field text includes the entire field node, not just name and args
  expect(fieldTexts.some(t => t.includes('user(id: $id)'))).toBe(true);
  expect(fieldTexts).toContain('name');
  expect(fieldTexts.some(t => t.includes('email @include'))).toBe(true);
  expect(fieldTexts).toContain('role');
  expect(fieldTexts).toContain('avatar');
  expect(fields.every(f => f.type === 'field')).toBe(true);
});

test('extract all directives', () => {
  const tree = parser.parse(QUERY)!;
  const directives = TreeSitterGraphQL.Extractors.extractAllDirectives(tree.rootNode);

  const directiveTexts = directives.map(d => d.text);
  expect(directiveTexts).toContain('@auth');
  expect(directiveTexts).toContain('@include(if: true)');
  expect(directives.every(d => d.type === 'directive')).toBe(true);
});

test('extract all variables', () => {
  const tree = parser.parse(QUERY)!;
  const variables = TreeSitterGraphQL.Extractors.extractAllVariables(tree.rootNode);

  const variableTexts = variables.map(v => v.text);
  expect(variableTexts).toContain('$id');
  expect(variableTexts.filter(v => v === '$id').length).toBe(2); // definition and usage
  expect(variables.every(v => v.type === 'variable')).toBe(true);
});

test('extract all fragments', () => {
  const tree = parser.parse(QUERY)!;
  const fragments = TreeSitterGraphQL.Extractors.extractAllFragments(tree.rootNode);

  expect(fragments.spreads.map(s => s.text)).toContain('...UserData');
  expect(fragments.inline.map(i => i.text)).toContain('... on Admin { role }');
  expect(fragments.spreads.every(s => s.type === 'fragment_spread')).toBe(true);
  expect(fragments.inline.every(i => i.type === 'inline_fragment')).toBe(true);
});

test('extract all names', () => {
  const tree = parser.parse(QUERY)!;
  const names = TreeSitterGraphQL.Extractors.extractAllNames(tree.rootNode);

  expect(names).toContain('GetUser');
  expect(names).toContain('user');
  expect(names).toContain('name');
  expect(names).toContain('email');
  expect(names).toContain('ID');
  expect(names).toContain('UserData');
});
