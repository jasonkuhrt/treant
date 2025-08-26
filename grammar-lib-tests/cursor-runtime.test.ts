import { beforeAll, expect, test } from 'vitest';
import type { Parser } from 'web-tree-sitter';
import { TreeSitterGraphQL } from '../grammar-lib/$.js';

let parser: Parser;

beforeAll(async () => {
  parser = await TreeSitterGraphQL.Utils.createGraphQLParser({
    treeSitterWasmPath: 'node_modules/web-tree-sitter/tree-sitter.wasm',
    graphqlWasmPath: 'grammar.wasm',
  });
});

test('cursor creation and raw access', () => {
  const tree = parser.parse('{ a }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  expect(cursor.nodeType).toBe('source_file');
  expect(cursor.raw.nodeText).toBe('{ a }');
  expect(cursor.node.type).toBe('source_file');
});

test('basic navigation returns cursors or null', () => {
  const tree = parser.parse('{ a }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  const child = cursor.gotoFirstChild();
  expect(child?.nodeType).toBe('document');

  const parent = child!.gotoParent();
  expect(parent?.nodeType).toBe('source_file');

  // Navigate until we hit a leaf node
  let current = cursor;
  while (current.gotoFirstChild()) {
    current = current.gotoFirstChild()!;
  }
  // Now try to go deeper - should be null
  expect(current.gotoFirstChild()).toBeNull();
});

test('sibling navigation', () => {
  const tree = parser.parse('{ a b c }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  // Navigate to selection_set
  const selectionSet = cursor
    .gotoFirstChild()! // document
    .gotoFirstChild()! // definition
    .gotoFirstChild()! // executable_definition
    .gotoFirstChild()! // operation_definition
    .gotoFirstChild()!; // selection_set

  // Get first selection (skip '{')
  const firstSelection = selectionSet.gotoFirstChild()!.gotoNextSibling()!;

  // Count siblings
  let count = 1;
  let current = firstSelection;
  let next = current.gotoNextSibling();
  while (next) {
    if (next.nodeType === 'selection') count++;
    current = next;
    next = current.gotoNextSibling();
  }
  expect(count).toBe(3);
});

test('navigation through GraphQL query structure', () => {
  const tree = parser.parse('query($x: Int) { field @dir(arg: true) { sub } }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  // Navigate to operation_definition
  const opDef = cursor
    .gotoFirstChild()! // document
    .gotoFirstChild()! // definition
    .gotoFirstChild()! // executable_definition
    .gotoFirstChild()!; // operation_definition

  expect(opDef.nodeType).toBe('operation_definition');

  // Operation has: operation_type, variable_definitions, selection_set
  const opType = opDef.gotoFirstChild()!;
  expect(opType.nodeType).toBe('operation_type');
  expect(opType.raw.nodeText).toBe('query');

  // Variable definitions
  const varDefs = opType.gotoNextSibling()!;
  expect(varDefs.nodeType).toBe('variable_definitions');

  // Selection set
  const selSet = varDefs.gotoNextSibling()!;
  expect(selSet.nodeType).toBe('selection_set');
});

test('fragment spread navigation', () => {
  const tree = parser.parse('{ ...FragmentName @dir }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  const fragmentSpread = cursor
    .gotoFirstChild()! // document
    .gotoFirstChild()! // definition
    .gotoFirstChild()! // executable_definition
    .gotoFirstChild()! // operation_definition
    .gotoFirstChild()! // selection_set
    .gotoFirstChild()! // {
    .gotoNextSibling()! // selection
    .gotoFirstChild()!; // fragment_spread

  expect(fragmentSpread.nodeType).toBe('fragment_spread');

  // Fragment spread has: ... and fragment_name
  const dots = fragmentSpread.gotoFirstChild()!;
  expect(dots.nodeType).toBe('...');

  const fragName = dots.gotoNextSibling()!;
  expect(fragName.nodeType).toBe('fragment_name');
});

test('field with directive navigation', () => {
  const tree = parser.parse('{ field @skip(if: true) }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  const field = cursor
    .gotoFirstChild()! // document
    .gotoFirstChild()! // definition
    .gotoFirstChild()! // executable_definition
    .gotoFirstChild()! // operation_definition
    .gotoFirstChild()! // selection_set
    .gotoFirstChild()! // {
    .gotoNextSibling()! // selection
    .gotoFirstChild()!; // field

  // Field has name then directive
  const name = field.gotoFirstChild()!;
  expect(name.nodeType).toBe('name');
  expect(name.raw.nodeText).toBe('field');

  const directive = name.gotoNextSibling()!;
  expect(directive.nodeType).toBe('directive');
});

test('cursor maintains TreeCursor interface', () => {
  const tree = parser.parse('{ a }')!;
  const cursor = TreeSitterGraphQL.Cursor.createTreeCursorGraphQL(tree);

  // All TreeCursor methods available via raw
  expect(typeof cursor.raw.gotoDescendant).toBe('function');
  expect(typeof cursor.raw.copy).toBe('function');
  expect(typeof cursor.raw.delete).toBe('function');
  expect(typeof cursor.raw.nodeText).toBe('string');
  expect(cursor.raw.startPosition).toHaveProperty('row');
  expect(cursor.raw.startPosition).toHaveProperty('column');
});
