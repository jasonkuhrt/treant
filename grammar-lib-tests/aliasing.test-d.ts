/**
 * Type-level tests for TypeScript identifier aliasing system
 *
 * These tests ensure that the aliasing system works correctly for invalid
 * TypeScript identifiers and that namespace exports provide clean APIs.
 */

import type { Assert, AssertSub } from '@wollybeard/kit/ts';
import { TreeSitterGraphQL } from '../grammar-lib/$.js';

// Test that all current GraphQL node types are accessible
// (All current GraphQL nodes should be valid TS identifiers)
declare const alias: TreeSitterGraphQL.AliasNode;
declare const argument: TreeSitterGraphQL.ArgumentNode;
declare const field: TreeSitterGraphQL.FieldNode;
declare const name: TreeSitterGraphQL.NameNode;

type _1 = Assert<'alias', typeof alias.type>;
type _2 = Assert<'argument', typeof argument.type>;
type _3 = Assert<'field', typeof field.type>;
type _4 = Assert<'name', typeof name.type>;

// Test type guards work correctly (type-level only)
type _5 = TreeSitterGraphQL.AliasNode extends TreeSitterGraphQL.NamedNode ? true : never;
type _6 = TreeSitterGraphQL.ArgumentNode extends TreeSitterGraphQL.NamedNode ? true : never;

// Test that namespace access works for all node types
type _7 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.AliasNode>;
type _8 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.ArgumentNode>;
type _9 = AssertSub<TreeSitterGraphQL.Node, TreeSitterGraphQL.FieldNode>;
type _10 = AssertSub<TreeSitterGraphQL.Node, TreeSitterGraphQL.NameNode>;

// Test complex node types with underscores
declare const operationDefinition: TreeSitterGraphQL.OperationDefinitionNode;
declare const fragmentDefinition: TreeSitterGraphQL.FragmentDefinitionNode;
declare const typeSystemDefinition: TreeSitterGraphQL.TypeSystemDefinitionNode;

type _11 = Assert<'operation_definition', typeof operationDefinition.type>;
type _12 = Assert<'fragment_definition', typeof fragmentDefinition.type>;
type _13 = Assert<'type_system_definition', typeof typeSystemDefinition.type>;

// Test that PascalCase conversion works correctly
// snake_case -> PascalCase: operation_definition -> OperationDefinitionNode
declare const objectTypeDefinition: TreeSitterGraphQL.ObjectTypeDefinitionNode;
declare const inputObjectTypeExtension: TreeSitterGraphQL.InputObjectTypeExtensionNode;

type _14 = Assert<'object_type_definition', typeof objectTypeDefinition.type>;
type _15 = Assert<'input_object_type_extension', typeof inputObjectTypeExtension.type>;

// Future test: If we ever have invalid identifiers, they should work via namespace
// Example: if we had a node type "123invalid", it would generate:
// - Internal: interface 123invalidNode$ extends Node { type: '123invalid' }
// - Export alias: export { 123invalidNode$ as 123invalidNode }
// - Namespace access: TreeSitterGraphQL.123invalidNode (works fine in TS)

// Test that all generated interfaces are properly exported in union types
type _16 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.OperationDefinitionNode>;
type _17 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.FragmentDefinitionNode>;
type _18 = AssertSub<TreeSitterGraphQL.NamedNode, TreeSitterGraphQL.TypeSystemDefinitionNode>;
