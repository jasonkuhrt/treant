import type { Node } from 'web-tree-sitter';
import type { DirectiveDefinitionNode } from './directive_definition.js';
import type { SchemaDefinitionNode } from './schema_definition.js';
import type { TypeDefinitionNode } from './type_definition.js';

const TYPE = 'type_system_definition' as const;

/**
 * Represents a type system definition in the graphql AST.
 */
export interface TypeSystemDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for TypeSystemDefinitionNode
 */
export function isTypeSystemDefinitionNode(node: unknown): node is TypeSystemDefinitionNode {
  return (node as any)?.type === TYPE;
}