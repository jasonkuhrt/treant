import type { Node } from 'web-tree-sitter';

const TYPE = 'INTERFACE' as const;

/**
 * Represents the anonymous 'INTERFACE' node in the graphql AST.
 */
export interface UpperInterface extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'INTERFACE' anonymous node.
 */
export function isUpperInterface(node: Node | null | undefined): node is UpperInterface {
  return node?.type === TYPE && !node.isNamed;
}