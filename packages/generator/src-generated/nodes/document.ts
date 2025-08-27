import type { Node } from 'web-tree-sitter';
import type { Definition } from './definition.js';

const TYPE = 'document' as const;

/**
 * Represents a document in the graphql AST.
 */
export interface Document extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for Document
 */
export function isDocument(node: unknown): node is Document {
  return (node as any)?.type === TYPE;
}