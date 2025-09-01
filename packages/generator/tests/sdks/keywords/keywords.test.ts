import { describe, expect, expectTypeOf, test } from 'vitest';
import { catchOrThrow } from '../../helpers/utils.js';
import { TreantKeywords as Sdk } from './fixture.sdk/$.js';

const sources = { a: 'a', b: 'b', c: 'c' };

const astA = await Sdk.Parser.parse(sources.a);
const $a = await Sdk.Navigator.create(astA);

describe('Navigator', () => {
  test('.path tracks access path', async () => {
    const $ = $a;
    expect($.path).toEqual([]);
    expect($.child().path).toEqual(['child()']);
  });

  test('.child()', async () => {
    const $ = $a;

    const $1 = $.child();
    expect(Sdk.Node.isKeyword($1.node)).toBe(true);
    expectTypeOf($1.node).toEqualTypeOf<Sdk.Node.Keyword>();

    const abc = $.child().child();
    expect(Sdk.Node.Anonymous.isA(abc)).toBe(true);
    expectTypeOf(abc).toEqualTypeOf<Sdk.Node.Anonymous.A | Sdk.Node.Anonymous.B | Sdk.Node.Anonymous.C>();

    // @ts-expect-error - can only ever be 0, so no parameter
    $.child(0);
  });

  test('.keyword() returns keyword node navigator', async () => {
    const $ = $a;
    const $1 = $.keyword();
    expect(Sdk.Node.isKeyword($1.node)).toBe(true);
    expectTypeOf($1.node).toEqualTypeOf<Sdk.Node.Keyword>();
  });

  test('.choice() returns keyword node navigator', async () => {
    const $ = $a;
    const abc = $.keyword().choice();
    expect(Sdk.Node.Anonymous.isA(abc)).toBe(true);
    expectTypeOf(abc).toEqualTypeOf<Sdk.Node.Anonymous.A | Sdk.Node.Anonymous.B | Sdk.Node.Anonymous.C>();
  });

  test('.<choice> function for each choice', async () => {
    const $ = $a;
    const $1 = $.keyword();
    expectTypeOf<ReturnType<typeof $1.a>>().toEqualTypeOf<Sdk.Node.Anonymous.A | null>();
    expectTypeOf<ReturnType<typeof $1.b>>().toEqualTypeOf<Sdk.Node.Anonymous.B | null>();
    expectTypeOf<ReturnType<typeof $1.c>>().toEqualTypeOf<Sdk.Node.Anonymous.C | null>();
    // @ts-expect-error - d doesn't exist
    $1.d;
  });
  test('.<choice>() returns node if match', async () => {
    const $ = $a;
    const a = $.keyword().a();
    expect(Sdk.Node.Anonymous.isA(a)).toBe(true);
    expectTypeOf(a).toEqualTypeOf<Sdk.Node.Anonymous.A | null>();
  });

  test('.<choice>() returns null if search no match', async () => {
    const $ = $a;
    expect($.keyword().b()).toBeNull();
  });

  test('.<choice>OrThrow() throws if search no match, else returns node', async () => {
    const $ = $a;
    const $1 = $.keyword();

    expect(Sdk.Node.Anonymous.isA($1.aOrThrow())).toBe(true);
    expectTypeOf($1.aOrThrow()).toEqualTypeOf<Sdk.Node.Anonymous.A>();

    const error = catchOrThrow<Sdk.Errors.NavigationExpectationError>(() => $.keyword().bOrThrow());
    expect(error).toMatchInlineSnapshot(
      `[NavigationExpectationError: Expected to find "b" but it was not present]`,
    );
    expect(error.context).toMatchInlineSnapshot(`
      {
        "actualNodeType": "a",
        "expectedNodeType": "b",
        "path": [
          "keyword()",
          "b()",
        ],
        "searchText": "b",
      }
    `);
  });
});
