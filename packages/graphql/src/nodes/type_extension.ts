import type { Node } from 'web-tree-sitter';
import type { EnumTypeExtensionNode } from './enum_type_extension.js';
import type { InputObjectTypeExtensionNode } from './input_object_type_extension.js';
import type { InterfaceTypeExtensionNode } from './interface_type_extension.js';
import type { ObjectTypeExtensionNode } from './object_type_extension.js';
import type { ScalarTypeExtensionNode } from './scalar_type_extension.js';
import type { UnionTypeExtensionNode } from './union_type_extension.js';

const TYPE = 'type_extension' as const;

/**
 * Represents a type extension in the graphql AST.
 */
export interface TypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeExtensionNode
 */
export function isTypeExtensionNode(node: unknown): node is TypeExtensionNode {
  return (node as any)?.type === TYPE;
}