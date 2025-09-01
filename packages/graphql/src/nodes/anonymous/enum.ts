import type { Node } from 'web-tree-sitter';

const TYPE = 'enum' as const;

/**
 * Represents the anonymous 'enum' node in the graphql AST.
 */
export interface Enum extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'enum' anonymous node.
 */
export function isEnum(node: Node | null | undefined): node is Enum {
  return node?.type === TYPE && !node.isNamed;
}