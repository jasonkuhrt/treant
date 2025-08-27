import type { Node } from 'web-tree-sitter';
import type { Argument } from './argument.js';

const TYPE = 'arguments' as const;

/**
 * Represents a arguments in the graphql AST.
 */
export interface Arguments extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Arguments
 */
export function isArguments(node: unknown): node is Arguments {
  return (node as any)?.type === TYPE;
}