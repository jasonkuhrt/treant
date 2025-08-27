import type { Node } from 'web-tree-sitter';
import type { InputValueDefinition } from './input_value_definition.js';

const TYPE = 'input_fields_definition' as const;

/**
 * Represents a input fields definition in the graphql AST.
 */
export interface InputFieldsDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputFieldsDefinition
 */
export function isInputFieldsDefinition(node: unknown): node is InputFieldsDefinition {
  return (node as any)?.type === TYPE;
}