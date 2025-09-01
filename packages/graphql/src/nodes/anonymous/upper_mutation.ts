import type { Node } from 'web-tree-sitter';

const TYPE = 'MUTATION' as const;

/**
 * Represents the anonymous 'MUTATION' node in the graphql AST.
 */
export interface UpperMutation extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'MUTATION' anonymous node.
 */
export function isUpperMutation(node: Node | null | undefined): node is UpperMutation {
  return node?.type === TYPE && !node.isNamed;
}