import type { Node } from 'web-tree-sitter';

const TYPE = 'ARGUMENT_DEFINITION' as const;

/**
 * Represents the anonymous 'ARGUMENT_DEFINITION' node in the graphql AST.
 */
export interface UpperArgumentDefinition extends Node {
  type: typeof TYPE;
  isNamed: false;
}

/**
 * Type guard to check if a node is a 'ARGUMENT_DEFINITION' anonymous node.
 */
export function isUpperArgumentDefinition(node: Node | null | undefined): node is UpperArgumentDefinition {
  return node?.type === TYPE && !node.isNamed;
}