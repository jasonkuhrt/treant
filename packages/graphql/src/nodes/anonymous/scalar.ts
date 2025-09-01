import type { Node } from 'web-tree-sitter';

const TYPE = 'scalar' as const;

/**
 * Represents the anonymous 'scalar' node in the graphql AST.
 */
export interface Scalar extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'scalar' anonymous node.
 */
export function isScalar(node: Node | null | undefined): node is Scalar {
  return node?.type === TYPE && !node.isNamed;
}