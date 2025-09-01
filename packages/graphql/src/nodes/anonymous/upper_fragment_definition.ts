import type { Node } from 'web-tree-sitter';

const TYPE = 'FRAGMENT_DEFINITION' as const;

/**
 * Represents the anonymous 'FRAGMENT_DEFINITION' node in the graphql AST.
 */
export interface UpperFragmentDefinition extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'FRAGMENT_DEFINITION' anonymous node.
 */
export function isUpperFragmentDefinition(node: Node | null | undefined): node is UpperFragmentDefinition {
  return node?.type === TYPE && !node.isNamed;
}