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

test('accessors extract specific child nodes', () => {
  const tree = parser.parse('{ user { name } }')!;
  const root = tree.rootNode;

  // Get fields from a query
  const fields = TreeSitterGraphQL.Extractors.extractAllFields(root);
  expect(fields.length).toBe(2); // user and name

  // Field node's text includes the whole field with selection set
  const userField = fields.find(f => f.text.includes('user'));
  expect(userField).toBeDefined();

  const fieldNameNode = TreeSitterGraphQL.Utils.findChildByType(userField!, 'name');
  expect(fieldNameNode?.text).toBe('user');
});

test('accessors return null for missing children', () => {
  const tree = parser.parse('type User { name: String }')!;
  const root = tree.rootNode;

  // Find field_definition properly
  const typeDef = TreeSitterGraphQL.Utils.findChildByPath(root, [
    'document',
    'definition',
    'type_system_definition',
    'type_definition',
    'object_type_definition',
  ]);
  const fieldsDef = TreeSitterGraphQL.Utils.findChildByType(typeDef!, 'fields_definition');
  const fieldDef = TreeSitterGraphQL.Utils.findChildByType(fieldsDef!, 'field_definition');

  // Verify it's actually a field definition
  expect(fieldDef?.type).toBe('field_definition');

  // Now test the accessor - cast is safe because we verified the type
  const desc = TreeSitterGraphQL.Accessors.getDescriptionFromFieldDefinition(fieldDef as any);
  expect(desc).toBeNull();

  const args = TreeSitterGraphQL.Accessors.getArgumentsDefinitionFromFieldDefinition(fieldDef as any);
  expect(args).toBeNull();

  // Name should exist
  const name = TreeSitterGraphQL.Accessors.getNameFromFieldDefinition(fieldDef as any);
  expect(name?.text).toBe('name');

  // Type should exist
  const type = TreeSitterGraphQL.Accessors.getTypeFromFieldDefinition(fieldDef as any);
  expect(type?.text).toBe('String');
});

test('accessors work with directives', () => {
  const tree = parser.parse('extend schema @dir { query: Query }')!;
  const ext = TreeSitterGraphQL.Utils.findChildByPath(tree.rootNode, [
    'document',
    'definition',
    'type_system_extension',
    'schema_extension',
  ]);

  expect(ext?.type).toBe('schema_extension');

  const directives = TreeSitterGraphQL.Accessors.getDirectivesFromSchemaExtension(ext as any);
  expect(directives?.text).toContain('@dir');
});
