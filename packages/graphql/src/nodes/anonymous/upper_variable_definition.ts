import type { Node } from 'web-tree-sitter';

const TYPE = 'VARIABLE_DEFINITION' as const;

/**
 * Represents the anonymous 'VARIABLE_DEFINITION' node in the graphql AST.
 */
export interface UpperVariableDefinition extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'VARIABLE_DEFINITION' anonymous node.
 */
export function isUpperVariableDefinition(node: Node | null | undefined): node is UpperVariableDefinition {
  return node?.type === TYPE && !node.isNamed;
}