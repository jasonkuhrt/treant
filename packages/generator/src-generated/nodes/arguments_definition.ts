import type { Node } from 'web-tree-sitter';
import type { InputValueDefinition } from './input_value_definition.js';

const TYPE = 'arguments_definition' as const;

/**
 * Represents a arguments definition in the graphql AST.
 */
export interface ArgumentsDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ArgumentsDefinition
 */
export function isArgumentsDefinition(node: unknown): node is ArgumentsDefinition {
  return (node as any)?.type === TYPE;
}