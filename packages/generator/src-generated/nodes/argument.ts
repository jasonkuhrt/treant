import type { Node } from 'web-tree-sitter';
import type { Name } from './name.js';
import type { Value } from './value.js';

const TYPE = 'argument' as const;

/**
 * Represents a argument in the graphql AST.
 */
export interface Argument extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Argument
 */
export function isArgument(node: unknown): node is Argument {
  return (node as any)?.type === TYPE;
}