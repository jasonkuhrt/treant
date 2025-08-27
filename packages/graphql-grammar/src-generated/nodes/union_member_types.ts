import type { Node } from 'web-tree-sitter';
import type { NamedType } from './named_type.js';

const TYPE = 'union_member_types' as const;

/**
 * Represents a union member types in the graphql AST.
 */
export interface UnionMemberTypes extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for UnionMemberTypes
 */
export function isUnionMemberTypes(node: unknown): node is UnionMemberTypes {
  return (node as any)?.type === TYPE;
}