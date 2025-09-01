import type { Node } from 'web-tree-sitter';

const TYPE = 'type' as const;

/**
 * Represents the anonymous 'type' node in the graphql AST.
 */
export interface Type extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'type' anonymous node.
 */
export function isType(node: Node | null | undefined): node is Type {
  return node?.type === TYPE && !node.isNamed;
}