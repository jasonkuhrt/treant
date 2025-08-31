import type { Grammar } from '@treant/grammar';
import { expect, test } from 'vitest';
import { generate } from '../src/generator.js';

const minimalGrammar: Grammar.GrammarJson = {
  name: 'test',
  rules: {
    source_file: {
      type: 'STRING',
      value: 'hello',
    },
  },
};

const minimalNodeTypes: Grammar.NodeType[] = [
  {
    type: 'source_file',
    named: true,
  },
];

test('namespace configuration', async () => {
  // Test default prefix (Treant)
  const resultDefault = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
  });
  const namespaceFileDefault = resultDefault.files.find(f => f.path === '$.ts');
  expect(namespaceFileDefault?.content).toContain('export * as TreantTest');

  // Test custom prefix with namespace object
  const resultCustomPrefix = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: 'MyCustom' },
  });
  const namespaceFileCustomPrefix = resultCustomPrefix.files.find(f => f.path === '$.ts');
  expect(namespaceFileCustomPrefix?.content).toContain('export * as MyCustomTest');

  // Test custom name
  const resultCustomName = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { name: 'MyLang' },
  });
  const namespaceFileCustomName = resultCustomName.files.find(f => f.path === '$.ts');
  expect(namespaceFileCustomName?.content).toContain('export * as TreantMyLang');

  // Test both custom prefix and name
  const resultBothCustom = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: 'My', name: 'CustomLang' },
  });
  const namespaceFileBothCustom = resultBothCustom.files.find(f => f.path === '$.ts');
  expect(namespaceFileBothCustom?.content).toContain('export * as MyCustomLang');

  // Test no prefix (null)
  const resultNoPrefix = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: null },
  });
  const namespaceFileNoPrefix = resultNoPrefix.files.find(f => f.path === '$.ts');
  expect(namespaceFileNoPrefix?.content).toContain('export * as Test');

  // Test no prefix with custom name
  const resultNoPrefixCustomName = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: null, name: 'CustomName' },
  });
  const namespaceFileNoPrefixCustomName = resultNoPrefixCustomName.files.find(f => f.path === '$.ts');
  expect(namespaceFileNoPrefixCustomName?.content).toContain('export * as CustomName');

  // Test kebab concatenation mode
  const resultKebab = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: 'My', concatMode: 'kebab' },
  });
  const namespaceFileKebab = resultKebab.files.find(f => f.path === '$.ts');
  expect(namespaceFileKebab?.content).toContain('export * as my-test');

  // Test snake concatenation mode
  const resultSnake = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: 'My', concatMode: 'snake' },
  });
  const namespaceFileSnake = resultSnake.files.find(f => f.path === '$.ts');
  expect(namespaceFileSnake?.content).toContain('export * as my_test');

  // Test kebab with custom name
  const resultKebabCustom = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: 'MyPrefix', name: 'CustomName', concatMode: 'kebab' },
  });
  const namespaceFileKebabCustom = resultKebabCustom.files.find(f => f.path === '$.ts');
  expect(namespaceFileKebabCustom?.content).toContain('export * as my-prefix-custom-name');

  // Test snake with custom name
  const resultSnakeCustom = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: 'MyPrefix', name: 'CustomName', concatMode: 'snake' },
  });
  const namespaceFileSnakeCustom = resultSnakeCustom.files.find(f => f.path === '$.ts');
  expect(namespaceFileSnakeCustom?.content).toContain('export * as my_prefix_custom_name');

  // Test that concatMode has no effect when prefix is null
  const resultNoPrefixKebab = await generate({
    grammar: minimalGrammar,
    nodeTypes: minimalNodeTypes,
    namespace: { prefix: null, concatMode: 'kebab' },
  });
  const namespaceFileNoPrefixKebab = resultNoPrefixKebab.files.find(f => f.path === '$.ts');
  expect(namespaceFileNoPrefixKebab?.content).toContain('export * as Test'); // Should be unaffected

  // Test invalid prefix (should throw)
  await expect(
    generate({
      grammar: minimalGrammar,
      nodeTypes: minimalNodeTypes,
      namespace: { prefix: '123invalid' }, // Starts with number, invalid
    })
  ).rejects.toThrow();

  // Test invalid name (should throw)
  await expect(
    generate({
      grammar: minimalGrammar,
      nodeTypes: minimalNodeTypes,
      namespace: { name: '456invalid' }, // Starts with number, invalid
    })
  ).rejects.toThrow();
});