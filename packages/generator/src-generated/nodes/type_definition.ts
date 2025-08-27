import type { Node } from 'web-tree-sitter';
import type { EnumTypeDefinition } from './enum_type_definition.js';
import type { InputObjectTypeDefinition } from './input_object_type_definition.js';
import type { InterfaceTypeDefinition } from './interface_type_definition.js';
import type { ObjectTypeDefinition } from './object_type_definition.js';
import type { ScalarTypeDefinition } from './scalar_type_definition.js';
import type { UnionTypeDefinition } from './union_type_definition.js';

const TYPE = 'type_definition' as const;

/**
 * Represents a type definition in the graphql AST.
 */
export interface TypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeDefinition
 */
export function isTypeDefinition(node: unknown): node is TypeDefinition {
  return (node as any)?.type === TYPE;
}