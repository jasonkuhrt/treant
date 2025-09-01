import type { Grammar } from '@treant/grammar';
import { expect, test } from 'vitest';
import { generate } from '../src/generator.js';

test('includes grammar artifacts in generated files when emitArtifacts is true', async () => {
  // Minimal grammar for testing
  const grammar: Grammar.BuiltGrammar = {
    grammarJson: {
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
    },

    nodeTypes: [
      {
        type: 'source_file',
        named: true,
      },
      {
        type: 'expression',
        named: true,
      },
    ],
    parserC: '', // Mock value for test
  };

  // Generate SDK with artifacts enabled
  const result = await generate({ grammar, emitArtifacts: true });

  expect(result.files.find(f => f.path === '__artifacts__/grammar.json')).toMatchSnapshot();
  expect(result.files.find(f => f.path === '__artifacts__/node-types.json')).toMatchSnapshot();
});

test('does not include artifacts by default', async () => {
  // Minimal grammar for testing
  const grammar: Grammar.BuiltGrammar = {
    grammarJson: {
      name: 'test_no_artifacts',
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
    },

    nodeTypes: [
      {
        type: 'source_file',
        named: true,
      },
      {
        type: 'expression',
        named: true,
      },
    ],
    parserC: '', // Mock value for test
  };

  // Generate SDK without artifacts (default)
  const result = await generate({ grammar });

  expect(result.files.find(f => f.path === '__artifacts__/grammar.json')).toBeUndefined();
  expect(result.files.find(f => f.path === '__artifacts__/node-types.json')).toBeUndefined();
});
