import type { Node } from 'web-tree-sitter';

const TYPE = 'FIELD' as const;

/**
 * Represents the anonymous 'FIELD' node in the graphql AST.
 */
export interface UpperField extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'FIELD' anonymous node.
 */
export function isUpperField(node: Node | null | undefined): node is UpperField {
  return node?.type === TYPE && !node.isNamed;
}