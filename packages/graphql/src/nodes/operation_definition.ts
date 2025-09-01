import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';
import type { OperationTypeNode } from './operation_type.js';
import type { SelectionSetNode } from './selection_set.js';
import type { VariableDefinitionsNode } from './variable_definitions.js';

const TYPE = 'operation_definition' as const;

/**
 * Represents a operation definition in the graphql AST.
 */
export interface OperationDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for OperationDefinitionNode
 */
export function isOperationDefinitionNode(node: unknown): node is OperationDefinitionNode {
  return (node as any)?.type === TYPE;
}