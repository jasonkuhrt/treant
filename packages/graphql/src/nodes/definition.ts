import type { Node } from 'web-tree-sitter';
import type { ExecutableDefinitionNode } from './executable_definition.js';
import type { TypeSystemDefinitionNode } from './type_system_definition.js';
import type { TypeSystemExtensionNode } from './type_system_extension.js';

const TYPE = 'definition' as const;

/**
 * Represents a definition in the graphql AST.
 */
export interface DefinitionNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DefinitionNode
 */
export function isDefinitionNode(node: unknown): node is DefinitionNode {
  return (node as any)?.type === TYPE;
}