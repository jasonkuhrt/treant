import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';
import type { UnionMemberTypesNode } from './union_member_types.js';

const TYPE = 'union_type_extension' as const;

/**
 * Represents a union type extension in the graphql AST.
 */
export interface UnionTypeExtensionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for UnionTypeExtensionNode
 */
export function isUnionTypeExtensionNode(node: unknown): node is UnionTypeExtensionNode {
  return (node as any)?.type === TYPE;
}