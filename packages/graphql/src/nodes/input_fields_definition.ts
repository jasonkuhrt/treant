import type { Node } from 'web-tree-sitter';
import type { InputValueDefinitionNode } from './input_value_definition.js';

const TYPE = 'input_fields_definition' as const;

/**
 * Represents a input fields definition in the graphql AST.
 */
export interface InputFieldsDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputFieldsDefinitionNode
 */
export function isInputFieldsDefinitionNode(node: unknown): node is InputFieldsDefinitionNode {
  return (node as any)?.type === TYPE;
}