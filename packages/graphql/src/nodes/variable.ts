import type { Node } from 'web-tree-sitter';
import type { NameNode } from './name.js';

const TYPE = 'variable' as const;

/**
 * Represents a variable in the graphql AST.
 */
export interface VariableNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for VariableNode
 */
export function isVariableNode(node: unknown): node is VariableNode {
  return (node as any)?.type === TYPE;
}