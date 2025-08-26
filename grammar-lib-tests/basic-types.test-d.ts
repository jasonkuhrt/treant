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
declare const documentNode: TreeSitterGraphQL.DocumentNode;
declare const fieldNode: TreeSitterGraphQL.FieldNode;
declare const nameNode: TreeSitterGraphQL.NameNode;

type _1 = AssertSub<Node, TreeSitterGraphQL.DocumentNode>;
type _2 = AssertSub<Node, TreeSitterGraphQL.FieldNode>;
type _3 = AssertSub<Node, TreeSitterGraphQL.NameNode>;

// Test that type property is correctly typed as string literal
type _4 = Assert<'document', TreeSitterGraphQL.DocumentNode['type']>;
type _5 = Assert<'field', TreeSitterGraphQL.FieldNode['type']>;
type _6 = Assert<'name', TreeSitterGraphQL.NameNode['type']>;

// Test that different node types are not assignable to each other
type _7 = AssertExtends<false, TreeSitterGraphQL.FieldNode extends TreeSitterGraphQL.DocumentNode ? true : false>;
type _8 = AssertExtends<false, TreeSitterGraphQL.NameNode extends TreeSitterGraphQL.FieldNode ? true : false>;

// Test type guards (type-level validation)
type _9 = Assert<boolean, ReturnType<typeof TreeSitterGraphQL.isDocumentNode>>;
type _10 = Assert<boolean, ReturnType<typeof TreeSitterGraphQL.isFieldNode>>;

// Test union types
type _11 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.DocumentNode>;
type _12 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.FieldNode>;
type _13 = AssertSub<TreeSitterGraphQL.Node, TreeSitterGraphQL.DocumentNode>;
type _14 = AssertSub<TreeSitterGraphQL.Node, TreeSitterGraphQL.FieldNode>;

// Test that Node union includes all expected node types
type _15 = AssertSub<TreeSitterGraphQL.Node, TreeSitterGraphQL.NamedNode>;

// Test specific GraphQL node types
declare const operationDefinition: TreeSitterGraphQL.OperationDefinitionNode;
declare const selectionSet: TreeSitterGraphQL.SelectionSetNode;
declare const fragmentDefinition: TreeSitterGraphQL.FragmentDefinitionNode;

type _16 = Assert<'operation_definition', TreeSitterGraphQL.OperationDefinitionNode['type']>;
type _17 = Assert<'selection_set', TreeSitterGraphQL.SelectionSetNode['type']>;
type _18 = Assert<'fragment_definition', TreeSitterGraphQL.FragmentDefinitionNode['type']>;

// Test complex type relationships
declare const typeDefinition: TreeSitterGraphQL.TypeDefinitionNode;
declare const objectTypeDefinition: TreeSitterGraphQL.ObjectTypeDefinitionNode;

type _19 = Assert<'type_definition', TreeSitterGraphQL.TypeDefinitionNode['type']>;
type _20 = Assert<'object_type_definition', TreeSitterGraphQL.ObjectTypeDefinitionNode['type']>;
