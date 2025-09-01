import type { Node } from 'web-tree-sitter';

const TYPE = 'query' as const;

/**
 * Represents the anonymous 'query' node in the graphql AST.
 */
export interface Query extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'query' anonymous node.
 */
export function isQuery(node: Node | null | undefined): node is Query {
  return node?.type === TYPE && !node.isNamed;
}