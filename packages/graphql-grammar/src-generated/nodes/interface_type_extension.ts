import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { FieldsDefinition } from './fields_definition.js';
import type { ImplementsInterfaces } from './implements_interfaces.js';
import type { Name } from './name.js';

const TYPE = 'interface_type_extension' as const;

/**
 * Represents a interface type extension in the graphql AST.
 */
export interface InterfaceTypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InterfaceTypeExtension
 */
export function isInterfaceTypeExtension(node: unknown): node is InterfaceTypeExtension {
  return (node as any)?.type === TYPE;
}