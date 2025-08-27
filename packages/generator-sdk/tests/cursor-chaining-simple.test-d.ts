/**
 * Simple type-level test for cursor chaining API
 * This tests the most basic chaining feature: gotoFirstChild with type flow
 */
import type { TreeSitterGraphQL } from '../grammar-lib/$.js';

// Helper for type testing
declare function expectType<T>(value: T): void;

// Test basic cursor creation
type BasicCursor = ReturnType<typeof TreeSitterGraphQL.Cursor.createTreeCursorGraphQL>;
expectType<TreeSitterGraphQL.Cursor.TreeCursorGraphQL<string>>(null as any as BasicCursor);

// Test that gotoFirstChild returns proper conditional type
type CursorAtSourceFile = TreeSitterGraphQL.Cursor.TreeCursorGraphQL<'source_file'>;
type FirstChildResult = ReturnType<CursorAtSourceFile['gotoFirstChild']>;

// Should be TreeCursorGraphQL<'document'> | null because source_file's first child is document
expectType<TreeSitterGraphQL.Cursor.TreeCursorGraphQL<'document'> | null>(null as any as FirstChildResult);

// Test method chaining: source_file -> document -> definition
declare const cursor: TreeSitterGraphQL.Cursor.TreeCursorGraphQL<'source_file'>;
const firstChild = cursor.gotoFirstChild(); // Should be 'document' 
const chainResult = firstChild?.gotoFirstChild(); // Should be 'definition'
expectType<TreeSitterGraphQL.Cursor.TreeCursorGraphQL<'definition'> | null>(chainResult);