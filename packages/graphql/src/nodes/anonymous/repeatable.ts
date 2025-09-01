import type { Node } from 'web-tree-sitter';

const TYPE = 'repeatable' as const;

/**
 * Represents the anonymous 'repeatable' node in the graphql AST.
 */
export interface Repeatable extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'repeatable' anonymous node.
 */
export function isRepeatable(node: Node | null | undefined): node is Repeatable {
  return node?.type === TYPE && !node.isNamed;
}