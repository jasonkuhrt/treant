import type { Node } from 'web-tree-sitter';
import type { FieldDefinitionNode } from './field_definition.js';

const TYPE = 'fields_definition' as const;

/**
 * Represents a fields definition in the graphql AST.
 */
export interface FieldsDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FieldsDefinitionNode
 */
export function isFieldsDefinitionNode(node: unknown): node is FieldsDefinitionNode {
  return (node as any)?.type === TYPE;
}