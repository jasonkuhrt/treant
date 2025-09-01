import type { Node } from 'web-tree-sitter';

const TYPE = '"' as const;

/**
 * Represents the anonymous '"' node in the graphql AST.
 */
export interface Quote extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a '"' anonymous node.
 */
export function isQuote(node: Node | null | undefined): node is Quote {
  return node?.type === TYPE && !node.isNamed;
}