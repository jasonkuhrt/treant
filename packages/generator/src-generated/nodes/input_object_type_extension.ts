import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { InputFieldsDefinition } from './input_fields_definition.js';
import type { Name } from './name.js';

const TYPE = 'input_object_type_extension' as const;

/**
 * Represents a input object type extension in the graphql AST.
 */
export interface InputObjectTypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputObjectTypeExtension
 */
export function isInputObjectTypeExtension(node: unknown): node is InputObjectTypeExtension {
  return (node as any)?.type === TYPE;
}