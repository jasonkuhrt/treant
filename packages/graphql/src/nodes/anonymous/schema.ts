import type { Node } from 'web-tree-sitter';

const TYPE = 'schema' as const;

/**
 * Represents the anonymous 'schema' node in the graphql AST.
 */
export interface Schema extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'schema' anonymous node.
 */
export function isSchema(node: Node | null | undefined): node is Schema {
  return node?.type === TYPE && !node.isNamed;
}