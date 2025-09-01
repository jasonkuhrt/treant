import type { Node } from 'web-tree-sitter';
import type { DirectivesNode } from './directives.js';
import type { FragmentNameNode } from './fragment_name.js';
import type { SelectionSetNode } from './selection_set.js';
import type { TypeConditionNode } from './type_condition.js';

const TYPE = 'fragment_definition' as const;

/**
 * Represents a fragment definition in the graphql AST.
 */
export interface FragmentDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for FragmentDefinitionNode
 */
export function isFragmentDefinitionNode(node: unknown): node is FragmentDefinitionNode {
  return (node as any)?.type === TYPE;
}