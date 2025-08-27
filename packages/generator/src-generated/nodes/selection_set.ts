import type { Node } from 'web-tree-sitter';
import type { Selection } from './selection.js';

const TYPE = 'selection_set' as const;

/**
 * Represents a selection set in the graphql AST.
 */
export interface SelectionSet extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SelectionSet
 */
export function isSelectionSet(node: unknown): node is SelectionSet {
  return (node as any)?.type === TYPE;
}