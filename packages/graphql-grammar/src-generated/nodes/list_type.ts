import type { Node } from 'web-tree-sitter';
import type { Type } from './type.js';

const TYPE = 'list_type' as const;

/**
 * Represents a list type in the graphql AST.
 */
export interface ListType extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ListType
 */
export function isListType(node: unknown): node is ListType {
  return (node as any)?.type === TYPE;
}