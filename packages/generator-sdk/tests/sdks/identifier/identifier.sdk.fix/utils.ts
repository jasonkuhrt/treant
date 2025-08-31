/**
 * Utility functions for test_identifier AST traversal.
 * @generated
 */

import type * as WebTreeSitter from 'web-tree-sitter';

// Node type imports would go here...

export function findChildByType<T extends string>(
  node: WebTreeSitter.Node,
  type: T
): WebTreeSitter.Node | null {
  if (!node) return null;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child?.type === type) {
      return child;
    }
  }
  return null;
}

export function findChildrenByType<T extends string>(
  node: WebTreeSitter.Node,
  type: T
): WebTreeSitter.Node[] {
  if (!node) return [];
  const results: WebTreeSitter.Node[] = [];
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child?.type === type) {
      results.push(child);
    }
  }
  return results;
}
