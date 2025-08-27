import type { Node } from 'web-tree-sitter';
import type { NamedType } from './named_type.js';
import type { OperationType } from './operation_type.js';

const TYPE = 'root_operation_type_definition' as const;

/**
 * Represents a root operation type definition in the graphql AST.
 */
export interface RootOperationTypeDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for RootOperationTypeDefinition
 */
export function isRootOperationTypeDefinition(node: unknown): node is RootOperationTypeDefinition {
  return (node as any)?.type === TYPE;
}