import type { Node } from 'web-tree-sitter';

const TYPE = 'false' as const;

/**
 * Represents the anonymous 'false' node in the graphql AST.
 */
export interface False extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'false' anonymous node.
 */
export function isFalse(node: Node | null | undefined): node is False {
  return node?.type === TYPE && !node.isNamed;
}