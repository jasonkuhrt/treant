import type { Node } from 'web-tree-sitter';
import type { DirectiveNode } from './directive.js';

const TYPE = 'directives' as const;

/**
 * Represents a directives in the graphql AST.
 */
export interface DirectivesNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DirectivesNode
 */
export function isDirectivesNode(node: unknown): node is DirectivesNode {
  return (node as any)?.type === TYPE;
}