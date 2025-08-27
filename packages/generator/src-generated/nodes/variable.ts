import type { Node } from 'web-tree-sitter';
import type { Name } from './name.js';

const TYPE = 'variable' as const;

/**
 * Represents a variable in the graphql AST.
 */
export interface Variable extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Variable
 */
export function isVariable(node: unknown): node is Variable {
  return (node as any)?.type === TYPE;
}