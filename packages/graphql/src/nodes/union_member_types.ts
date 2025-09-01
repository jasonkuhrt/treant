import type { Node } from 'web-tree-sitter';
import type { NamedTypeNode } from './named_type.js';

const TYPE = 'union_member_types' as const;

/**
 * Represents a union member types in the graphql AST.
 */
export interface UnionMemberTypesNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for UnionMemberTypesNode
 */
export function isUnionMemberTypesNode(node: unknown): node is UnionMemberTypesNode {
  return (node as any)?.type === TYPE;
}