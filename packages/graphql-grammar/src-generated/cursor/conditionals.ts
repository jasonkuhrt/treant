// Auto-generated from parser/src/node-types.json and parser/src/grammar.json
// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts
//
// Exhaustive conditional return types for cursor navigation
/* eslint-disable */
// Auto-generated cursor conditional return types
// DO NOT EDIT - This file is overwritten by the generator

import type {
  ChildMap,
  ParentMap,
  SiblingMap,
  PositionalChildMap
} from './maps.js';
import type { TreeCursorGraphQL } from './cursor.js';

/**
 * Namespace containing exhaustive conditional return types
 * for all cursor navigation operations.
 */
export namespace CursorConditionals {
  /**
   * Conditional return type for gotoFirstChild() operation.
   * Returns TreeCursorGraphQL with child node type or null if no children.
   */
  export type GotoFirstChild<TParent extends string> = 
    TParent extends keyof ChildMap
      ? TreeCursorGraphQL<ChildMap[TParent]> | null
      : TreeCursorGraphQL<string> | null;

  /**
   * Conditional return type for gotoNextSibling() operation.
   * Returns TreeCursorGraphQL with sibling node type or null if no siblings.
   */
  export type GotoNextSibling<TCurrent extends string> = 
    TCurrent extends keyof SiblingMap
      ? TreeCursorGraphQL<SiblingMap[TCurrent]> | null
      : TreeCursorGraphQL<string> | null;

  /**
   * Conditional return type for gotoPreviousSibling() operation.
   * Returns TreeCursorGraphQL with sibling node type or null if no siblings.
   */
  export type GotoPreviousSibling<TCurrent extends string> = 
    TCurrent extends keyof SiblingMap
      ? TreeCursorGraphQL<SiblingMap[TCurrent]> | null
      : TreeCursorGraphQL<string> | null;

  /**
   * Conditional return type for gotoParent() operation.
   * Returns TreeCursorGraphQL with parent node type or null if no parent.
   */
  export type GotoParent<TChild extends string> = 
    TChild extends keyof ParentMap
      ? TreeCursorGraphQL<ParentMap[TChild]> | null
      : TreeCursorGraphQL<string> | null;

  /**
   * Multi-step navigation path type for complex traversals.
   * Enables type-safe navigation along predefined paths.
   */
  export type NavigationPath<
    TStart extends string,
    TPath extends readonly string[]
  > = TPath extends readonly [infer TFirst, ...infer TRest]
    ? TFirst extends string
      ? TRest extends readonly string[]
        ? TStart extends keyof ChildMap
          ? TFirst extends ChildMap[TStart]
            ? NavigationPath<TFirst, TRest>
            : never
          : never
        : TFirst
      : never
    : TStart;

  /**
   * Type to validate if a navigation operation is possible.
   */
  export type CanNavigate<TFrom extends string, TTo extends string> = 
    TFrom extends keyof ChildMap
      ? TTo extends ChildMap[TFrom]
        ? true
        : false
      : false;

  /**
   * Union of all possible node types that can have children.
   */
  export type ParentNodeTypes = keyof ChildMap;

  /**
   * Union of all possible child node types.
   */
  export type ChildNodeTypes = ChildMap[keyof ChildMap];

  /**
   * Union of all possible node types that have siblings.
   */
  export type SiblingNodeTypes = keyof SiblingMap;

  /**
   * Depth-limited recursive navigation type to prevent infinite recursion.
   * Limits traversal depth to prevent TypeScript compiler issues.
   */
  type RecursiveNavigation<
    T extends string,
    Depth extends number = 8
  > = [Depth] extends [0]
    ? T
    : T extends keyof ChildMap
    ? T | RecursiveNavigation<ChildMap[T], Prev<Depth>>
    : T;

  /**
   * Helper type to decrement depth counter for recursion control.
   */
  type Prev<T extends number> = T extends 0
    ? never
    : T extends 1 ? 0
    : T extends 2 ? 1
    : T extends 3 ? 2
    : T extends 4 ? 3
    : T extends 5 ? 4
    : T extends 6 ? 5
    : T extends 7 ? 6
    : T extends 8 ? 7
    : number;

  /**
   * GraphQL-specific conditional types for common navigation patterns.
   */
  export type NavigateToFieldName<T extends string> = 
    T extends "field"
      ? TreeCursorGraphQL<"name"> | null
      : null;

  export type NavigateToTypeName<T extends string> = 
    T extends "named_type"
      ? TreeCursorGraphQL<"name"> | null
      : null;

  export type NavigateToFragmentTarget<T extends string> = 
    T extends "fragment_definition"
      ? TreeCursorGraphQL<"type_condition"> | null
      : null;

}
