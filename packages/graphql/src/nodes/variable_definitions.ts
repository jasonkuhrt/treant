import type { Node } from 'web-tree-sitter';
import type { VariableDefinitionNode } from './variable_definition.js';

const TYPE = 'variable_definitions' as const;

/**
 * Represents a variable definitions in the graphql AST.
 */
export interface VariableDefinitionsNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for VariableDefinitionsNode
 */
export function isVariableDefinitionsNode(node: unknown): node is VariableDefinitionsNode {
  return (node as any)?.type === TYPE;
}