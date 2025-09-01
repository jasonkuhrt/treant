import type { Node } from 'web-tree-sitter';

const TYPE = 'fragment' as const;

/**
 * Represents the anonymous 'fragment' node in the graphql AST.
 */
export interface Fragment extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'fragment' anonymous node.
 */
export function isFragment(node: Node | null | undefined): node is Fragment {
  return node?.type === TYPE && !node.isNamed;
}