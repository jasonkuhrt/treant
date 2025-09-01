import type { Node } from 'web-tree-sitter';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';
import type { UnionMemberTypesNode } from './union_member_types.js';

const TYPE = 'union_type_definition' as const;

/**
 * Represents a union type definition in the graphql AST.
 */
export interface UnionTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for UnionTypeDefinitionNode
 */
export function isUnionTypeDefinitionNode(node: unknown): node is UnionTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}