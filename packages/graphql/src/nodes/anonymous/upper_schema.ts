import type { Node } from 'web-tree-sitter';

const TYPE = 'SCHEMA' as const;

/**
 * Represents the anonymous 'SCHEMA' node in the graphql AST.
 */
export interface UpperSchema extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'SCHEMA' anonymous node.
 */
export function isUpperSchema(node: Node | null | undefined): node is UpperSchema {
  return node?.type === TYPE && !node.isNamed;
}