import type { Node } from 'web-tree-sitter';
import type { StringValue } from './string_value.js';

const TYPE = 'description' as const;

/**
 * Represents a description in the graphql AST.
 */
export interface Description extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Description
 */
export function isDescription(node: unknown): node is Description {
  return (node as any)?.type === TYPE;
}