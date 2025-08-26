import type { Assert } from '@wollybeard/kit/ts';
import type { TreeCursorGraphQL } from '../grammar-lib/cursor/cursor.js';

// Start from source_file and traverse down
declare const cursor: TreeCursorGraphQL<'source_file'>;

const doc = cursor.gotoFirstChild();
type _1 = Assert<TreeCursorGraphQL<'document'> | null, typeof doc>;

const def = doc!.gotoFirstChild();
type _2 = Assert<TreeCursorGraphQL<'definition'> | null, typeof def>;

const execDef = def!.gotoFirstChild();
type _3 = Assert<
  TreeCursorGraphQL<'executable_definition' | 'type_system_definition' | 'type_system_extension'> | null,
  typeof execDef
>;

// Field navigation - check union types work
declare const field: TreeCursorGraphQL<'field'>;
const fieldChild = field.gotoFirstChild();
type _4 = Assert<
  TreeCursorGraphQL<'alias' | 'arguments' | 'directive' | 'name' | 'selection_set'> | null,
  typeof fieldChild
>;

// Selection set navigation
declare const selectionSet: TreeCursorGraphQL<'selection_set'>;
const selection = selectionSet.gotoFirstChild();
type _5 = Assert<TreeCursorGraphQL<'selection'> | null, typeof selection>;

// Selection can be field, fragment_spread, or inline_fragment
const selectionChild = selection!.gotoFirstChild();
type _6 = Assert<TreeCursorGraphQL<'field' | 'fragment_spread' | 'inline_fragment'> | null, typeof selectionChild>;

// Parent navigation
const backToDoc = def!.gotoParent();
type _7 = Assert<TreeCursorGraphQL<'document'> | null, typeof backToDoc>;

const backToSource = doc!.gotoParent();
type _8 = Assert<TreeCursorGraphQL<'source_file'> | null, typeof backToSource>;

// Named type is simple - just has name child
declare const namedType: TreeCursorGraphQL<'named_type'>;
const name = namedType.gotoFirstChild();
type _9 = Assert<TreeCursorGraphQL<'name'> | null, typeof name>;

// Generic string fallback
declare const generic: TreeCursorGraphQL<string>;
const genericChild = generic.gotoFirstChild();
type _10 = Assert<TreeCursorGraphQL<string> | null, typeof genericChild>;

// Unknown specific type still returns typed cursor
declare const unknown: TreeCursorGraphQL<'some_unknown_type'>;
const unknownChild = unknown.gotoFirstChild();
type _11 = Assert<TreeCursorGraphQL<string> | null, typeof unknownChild>;
