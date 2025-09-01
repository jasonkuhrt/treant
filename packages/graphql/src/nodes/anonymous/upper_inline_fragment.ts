import type { Node } from 'web-tree-sitter';

const TYPE = 'INLINE_FRAGMENT' as const;

/**
 * Represents the anonymous 'INLINE_FRAGMENT' node in the graphql AST.
 */
export interface UpperInlineFragment extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'INLINE_FRAGMENT' anonymous node.
 */
export function isUpperInlineFragment(node: Node | null | undefined): node is UpperInlineFragment {
  return node?.type === TYPE && !node.isNamed;
}