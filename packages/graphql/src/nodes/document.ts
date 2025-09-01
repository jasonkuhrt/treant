import type { Node } from 'web-tree-sitter';
import type { DefinitionNode } from './definition.js';

const TYPE = 'document' as const;

/**
 * Represents a document in the graphql AST.
 */
export interface DocumentNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for DocumentNode
 */
export function isDocumentNode(node: unknown): node is DocumentNode {
  return (node as any)?.type === TYPE;
}