/**
 * Navigator utilities for identifier
 * @generated
 */

import type { Tree, Node } from 'web-tree-sitter';
import { NavigationExpectationError } from '../errors/navigation-expectation-error.js';
import type { SourceFileNode } from '../nodes/source_file.js';
import type { IdentifierNode } from '../nodes/identifier.js';

export interface Navigator<N extends Node = Node> {
  node: N;
  path: string[];
  child(index?: number): Navigator | null;
}

export interface SourceFileNavigator {
  node: SourceFileNode;
  path: string[]
  child(): IdentifierNode;
}

/**
 * Create a navigator from a tree (always returns the root source_file node)
 */
export async function create(tree: Tree, path: string[] = []): Promise<SourceFileNavigator> {
  const rootNode = tree.rootNode as SourceFileNode;
  return createSourceFileNavigator(rootNode, path);
}

function createSourceFileNavigator(node: SourceFileNode, path: string[]): SourceFileNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild as IdentifierNode;
      if (!childNode) {
        throw new NavigationExpectationError('Expected identifier child but found none', {
          expectedNodeType: 'identifier',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode;
    },
  };
}

function createNavigator<N extends Node>(node: N, path: string[]): Navigator<N> {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}