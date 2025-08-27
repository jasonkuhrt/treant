import { Grammar } from '@treant/grammar';
import { expect, test } from 'vitest';
import { parse } from '../src/$$.js';
import { comprehensive } from './__fixtures/comprehensive.js';
import { simple } from './__fixtures/simple.js';

expect.addSnapshotSerializer(Grammar.Testing.Serializers.ast);

test('parses simple GraphQL document', async () => {
  const tree = await parse(simple);
  expect(tree).toBeTruthy();
  expect(tree.rootNode.hasError).toBe(false);
});

test('parses comprehensive GraphQL document', async () => {
  // Parse the document
  const tree = await parse(comprehensive);

  // Snapshot test the AST structure
  expect(tree).toBeTruthy();
  expect(tree.rootNode).toMatchSnapshot();
  expect(tree.rootNode.hasError).toBe(false);
});
