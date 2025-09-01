import type { Node } from 'web-tree-sitter';
import type { DefaultValueNode } from './default_value.js';
import type { DescriptionNode } from './description.js';
import type { DirectivesNode } from './directives.js';
import type { NameNode } from './name.js';
import type { TypeNode } from './type.js';

const TYPE = 'input_value_definition' as const;

/**
 * Represents a input value definition in the graphql AST.
 */
export interface InputValueDefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for InputValueDefinitionNode
 */
export function isInputValueDefinitionNode(node: unknown): node is InputValueDefinitionNode {
  return (node as any)?.type === TYPE;
}