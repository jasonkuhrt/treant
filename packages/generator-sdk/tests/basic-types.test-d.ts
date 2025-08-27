/**
 * Type-level tests for basic node interfaces and type guards
 *
 * These tests ensure that the generated node interfaces conform to expected
 * TypeScript types and that type guards work correctly.
 */

import type { Assert, AssertExtends, AssertSub } from '@wollybeard/kit/ts';
import type { Node } from 'web-tree-sitter';
import { TreeSitterGraphQL } from '../grammar-lib/$.js';

// Test that all node interfaces extend the base Node type
declare const documentNode: TreeSitterGraphQL.Node.Document;
declare const fieldNode: TreeSitterGraphQL.Node.Field;
declare const nameNode: TreeSitterGraphQL.Node.Name;

type _1 = AssertSub<Node, TreeSitterGraphQL.Node.Document>;
type _2 = AssertSub<Node, TreeSitterGraphQL.Node.Field>;
type _3 = AssertSub<Node, TreeSitterGraphQL.Node.Name>;

// Test that type property is correctly typed as string literal
type _4 = Assert<'document', TreeSitterGraphQL.Node.Document['type']>;
type _5 = Assert<'field', TreeSitterGraphQL.Node.Field['type']>;
type _6 = Assert<'name', TreeSitterGraphQL.Node.Name['type']>;

// Test that different node types are not assignable to each other
type _7 = AssertExtends<false, TreeSitterGraphQL.Node.Field extends TreeSitterGraphQL.Node.Document ? true : false>;
type _8 = AssertExtends<false, TreeSitterGraphQL.Node.Name extends TreeSitterGraphQL.Node.Field ? true : false>;

// Test type guards (type-level validation)
type _9 = Assert<boolean, ReturnType<typeof TreeSitterGraphQL.Node.isDocument>>;
type _10 = Assert<boolean, ReturnType<typeof TreeSitterGraphQL.Node.isField>>;

// Test union types
type _11 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.Document>;
type _12 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.Field>;
type _13 = AssertSub<TreeSitterGraphQL.Node.Name, TreeSitterGraphQL.Node.Document>;
type _14 = AssertSub<TreeSitterGraphQL.Node.Name, TreeSitterGraphQL.Node.Field>;

// Test that Node union includes all expected node types
type _15 = AssertSub<TreeSitterGraphQL.Node.Name, TreeSitterGraphQL.Node.Group.Named>;

// Test specific GraphQL node types
declare const operationDefinition: TreeSitterGraphQL.Node.OperationDefinition;
declare const selectionSet: TreeSitterGraphQL.Node.SelectionSet;
declare const fragmentDefinition: TreeSitterGraphQL.Node.FragmentDefinition;

type _16 = Assert<'operation_definition', TreeSitterGraphQL.Node.OperationDefinition['type']>;
type _17 = Assert<'selection_set', TreeSitterGraphQL.Node.SelectionSet['type']>;
type _18 = Assert<'fragment_definition', TreeSitterGraphQL.Node.FragmentDefinition['type']>;

// Test complex type relationships
declare const typeDefinition: TreeSitterGraphQL.Node.TypeDefinition;
declare const objectTypeDefinition: TreeSitterGraphQL.Node.ObjectTypeDefinition;

type _19 = Assert<'type_definition', TreeSitterGraphQL.Node.TypeDefinition['type']>;
type _20 = Assert<'object_type_definition', TreeSitterGraphQL.Node.ObjectTypeDefinition['type']>;
