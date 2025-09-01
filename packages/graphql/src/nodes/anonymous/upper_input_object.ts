import type { Node } from 'web-tree-sitter';

const TYPE = 'INPUT_OBJECT' as const;

/**
 * Represents the anonymous 'INPUT_OBJECT' node in the graphql AST.
 */
export interface UpperInputObject extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'INPUT_OBJECT' anonymous node.
 */
export function isUpperInputObject(node: Node | null | undefined): node is UpperInputObject {
  return node?.type === TYPE && !node.isNamed;
}