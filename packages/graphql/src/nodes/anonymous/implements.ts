import type { Node } from 'web-tree-sitter';

const TYPE = 'implements' as const;

/**
 * Represents the anonymous 'implements' node in the graphql AST.
 */
export interface Implements extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'implements' anonymous node.
 */
export function isImplements(node: Node | null | undefined): node is Implements {
  return node?.type === TYPE && !node.isNamed;
}