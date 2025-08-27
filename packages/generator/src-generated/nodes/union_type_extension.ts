import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { Name } from './name.js';
import type { UnionMemberTypes } from './union_member_types.js';

const TYPE = 'union_type_extension' as const;

/**
 * Represents a union type extension in the graphql AST.
 */
export interface UnionTypeExtension extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for UnionTypeExtension
 */
export function isUnionTypeExtension(node: unknown): node is UnionTypeExtension {
  return (node as any)?.type === TYPE;
}