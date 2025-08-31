import type { Grammar } from '@treant/grammar';
import { expect, test } from 'vitest';
import { generate } from '../src/generator.js';

test('includes grammar artifacts in generated files', async () => {
  // Minimal grammar for testing
  const grammar: Grammar.GrammarJson = {
    name: 'test_artifacts',
    rules: {
      source_file: {
        type: 'SYMBOL',
        name: 'expression',
      },
      expression: {
        type: 'STRING',
        value: 'hello',
      },
    },
  };

  // Minimal node types
  const nodeTypes: Grammar.NodeType[] = [
    {
      type: 'source_file',
      named: true,
    },
    {
      type: 'expression',
      named: true,
    },
  ];

  // Generate SDK without WASM (just testing artifact generation)
  const result = await generate({
    grammar,
    nodeTypes,
  });

  expect(result.files.find(f => f.path === '__artifacts__/grammar.json')).toMatchSnapshot();
  expect(result.files.find(f => f.path === '__artifacts__/node-types.json')).toMatchSnapshot();
});
