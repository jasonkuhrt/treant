import type { Node } from 'web-tree-sitter';

const TYPE = 'union' as const;

/**
 * Represents the anonymous 'union' node in the graphql AST.
 */
export interface Union extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'union' anonymous node.
 */
export function isUnion(node: Node | null | undefined): node is Union {
  return node?.type === TYPE && !node.isNamed;
}