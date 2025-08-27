import type { Node } from 'web-tree-sitter';
import type { ObjectField } from './object_field.js';

const TYPE = 'object_value' as const;

/**
 * Represents a object value in the graphql AST.
 */
export interface ObjectValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectValue
 */
export function isObjectValue(node: unknown): node is ObjectValue {
  return (node as any)?.type === TYPE;
}