import type { Node } from 'web-tree-sitter';

const TYPE = 'extend' as const;

/**
 * Represents the anonymous 'extend' node in the graphql AST.
 */
export interface Extend extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'extend' anonymous node.
 */
export function isExtend(node: Node | null | undefined): node is Extend {
  return node?.type === TYPE && !node.isNamed;
}