import type { Node } from 'web-tree-sitter';
import type { Description } from './description.js';
import type { Directives } from './directives.js';
import type { Name } from './name.js';
import type { UnionMemberTypes } from './union_member_types.js';

const TYPE = 'union_type_definition' as const;

/**
 * Represents a union type definition in the graphql AST.
 */
export interface UnionTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for UnionTypeDefinition
 */
export function isUnionTypeDefinition(node: unknown): node is UnionTypeDefinition {
  return (node as any)?.type === TYPE;
}