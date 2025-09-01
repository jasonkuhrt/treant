import type { Node } from 'web-tree-sitter';

const TYPE = 'mutation' as const;

/**
 * Represents the anonymous 'mutation' node in the graphql AST.
 */
export interface Mutation extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'mutation' anonymous node.
 */
export function isMutation(node: Node | null | undefined): node is Mutation {
  return node?.type === TYPE && !node.isNamed;
}