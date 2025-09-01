import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { InputFieldsDefinitionNode } from './input_fields_definition.js';
import type { NameNode } from './name.js';

const TYPE = 'input_object_type_definition' as const;

/**
 * Represents a input object type definition in the graphql AST.
 */
export interface InputObjectTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputObjectTypeDefinitionNode
 */
export function isInputObjectTypeDefinitionNode(node: unknown): node is InputObjectTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}