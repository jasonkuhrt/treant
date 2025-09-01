import type { Node } from 'web-tree-sitter';

const TYPE = 'directive' as const;

/**
 * Represents the anonymous 'directive' node in the graphql AST.
 */
export interface Directive extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'directive' anonymous node.
 */
export function isDirective(node: Node | null | undefined): node is Directive {
  return node?.type === TYPE && !node.isNamed;
}