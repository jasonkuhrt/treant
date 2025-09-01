import type { Node } from 'web-tree-sitter';

const TYPE = 'OBJECT' as const;

/**
 * Represents the anonymous 'OBJECT' node in the graphql AST.
 */
export interface UpperObject extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'OBJECT' anonymous node.
 */
export function isUpperObject(node: Node | null | undefined): node is UpperObject {
  return node?.type === TYPE && !node.isNamed;
}