/**
 * Cursor position maps for type-safe navigation
 * @generated
 */

/* eslint-disable */
// Auto-generated cursor position maps
// DO NOT EDIT - This file is overwritten by the generator

import type { Node } from 'web-tree-sitter';

/**
 * Maps parent node types to their possible child node types.
 * Used for type-safe gotoFirstChild and gotoChild operations.
 */
export interface ChildMap {
  'source_file': 'identifier';
}

/**
 * Maps child node types to their possible parent node types.
 * Used for type-safe gotoParent operations.
 */
export interface ParentMap {
  'identifier': 'source_file';
}

/**
 * Maps node types to their possible sibling node types.
 * Used for type-safe gotoNextSibling and gotoPreviousSibling operations.
 */
export interface SiblingMap {
}

/**
 * Maps parent node types to ordered sequences of their child types.
 * Used for position-aware type-safe navigation in SEQ rules.
 */
export interface SequenceMap {
}

/**
 * Maps parent node types to child types at specific positions.
 * Used for type-safe gotoChild(index) operations.
 */
export interface PositionalChildMap {
}

/**
 * Combined interface providing all cursor position relationship maps.
 * This is the main interface used by the cursor navigation system.
 */
export interface PositionMap {
  /** Child relationships */
  children: ChildMap;
  /** Parent relationships */
  parents: ParentMap;
  /** Sibling relationships */
  siblings: SiblingMap;
  /** Sequence information for ordered navigation */
  sequences: SequenceMap;
  /** Positional child information for index-based access */
  positional: PositionalChildMap;
}

/**
 * Utility type to get child types for a parent node type.
 */
export type GetChildTypes<T extends keyof ChildMap> = ChildMap[T];

/**
 * Utility type to get parent types for a child node type.
 */
export type GetParentTypes<T extends keyof ParentMap> = ParentMap[T];

/**
 * Utility type to get sibling types for a node type.
 */
export type GetSiblingTypes<T extends keyof SiblingMap> = SiblingMap[T];

/**
 * Utility type to get child type at specific position.
 */
export type GetChildAtPosition<
  T extends keyof PositionalChildMap,
  I extends number
> = PositionalChildMap[T] extends readonly (infer U)[]
  ? I extends keyof PositionalChildMap[T]
    ? PositionalChildMap[T][I]
    : never
  : never;
