import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { FieldsDefinitionNode } from './fields_definition.js';
import type { ImplementsInterfacesNode } from './implements_interfaces.js';
import type { NameNode } from './name.js';

const TYPE = 'interface_type_definition' as const;

/**
 * Represents a interface type definition in the graphql AST.
 */
export interface InterfaceTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InterfaceTypeDefinitionNode
 */
export function isInterfaceTypeDefinitionNode(node: unknown): node is InterfaceTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}