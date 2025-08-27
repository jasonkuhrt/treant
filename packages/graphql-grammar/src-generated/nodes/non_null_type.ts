import type { Node } from 'web-tree-sitter';
import type { ListType } from './list_type.js';
import type { NamedType } from './named_type.js';

const TYPE = 'non_null_type' as const;

/**
 * Represents a non null type in the graphql AST.
 */
export interface NonNullType extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for NonNullType
 */
export function isNonNullType(node: unknown): node is NonNullType {
  return (node as any)?.type === TYPE;
}