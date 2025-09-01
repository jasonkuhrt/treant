import type { Node } from 'web-tree-sitter';

const TYPE = 'on' as const;

/**
 * Represents the anonymous 'on' node in the graphql AST.
 */
export interface On extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'on' anonymous node.
 */
export function isOn(node: Node | null | undefined): node is On {
  return node?.type === TYPE && !node.isNamed;
}