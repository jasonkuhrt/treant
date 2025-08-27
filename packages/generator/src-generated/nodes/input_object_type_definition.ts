import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { InputFieldsDefinition } from './input_fields_definition.js';
import type { Name } from './name.js';

const TYPE = 'input_object_type_definition' as const;

/**
 * Represents a input object type definition in the graphql AST.
 */
export interface InputObjectTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputObjectTypeDefinition
 */
export function isInputObjectTypeDefinition(node: unknown): node is InputObjectTypeDefinition {
  return (node as any)?.type === TYPE;
}