import type { Node } from 'web-tree-sitter';
import type { Value } from './value.js';

const TYPE = 'list_value' as const;

/**
 * Represents a list value in the graphql AST.
 */
export interface ListValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ListValue
 */
export function isListValue(node: unknown): node is ListValue {
  return (node as any)?.type === TYPE;
}