import type { Node } from 'web-tree-sitter';
import type { Directive } from './directive.js';

const TYPE = 'directives' as const;

/**
 * Represents a directives in the graphql AST.
 */
export interface Directives extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Directives
 */
export function isDirectives(node: unknown): node is Directives {
  return (node as any)?.type === TYPE;
}