import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { Name } from './name.js';
import type { OperationType } from './operation_type.js';
import type { SelectionSet } from './selection_set.js';
import type { VariableDefinitions } from './variable_definitions.js';

const TYPE = 'operation_definition' as const;

/**
 * Represents a operation definition in the graphql AST.
 */
export interface OperationDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for OperationDefinition
 */
export function isOperationDefinition(node: unknown): node is OperationDefinition {
  return (node as any)?.type === TYPE;
}