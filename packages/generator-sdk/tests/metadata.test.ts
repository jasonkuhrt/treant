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

test('getNodeMetadata returns comprehensive info', () => {
  const tree = parser.parse('query { user { name } }')!;
  const metadata = TreeSitterGraphQL.Metadata.getNodeMetadata(tree.rootNode);

  expect(metadata.type).toBe('source_file');
  expect(metadata.childCount).toBeGreaterThan(0);
  expect(metadata.childTypes).toBeInstanceOf(Array);
  expect(metadata.isNamed).toBe(true);
  expect(metadata.hasError).toBe(false);
  expect(metadata.textLength).toBeGreaterThan(0);
  expect(metadata.depth).toBe(0);
});

test('getNodeDepth calculates correct depth', () => {
  const tree = parser.parse('query { user { name } }')!;
  const root = tree.rootNode;

  expect(TreeSitterGraphQL.Metadata.getNodeDepth(root)).toBe(0);

  const document = TreeSitterGraphQL.Utils.findChildByType(root, 'document');
  expect(TreeSitterGraphQL.Metadata.getNodeDepth(document!)).toBe(1);
});

test('getPossibleChildTypes returns valid types', () => {
  const childTypes = TreeSitterGraphQL.Metadata.getPossibleChildTypes('field');

  expect(childTypes).toBeInstanceOf(Array);
  expect(childTypes).toContain('name');

  // Unknown types return empty array
  expect(TreeSitterGraphQL.Metadata.getPossibleChildTypes('nonexistent')).toEqual([]);
});

test('validateNodeStructure validates nodes', () => {
  const tree = parser.parse('query { user { name } }')!;
  expect(TreeSitterGraphQL.Metadata.validateNodeStructure(tree.rootNode)).toBe(true);
});

test('getASTSummary generates readable tree', () => {
  const tree = parser.parse('query { user { name } }')!;
  const summary = TreeSitterGraphQL.Metadata.getASTSummary(tree.rootNode, 2);

  expect(summary).toContain('source_file');
  expect(summary).toContain('children');
  expect(summary).toContain('  '); // indentation

  // Deeper summary is longer
  const deep = TreeSitterGraphQL.Metadata.getASTSummary(tree.rootNode, 3);
  const shallow = TreeSitterGraphQL.Metadata.getASTSummary(tree.rootNode, 1);
  expect(deep.length).toBeGreaterThanOrEqual(shallow.length);
});
