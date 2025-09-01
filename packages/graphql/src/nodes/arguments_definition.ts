import type { Node } from 'web-tree-sitter';
import type { InputValueDefinitionNode } from './input_value_definition.js';

const TYPE = 'arguments_definition' as const;

/**
 * Represents a arguments definition in the graphql AST.
 */
export interface ArgumentsDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ArgumentsDefinitionNode
 */
export function isArgumentsDefinitionNode(node: unknown): node is ArgumentsDefinitionNode {
  return (node as any)?.type === TYPE;
}