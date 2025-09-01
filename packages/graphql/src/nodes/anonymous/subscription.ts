import type { Node } from 'web-tree-sitter';

const TYPE = 'subscription' as const;

/**
 * Represents the anonymous 'subscription' node in the graphql AST.
 */
export interface Subscription extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'subscription' anonymous node.
 */
export function isSubscription(node: Node | null | undefined): node is Subscription {
  return node?.type === TYPE && !node.isNamed;
}