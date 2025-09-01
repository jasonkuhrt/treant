import type { Node } from 'web-tree-sitter';

const TYPE = 'UNION' as const;

/**
 * Represents the anonymous 'UNION' node in the graphql AST.
 */
export interface UpperUnion extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'UNION' anonymous node.
 */
export function isUpperUnion(node: Node | null | undefined): node is UpperUnion {
  return node?.type === TYPE && !node.isNamed;
}