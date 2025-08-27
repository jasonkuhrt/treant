import type { Node } from 'web-tree-sitter';
import type { Alias } from './alias.js';
import type { Arguments } from './arguments.js';
import type { Directive } from './directive.js';
import type { Name } from './name.js';
import type { SelectionSet } from './selection_set.js';

const TYPE = 'field' as const;

/**
 * Represents a field in the graphql AST.
 */
export interface Field extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Field
 */
export function isField(node: unknown): node is Field {
  return (node as any)?.type === TYPE;
}