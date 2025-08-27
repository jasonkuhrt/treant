import type { Node } from 'web-tree-sitter';
import type { Arguments } from './arguments.js';
import type { Name } from './name.js';

const TYPE = 'directive' as const;

/**
 * Represents a directive in the graphql AST.
 */
export interface Directive extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Directive
 */
export function isDirective(node: unknown): node is Directive {
  return (node as any)?.type === TYPE;
}