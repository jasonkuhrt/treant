import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { FieldsDefinitionNode } from './fields_definition.js';
import type { ImplementsInterfacesNode } from './implements_interfaces.js';
import type { NameNode } from './name.js';

const TYPE = 'interface_type_extension' as const;

/**
 * Represents a interface type extension in the graphql AST.
 */
export interface InterfaceTypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InterfaceTypeExtensionNode
 */
export function isInterfaceTypeExtensionNode(node: unknown): node is InterfaceTypeExtensionNode {
  return (node as any)?.type === TYPE;
}