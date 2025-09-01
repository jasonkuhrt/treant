import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { FieldsDefinitionNode } from './fields_definition.js';
import type { ImplementsInterfacesNode } from './implements_interfaces.js';
import type { NameNode } from './name.js';

const TYPE = 'object_type_extension' as const;

/**
 * Represents a object type extension in the graphql AST.
 */
export interface ObjectTypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectTypeExtensionNode
 */
export function isObjectTypeExtensionNode(node: unknown): node is ObjectTypeExtensionNode {
  return (node as any)?.type === TYPE;
}