import type { Node } from 'web-tree-sitter';

const TYPE = 'b' as const;

/**
 * Represents the anonymous 'b' node in the test_keywords AST.
 */
export interface B extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'b' anonymous node.
 */
export function isB(node: Node | null | undefined): node is B {
  return node?.type === TYPE && !node.isNamed;
}