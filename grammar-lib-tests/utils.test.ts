import { beforeAll, describe, expect, test } from 'vitest';
import type { Parser, Tree } from 'web-tree-sitter';
import { TreeSitterGraphQL } from '../grammar-lib/$.js';
import { createGraphQLParser } from '../grammar-lib/parser-helper.js';

describe('Layer 1: Generic Tree Utilities', () => {
  let parser: Parser;
  let tree: Tree;

  beforeAll(async () => {
    parser = await createGraphQLParser({
      treeSitterWasmPath: 'node_modules/web-tree-sitter/tree-sitter.wasm',
      graphqlWasmPath: 'grammar.wasm',
    });

    const source = `
      query GetUser($id: ID!) {
        user(id: $id) {
          name
          email
        }
      }
    `;

    tree = parser.parse(source)!;
  });

  test('findChildByType should find first child of specified type', () => {
    const root = tree.rootNode;
    const document = TreeSitterGraphQL.Utils.findChildByType(root, 'document');

    expect(document).not.toBeNull();
    expect(document?.type).toBe('document');
  });

  test('findChildrenByType should find all children of specified type', () => {
    const root = tree.rootNode;
    const allDocuments = TreeSitterGraphQL.Utils.findChildrenByType(root, 'document');

    expect(allDocuments).toHaveLength(1);
    expect(allDocuments![0]!.type).toBe('document');
  });

  test('findChildByPath should traverse node path correctly', () => {
    const root = tree.rootNode;

    // Try to find a nested node: source_file -> document -> definition -> executable_definition -> operation_definition
    const operationDef = TreeSitterGraphQL.Utils.findChildByPath(root, [
      'document',
      'definition',
      'executable_definition',
      'operation_definition',
    ]);

    expect(operationDef).not.toBeNull();
    expect(operationDef?.type).toBe('operation_definition');
  });

  test('walkTree should visit all nodes in the AST', () => {
    const root = tree.rootNode;
    const visitedTypes: string[] = [];

    TreeSitterGraphQL.Utils.walkTree(root, (node) => {
      visitedTypes.push(node.type);
    });

    // Should visit at least these basic types
    expect(visitedTypes).toContain('source_file');
    expect(visitedTypes).toContain('document');
    expect(visitedTypes).toContain('operation_definition');
    expect(visitedTypes).toContain('name');
    expect(visitedTypes.length).toBeGreaterThan(10);
  });
});
