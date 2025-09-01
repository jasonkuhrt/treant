import type { Node } from 'web-tree-sitter';
import type { FragmentDefinitionNode } from './fragment_definition.js';
import type { OperationDefinitionNode } from './operation_definition.js';

const TYPE = 'executable_definition' as const;

/**
 * Represents a executable definition in the graphql AST.
 */
export interface ExecutableDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for ExecutableDefinitionNode
 */
export function isExecutableDefinitionNode(node: unknown): node is ExecutableDefinitionNode {
  return (node as any)?.type === TYPE;
}