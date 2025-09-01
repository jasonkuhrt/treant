import type { Node } from 'web-tree-sitter';
import type { NamedTypeNode } from './named_type.js';
import type { OperationTypeNode } from './operation_type.js';

const TYPE = 'root_operation_type_definition' as const;

/**
 * Represents a root operation type definition in the graphql AST.
 */
export interface RootOperationTypeDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for RootOperationTypeDefinitionNode
 */
export function isRootOperationTypeDefinitionNode(node: unknown): node is RootOperationTypeDefinitionNode {
  return (node as any)?.type === TYPE;
}