import type { Node } from 'web-tree-sitter';
import type { ExecutableDirectiveLocationNode } from './executable_directive_location.js';
import type { TypeSystemDirectiveLocationNode } from './type_system_directive_location.js';

const TYPE = 'directive_location' as const;

/**
 * Represents a directive location in the graphql AST.
 */
export interface DirectiveLocationNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectiveLocationNode
 */
export function isDirectiveLocationNode(node: unknown): node is DirectiveLocationNode {
  return (node as any)?.type === TYPE;
}