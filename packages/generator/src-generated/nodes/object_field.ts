import type { Node } from 'web-tree-sitter';
import type { Comma } from './comma.js';
import type { Name } from './name.js';
import type { Value } from './value.js';

const TYPE = 'object_field' as const;

/**
 * Represents a object field in the graphql AST.
 */
export interface ObjectField extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ObjectField
 */
export function isObjectField(node: unknown): node is ObjectField {
  return (node as any)?.type === TYPE;
}