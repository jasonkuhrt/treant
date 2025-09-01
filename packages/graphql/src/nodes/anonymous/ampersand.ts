import type { Node } from 'web-tree-sitter';

const TYPE = '&' as const;

/**
 * Represents the anonymous '&' node in the graphql AST.
 */
export interface Ampersand extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a '&' anonymous node.
 */
export function isAmpersand(node: Node | null | undefined): node is Ampersand {
  return node?.type === TYPE && !node.isNamed;
}