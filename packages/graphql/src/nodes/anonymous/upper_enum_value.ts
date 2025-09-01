import type { Node } from 'web-tree-sitter';

const TYPE = 'ENUM_VALUE' as const;

/**
 * Represents the anonymous 'ENUM_VALUE' node in the graphql AST.
 */
export interface UpperEnumValue extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'ENUM_VALUE' anonymous node.
 */
export function isUpperEnumValue(node: Node | null | undefined): node is UpperEnumValue {
  return node?.type === TYPE && !node.isNamed;
}