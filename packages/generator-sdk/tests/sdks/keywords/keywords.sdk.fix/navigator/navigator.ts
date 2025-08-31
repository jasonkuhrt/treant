/**
 * Navigator utilities for test_keywords
 * @generated
 */

import type { Tree, Node } from 'web-tree-sitter';
import { NavigationExpectationError } from '../errors/navigation-expectation-error.js';
import type { KeywordNode } from '../nodes/keyword.js';
import type { SourceFileNode } from '../nodes/source_file.js';
import type { A } from '../nodes/anonymous/a.js';
import type { B } from '../nodes/anonymous/b.js';
import type { C } from '../nodes/anonymous/c.js';

export interface Navigator<N extends Node = Node> {
  node: N;
  text: string;
  path: string[];
  child(index?: number): Navigator | null;
}

export interface SourceFileNavigator {
  node: SourceFileNode;
  text: string;
  path: string[];
  child(): KeywordNavigator;
  keyword(): KeywordNavigator;
}

export interface KeywordNavigator {
  node: KeywordNode;
  text: string;
  path: string[];
  child(): A | B | C;
  choice(): A | B | C;
  a(): A | null;
  aOrThrow(): A;
  b(): B | null;
  bOrThrow(): B;
  c(): C | null;
  cOrThrow(): C;
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
    text: node.text,
    path,
    child(index = 0) {
      const childNode = node.firstChild as KeywordNode;
      const childPath = [...path, 'child(0)'];
      return createKeywordNavigator(childNode, childPath);
    },
    keyword() {
      const child = node.firstChild as KeywordNode;
      const keywordPath = [...path, 'keyword()'];
      return createKeywordNavigator(child, keywordPath);
    },
  };
}

function createNavigator<N extends Node>(node: N, path: string[]): Navigator<N> {
  return {
    node,
    text: node.text,
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

function createKeywordNavigator(node: KeywordNode, path: string[]): KeywordNavigator {
  return {
    node,
    text: node.text,
    path,
    child() {
      const childNode = node.firstChild;
      return childNode as A | B | C;
    },
    choice() {
      const child = node.firstChild;
      return child as A | B | C;
    },
    a() {
      // Find child with text 'a'
      const child = node.firstChild;
      if (child && child.type === 'a' && !child.isNamed) {
        return child as A;
      }
      return null;
    },
    aOrThrow() {
      const result = this.a();
      if (result === null) {
        const actualChild = node.firstChild;
        const currentPath = [...path, 'a()'];
        throw new NavigationExpectationError(
          'Expected to find "a" but it was not present',
          {
            expectedNodeType: 'a',
            actualNodeType: actualChild ? actualChild.type : null,
            searchText: 'a',
            path: currentPath
          }
        );
      }
      return result;
    },
    b() {
      // Find child with text 'b'
      const child = node.firstChild;
      if (child && child.type === 'b' && !child.isNamed) {
        return child as B;
      }
      return null;
    },
    bOrThrow() {
      const result = this.b();
      if (result === null) {
        const actualChild = node.firstChild;
        const currentPath = [...path, 'b()'];
        throw new NavigationExpectationError(
          'Expected to find "b" but it was not present',
          {
            expectedNodeType: 'b',
            actualNodeType: actualChild ? actualChild.type : null,
            searchText: 'b',
            path: currentPath
          }
        );
      }
      return result;
    },
    c() {
      // Find child with text 'c'
      const child = node.firstChild;
      if (child && child.type === 'c' && !child.isNamed) {
        return child as C;
      }
      return null;
    },
    cOrThrow() {
      const result = this.c();
      if (result === null) {
        const actualChild = node.firstChild;
        const currentPath = [...path, 'c()'];
        throw new NavigationExpectationError(
          'Expected to find "c" but it was not present',
          {
            expectedNodeType: 'c',
            actualNodeType: actualChild ? actualChild.type : null,
            searchText: 'c',
            path: currentPath
          }
        );
      }
      return result;
    },
  };
}