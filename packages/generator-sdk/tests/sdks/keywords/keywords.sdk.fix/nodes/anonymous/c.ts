import type { Node } from 'web-tree-sitter';

const TYPE = 'c' as const;

/**
 * Represents the anonymous 'c' node in the test_keywords AST.
 */
export interface C extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'c' anonymous node.
 */
export function isC(node: Node | null | undefined): node is C {
  return node?.type === TYPE && !node.isNamed;
}