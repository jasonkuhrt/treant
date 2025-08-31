import { describe, expect, expectTypeOf, test } from 'vitest';
import { TreeSitterTestIdentifier as Identifier } from './identifier.sdk.fix/$.js';

test('Parser', async () => {
  const ast = await Identifier.Parser.parse('hello');
  expect(Identifier.Node.isSourceFile(ast.rootNode)).toBe(true);
  expect(Identifier.Node.isIdentifier(ast.rootNode.firstChild)).toBe(true);
});

describe('Navigator', () => {
  test('.create', async () => {
    const source = `hello`;
    const ast = await Identifier.Parser.parse(source);
    const $ = await Identifier.Navigator.create(ast);

    expect($.node).toMatchSnapshot();
    expectTypeOf($.node).toEqualTypeOf<Identifier.Node.SourceFile>();

    expect($.text).toEqual(source);
    expectTypeOf($.text).toEqualTypeOf<string>();

    expectTypeOf($.child(0)).toEqualTypeOf<Identifier.Node.Identifier>();

    // @ts-expect-error
    $.child();
    // @ts-expect-error
    $.child(1);
  });
});
