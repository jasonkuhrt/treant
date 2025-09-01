import type { Node } from 'web-tree-sitter';

const TYPE = 'a' as const;

/**
 * Represents the anonymous 'a' node in the keywords AST.
 */
export interface A extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'a' anonymous node.
 */
export function isA(node: Node | null | undefined): node is A {
  return node?.type === TYPE && !node.isNamed;
}