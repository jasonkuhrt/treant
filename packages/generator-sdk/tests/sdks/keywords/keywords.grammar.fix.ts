import { Grammar } from '@treant/grammar';

export const grammar: Grammar.Grammar<'source_file' | 'keyword'> = {
  name: 'test_keywords',
  rules: {
    source_file: $ => $.keyword,
    keyword: () => Grammar.Rules.choice('a', 'b', 'c'),
  },
};
