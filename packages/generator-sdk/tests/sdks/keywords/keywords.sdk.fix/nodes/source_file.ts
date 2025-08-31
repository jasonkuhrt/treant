import type { Node } from 'web-tree-sitter';
import type { KeywordNode } from './keyword.js';

const TYPE = 'source_file' as const;

/**
 * Represents a source file in the test_keywords AST.
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