import type { Node } from 'web-tree-sitter';

const TYPE = 'input' as const;

/**
 * Represents the anonymous 'input' node in the graphql AST.
 */
export interface Input extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'input' anonymous node.
 */
export function isInput(node: Node | null | undefined): node is Input {
  return node?.type === TYPE && !node.isNamed;
}