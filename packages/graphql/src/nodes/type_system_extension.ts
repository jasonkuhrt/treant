import type { Node } from 'web-tree-sitter';
import type { SchemaExtensionNode } from './schema_extension.js';
import type { TypeExtensionNode } from './type_extension.js';

const TYPE = 'type_system_extension' as const;

/**
 * Represents a type system extension in the graphql AST.
 */
export interface TypeSystemExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeSystemExtensionNode
 */
export function isTypeSystemExtensionNode(node: unknown): node is TypeSystemExtensionNode {
  return (node as any)?.type === TYPE;
}