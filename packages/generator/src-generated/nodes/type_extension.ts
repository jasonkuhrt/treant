import type { Node } from 'web-tree-sitter';
import type { EnumTypeExtension } from './enum_type_extension.js';
import type { InputObjectTypeExtension } from './input_object_type_extension.js';
import type { InterfaceTypeExtension } from './interface_type_extension.js';
import type { ObjectTypeExtension } from './object_type_extension.js';
import type { ScalarTypeExtension } from './scalar_type_extension.js';
import type { UnionTypeExtension } from './union_type_extension.js';

const TYPE = 'type_extension' as const;

/**
 * Represents a type extension in the graphql AST.
 */
export interface TypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeExtension
 */
export function isTypeExtension(node: unknown): node is TypeExtension {
  return (node as any)?.type === TYPE;
}