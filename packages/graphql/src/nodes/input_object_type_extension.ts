import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { InputFieldsDefinitionNode } from './input_fields_definition.js';
import type { NameNode } from './name.js';

const TYPE = 'input_object_type_extension' as const;

/**
 * Represents a input object type extension in the graphql AST.
 */
export interface InputObjectTypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputObjectTypeExtensionNode
 */
export function isInputObjectTypeExtensionNode(node: unknown): node is InputObjectTypeExtensionNode {
  return (node as any)?.type === TYPE;
}