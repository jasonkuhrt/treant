import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { FieldsDefinition } from './fields_definition.js';
import type { ImplementsInterfaces } from './implements_interfaces.js';
import type { Name } from './name.js';

const TYPE = 'object_type_extension' as const;

/**
 * Represents a object type extension in the graphql AST.
 */
export interface ObjectTypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectTypeExtension
 */
export function isObjectTypeExtension(node: unknown): node is ObjectTypeExtension {
  return (node as any)?.type === TYPE;
}