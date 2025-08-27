import type { Node } from 'web-tree-sitter';
import type { Directives } from './directives.js';
import type { FragmentName } from './fragment_name.js';
import type { SelectionSet } from './selection_set.js';
import type { TypeCondition } from './type_condition.js';

const TYPE = 'fragment_definition' as const;

/**
 * Represents a fragment definition in the graphql AST.
 */
export interface FragmentDefinition extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FragmentDefinition
 */
export function isFragmentDefinition(node: unknown): node is FragmentDefinition {
  return (node as any)?.type === TYPE;
}