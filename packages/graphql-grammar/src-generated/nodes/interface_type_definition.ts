import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { FieldsDefinition } from './fields_definition.js';
import type { ImplementsInterfaces } from './implements_interfaces.js';
import type { Name } from './name.js';

const TYPE = 'interface_type_definition' as const;

/**
 * Represents a interface type definition in the graphql AST.
 */
export interface InterfaceTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InterfaceTypeDefinition
 */
export function isInterfaceTypeDefinition(node: unknown): node is InterfaceTypeDefinition {
  return (node as any)?.type === TYPE;
}