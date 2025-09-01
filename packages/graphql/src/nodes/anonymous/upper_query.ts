import type { Node } from 'web-tree-sitter';

const TYPE = 'QUERY' as const;

/**
 * Represents the anonymous 'QUERY' node in the graphql AST.
 */
export interface UpperQuery extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'QUERY' anonymous node.
 */
export function isUpperQuery(node: Node | null | undefined): node is UpperQuery {
  return node?.type === TYPE && !node.isNamed;
}