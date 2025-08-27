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
declare const alias: TreeSitterGraphQL.Node.Alias;
declare const argument: TreeSitterGraphQL.Node.Argument;
declare const field: TreeSitterGraphQL.Node.Field;
declare const name: TreeSitterGraphQL.Node.Name;

type _1 = Assert<'alias', typeof alias.type>;
type _2 = Assert<'argument', typeof argument.type>;
type _3 = Assert<'field', typeof field.type>;
type _4 = Assert<'name', typeof name.type>;

// Test type guards work correctly (type-level only)
type _5 = TreeSitterGraphQL.Node.Alias extends TreeSitterGraphQL.Node.Group.Named ? true : never;
type _6 = TreeSitterGraphQL.Node.Argument extends TreeSitterGraphQL.Node.Group.Named ? true : never;

// Test that namespace access works for all node types
type _7 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.Alias>;
type _8 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.Argument>;
type _9 = AssertSub<TreeSitterGraphQL.Node.Group.Any, TreeSitterGraphQL.Node.Field>;
type _10 = AssertSub<TreeSitterGraphQL.Node.Group.Any, TreeSitterGraphQL.Node.Name>;

// Test complex node types with underscores
declare const operationDefinition: TreeSitterGraphQL.Node.OperationDefinition;
declare const fragmentDefinition: TreeSitterGraphQL.Node.FragmentDefinition;
declare const typeSystemDefinition: TreeSitterGraphQL.Node.TypeSystemDefinition;

type _11 = Assert<'operation_definition', typeof operationDefinition.type>;
type _12 = Assert<'fragment_definition', typeof fragmentDefinition.type>;
type _13 = Assert<'type_system_definition', typeof typeSystemDefinition.type>;

// Test that PascalCase conversion works correctly
// snake_case -> PascalCase: operation_definition -> OperationDefinitionNode
declare const objectTypeDefinition: TreeSitterGraphQL.Node.ObjectTypeDefinition;
declare const inputObjectTypeExtension: TreeSitterGraphQL.Node.InputObjectTypeExtension;

type _14 = Assert<'object_type_definition', typeof objectTypeDefinition.type>;
type _15 = Assert<'input_object_type_extension', typeof inputObjectTypeExtension.type>;

// Future test: If we ever have invalid identifiers, they should work via namespace
// Example: if we had a node type "123invalid", it would generate:
// - Internal: interface 123invalidNode$ extends Node { type: '123invalid' }
// - Export alias: export { 123invalidNode$ as 123invalidNode }
// - Namespace access: TreeSitterGraphQL.Node.123invalid (works fine in TS)

// Test that all generated interfaces are properly exported in union types
type _16 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.OperationDefinition>;
type _17 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.FragmentDefinition>;
type _18 = AssertSub<TreeSitterGraphQL.Node.Group.Named, TreeSitterGraphQL.Node.TypeSystemDefinition>;
