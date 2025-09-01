import type { Node } from 'web-tree-sitter';

const TYPE = 'FRAGMENT_SPREAD' as const;

/**
 * Represents the anonymous 'FRAGMENT_SPREAD' node in the graphql AST.
 */
export interface UpperFragmentSpread extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'FRAGMENT_SPREAD' anonymous node.
 */
export function isUpperFragmentSpread(node: Node | null | undefined): node is UpperFragmentSpread {
  return node?.type === TYPE && !node.isNamed;
}