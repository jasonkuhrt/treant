import type { Node } from 'web-tree-sitter';
import type { FieldDefinition } from './field_definition.js';

const TYPE = 'fields_definition' as const;

/**
 * Represents a fields definition in the graphql AST.
 */
export interface FieldsDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FieldsDefinition
 */
export function isFieldsDefinition(node: unknown): node is FieldsDefinition {
  return (node as any)?.type === TYPE;
}