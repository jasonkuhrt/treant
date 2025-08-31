import type { Node } from 'web-tree-sitter';
import type { IdentifierNode } from './identifier.js';

const TYPE = 'source_file' as const;

/**
 * Represents a source file in the identifier AST.
 */
export interface SourceFileNode extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SourceFileNode
 */
export function isSourceFileNode(node: unknown): node is SourceFileNode {
  return (node as any)?.type === TYPE;
}