/**
 * Type-safe cursor interface with exhaustive navigation
 * @generated
 */

import type { TreeCursor as WebTreeSitterCursor, Tree, Node, Point } from 'web-tree-sitter';
import type { CursorConditionals } from './conditionals.js';

/**
 * Type-safe cursor with chaining navigation and type flow.
 * Each navigation method returns a new cursor with updated position type,
 * enabling fluent chaining with compile-time type safety.
 */
export interface TreeCursor<$Position extends string = string> {
  // Navigation methods return new cursor with updated type parameter
  gotoFirstChild(): CursorConditionals.GotoFirstChild<$Position>;
  gotoNextSibling(): CursorConditionals.GotoNextSibling<$Position>;
  gotoPreviousSibling(): CursorConditionals.GotoPreviousSibling<$Position>;
  gotoParent(): CursorConditionals.GotoParent<$Position>;

  // Access to underlying TreeCursor instance
  readonly raw: WebTreeSitterCursor;

  // Convenience properties
  readonly node: Node;
  readonly nodeType: $Position;
}