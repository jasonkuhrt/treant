import type { Node } from 'web-tree-sitter';
import type { VariableDefinition } from './variable_definition.js';

const TYPE = 'variable_definitions' as const;

/**
 * Represents a variable definitions in the graphql AST.
 */
export interface VariableDefinitions extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for VariableDefinitions
 */
export function isVariableDefinitions(node: unknown): node is VariableDefinitions {
  return (node as any)?.type === TYPE;
}