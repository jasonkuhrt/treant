import type { Node } from 'web-tree-sitter';
import type { Value } from './value.js';

const TYPE = 'default_value' as const;

/**
 * Represents a default value in the graphql AST.
 */
export interface DefaultValue extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DefaultValue
 */
export function isDefaultValue(node: unknown): node is DefaultValue {
  return (node as any)?.type === TYPE;
}