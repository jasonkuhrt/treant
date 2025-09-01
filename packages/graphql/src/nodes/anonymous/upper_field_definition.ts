import type { Node } from 'web-tree-sitter';

const TYPE = 'FIELD_DEFINITION' as const;

/**
 * Represents the anonymous 'FIELD_DEFINITION' node in the graphql AST.
 */
export interface UpperFieldDefinition extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'FIELD_DEFINITION' anonymous node.
 */
export function isUpperFieldDefinition(node: Node | null | undefined): node is UpperFieldDefinition {
  return node?.type === TYPE && !node.isNamed;
}