// Auto-generated from parser/src/node-types.json and parser/src/grammar.json
// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts
//
// Type-safe cursor interface with exhaustive navigation
import type { TreeCursor, Tree, Node, Point } from 'web-tree-sitter';
import type { CursorConditionals } from './conditionals.js';

/**
 * Type-safe GraphQL cursor with chaining navigation and type flow.
 * Each navigation method returns a new cursor with updated position type,
 * enabling fluent chaining with compile-time type safety.
 */
export interface TreeCursorGraphQL<$Position extends string = string> {
  // Navigation methods return new cursor with updated type parameter
  gotoFirstChild(): CursorConditionals.GotoFirstChild<$Position>;
  gotoNextSibling(): CursorConditionals.GotoNextSibling<$Position>;
  gotoPreviousSibling(): CursorConditionals.GotoPreviousSibling<$Position>;
  gotoParent(): CursorConditionals.GotoParent<$Position>;

  // Access to underlying TreeCursor instance
  readonly raw: TreeCursor;

  // Convenience properties
  readonly node: Node;
  readonly nodeType: $Position;
}

/**
 * Internal dispatch function for cursor navigation.
 * Calls the specified method on the cursor and returns success boolean.
 */
function dispatch(cursor: TreeCursor, method: string): boolean {
  return (cursor as any)[method]();
}

/**
 * Create a cursor object with chaining navigation methods.
 * Each navigation method returns a new cursor object with updated position.
 */
function createCursorObject(cursor: TreeCursor): TreeCursorGraphQL {
  return {
    // Navigation methods - all follow same pattern with recursion
    gotoFirstChild() {
      return dispatch(cursor, 'gotoFirstChild') ? createCursorObject(cursor) : null;
    },
    gotoNextSibling() {
      return dispatch(cursor, 'gotoNextSibling') ? createCursorObject(cursor) : null;
    },
    gotoPreviousSibling() {
      return dispatch(cursor, 'gotoPreviousSibling') ? createCursorObject(cursor) : null;
    },
    gotoParent() {
      return dispatch(cursor, 'gotoParent') ? createCursorObject(cursor) : null;
    },

    // Expose underlying cursor instance
    raw: cursor,

    // Convenience properties
    get node() { return cursor.currentNode; },
    get nodeType() { return cursor.nodeType; },
    
  } as any as TreeCursorGraphQL;
}

/**
 * Create a TreeCursorGraphQL from a Tree.
 * Returns a cursor object with chaining navigation and type flow.
 */
export function create(tree: Tree): TreeCursorGraphQL {
  return createCursorObject(tree.walk());
}
