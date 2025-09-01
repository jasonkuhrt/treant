import type { Node } from 'web-tree-sitter';
import type { SelectionNode } from './selection.js';

const TYPE = 'selection_set' as const;

/**
 * Represents a selection set in the graphql AST.
 */
export interface SelectionSetNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SelectionSetNode
 */
export function isSelectionSetNode(node: unknown): node is SelectionSetNode {
  return (node as any)?.type === TYPE;
}