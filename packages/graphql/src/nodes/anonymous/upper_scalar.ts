import type { Node } from 'web-tree-sitter';

const TYPE = 'SCALAR' as const;

/**
 * Represents the anonymous 'SCALAR' node in the graphql AST.
 */
export interface UpperScalar extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'SCALAR' anonymous node.
 */
export function isUpperScalar(node: Node | null | undefined): node is UpperScalar {
  return node?.type === TYPE && !node.isNamed;
}