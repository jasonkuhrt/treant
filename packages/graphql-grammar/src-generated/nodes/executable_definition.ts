import type { Node } from 'web-tree-sitter';
import type { FragmentDefinition } from './fragment_definition.js';
import type { OperationDefinition } from './operation_definition.js';

const TYPE = 'executable_definition' as const;

/**
 * Represents a executable definition in the graphql AST.
 */
export interface ExecutableDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ExecutableDefinition
 */
export function isExecutableDefinition(node: unknown): node is ExecutableDefinition {
  return (node as any)?.type === TYPE;
}