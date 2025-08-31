import type { Grammar } from '@treant/grammar';

export const grammar: Grammar.Grammar<'source_file' | 'identifier'> = {
  name: 'test_identifier',
  rules: {
    source_file: $ => $.identifier,
    identifier: _ => /[a-z]+/,
  },
};