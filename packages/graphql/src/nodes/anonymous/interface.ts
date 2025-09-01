import type { Node } from 'web-tree-sitter';

const TYPE = 'interface' as const;

/**
 * Represents the anonymous 'interface' node in the graphql AST.
 */
export interface Interface extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'interface' anonymous node.
 */
export function isInterface(node: Node | null | undefined): node is Interface {
  return node?.type === TYPE && !node.isNamed;
}