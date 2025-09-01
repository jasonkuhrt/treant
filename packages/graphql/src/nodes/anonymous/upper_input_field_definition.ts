import type { Node } from 'web-tree-sitter';

const TYPE = 'INPUT_FIELD_DEFINITION' as const;

/**
 * Represents the anonymous 'INPUT_FIELD_DEFINITION' node in the graphql AST.
 */
export interface UpperInputFieldDefinition extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'INPUT_FIELD_DEFINITION' anonymous node.
 */
export function isUpperInputFieldDefinition(node: Node | null | undefined): node is UpperInputFieldDefinition {
  return node?.type === TYPE && !node.isNamed;
}