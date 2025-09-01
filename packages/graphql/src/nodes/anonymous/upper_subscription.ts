import type { Node } from 'web-tree-sitter';

const TYPE = 'SUBSCRIPTION' as const;

/**
 * Represents the anonymous 'SUBSCRIPTION' node in the graphql AST.
 */
export interface UpperSubscription extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'SUBSCRIPTION' anonymous node.
 */
export function isUpperSubscription(node: Node | null | undefined): node is UpperSubscription {
  return node?.type === TYPE && !node.isNamed;
}