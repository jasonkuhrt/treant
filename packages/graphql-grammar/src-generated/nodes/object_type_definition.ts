import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { FieldsDefinition } from './fields_definition.js';
import type { ImplementsInterfaces } from './implements_interfaces.js';
import type { Name } from './name.js';

const TYPE = 'object_type_definition' as const;

/**
 * Represents a object type definition in the graphql AST.
 */
export interface ObjectTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectTypeDefinition
 */
export function isObjectTypeDefinition(node: unknown): node is ObjectTypeDefinition {
  return (node as any)?.type === TYPE;
}