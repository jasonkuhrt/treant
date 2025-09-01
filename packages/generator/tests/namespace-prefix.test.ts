import type { Grammar } from '@treant/grammar';
import { expect, test } from 'vitest';
import { generate } from '../src/generator.js';

const grammar: Grammar.BuiltGrammar = {
  grammarJson: {
    name: 'test',
    rules: {
      source_file: {
        type: 'STRING',
        value: 'hello',
      },
    },
  },
  nodeTypes: [
    {
      type: 'source_file',
      named: true,
    },
  ],
  parserC: '', // Mock value for test
};

test.each([
  [undefined, 'TreantTest'],
  [{ prefix: 'MyCustom' }, 'MyCustomTest'],
  [{ name: 'MyLang' }, 'TreantMyLang'],
  [{ prefix: 'My', name: 'CustomLang' }, 'MyCustomLang'],
  [{ prefix: null }, 'Test'],
  [{ prefix: null, name: 'CustomName' }, 'CustomName'],
  [{ prefix: 'My', concatMode: 'kebab' as const }, 'my-test'],
  [{ prefix: 'My', concatMode: 'snake' as const }, 'my_test'],
  [{ prefix: 'MyPrefix', name: 'CustomName', concatMode: 'kebab' as const }, 'my-prefix-custom-name'],
  [{ prefix: 'MyPrefix', name: 'CustomName', concatMode: 'snake' as const }, 'my_prefix_custom_name'],
  [{ prefix: null, concatMode: 'kebab' as const }, 'Test'], // concatMode has no effect when prefix is null
])('namespace config %o generates %s', async (namespace, expected) => {
  const result = await generate({ 
    grammar, 
    ...(namespace !== undefined && { namespace })
  });
  const namespaceFile = result.files.find(f => f.path === '$.ts');
  expect(namespaceFile?.content).toContain(`export * as ${expected}`);
});

test.each([
  [{ prefix: '123invalid' }],
  [{ name: '456invalid' }],
])('throws for invalid namespace %o', async (namespace) => {
  await expect(generate({ grammar, namespace })).rejects.toThrow();
});