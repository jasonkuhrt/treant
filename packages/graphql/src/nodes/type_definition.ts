import type { Node } from 'web-tree-sitter';
import type { EnumTypeDefinitionNode } from './enum_type_definition.js';
import type { InputObjectTypeDefinitionNode } from './input_object_type_definition.js';
import type { InterfaceTypeDefinitionNode } from './interface_type_definition.js';
import type { ObjectTypeDefinitionNode } from './object_type_definition.js';
import type { ScalarTypeDefinitionNode } from './scalar_type_definition.js';
import type { UnionTypeDefinitionNode } from './union_type_definition.js';

const TYPE = 'type_definition' as const;

/**
 * Represents a type definition in the graphql AST.
 */
export interface TypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeDefinitionNode
 */
export function isTypeDefinitionNode(node: unknown): node is TypeDefinitionNode {
  return (node as any)?.type === TYPE;
}