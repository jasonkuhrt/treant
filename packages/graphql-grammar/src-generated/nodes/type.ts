import type { Node } from 'web-tree-sitter';
import type { ListType } from './list_type.js';
import type { NamedType } from './named_type.js';
import type { NonNullType } from './non_null_type.js';

const TYPE = 'type' as const;

/**
 * Represents a type in the graphql AST.
 */
export interface Type extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Type
 */
export function isType(node: unknown): node is Type {
  return (node as any)?.type === TYPE;
}