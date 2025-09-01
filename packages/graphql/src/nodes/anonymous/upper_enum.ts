import type { Node } from 'web-tree-sitter';

const TYPE = 'ENUM' as const;

/**
 * Represents the anonymous 'ENUM' node in the graphql AST.
 */
export interface UpperEnum extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'ENUM' anonymous node.
 */
export function isUpperEnum(node: Node | null | undefined): node is UpperEnum {
  return node?.type === TYPE && !node.isNamed;
}