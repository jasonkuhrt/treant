import type { Node } from 'web-tree-sitter';
import type { Document } from './document.js';

const TYPE = 'source_file' as const;

/**
 * Represents a source file in the graphql AST.
 */
export interface SourceFile extends Node {
  type: typeof TYPE;
}

/**
 * Type guard for SourceFile
 */
export function isSourceFile(node: unknown): node is SourceFile {
  return (node as any)?.type === TYPE;
}