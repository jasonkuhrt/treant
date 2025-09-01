import type { Node } from 'web-tree-sitter';
import type { CommaNode } from './comma.js';
import type { DefaultValueNode } from './default_value.js';
import type { DirectivesNode } from './directives.js';
import type { TypeNode } from './type.js';
import type { VariableNode } from './variable.js';

const TYPE = 'variable_definition' as const;

/**
 * Represents a variable definition in the graphql AST.
 */
export interface VariableDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for VariableDefinitionNode
 */
export function isVariableDefinitionNode(node: unknown): node is VariableDefinitionNode {
  return (node as any)?.type === TYPE;
}