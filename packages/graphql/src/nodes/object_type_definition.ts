import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { FieldsDefinitionNode } from './fields_definition.js';
import type { ImplementsInterfacesNode } from './implements_interfaces.js';
import type { NameNode } from './name.js';

const TYPE = 'object_type_definition' as const;

/**
 * Represents a object type definition in the graphql AST.
 */
export interface ObjectTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectTypeDefinitionNode
 */
export function isObjectTypeDefinitionNode(node: unknown): node is ObjectTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}