import type { Node } from 'web-tree-sitter';
import type { Field } from './field.js';
import type { FragmentSpread } from './fragment_spread.js';
import type { InlineFragment } from './inline_fragment.js';

const TYPE = 'selection' as const;

/**
 * Represents a selection in the graphql AST.
 */
export interface Selection extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Selection
 */
export function isSelection(node: unknown): node is Selection {
  return (node as any)?.type === TYPE;
}