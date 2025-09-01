import type { Node } from 'web-tree-sitter';

const TYPE = 'true' as const;

/**
 * Represents the anonymous 'true' node in the graphql AST.
 */
export interface True extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'true' anonymous node.
 */
export function isTrue(node: Node | null | undefined): node is True {
  return node?.type === TYPE && !node.isNamed;
}