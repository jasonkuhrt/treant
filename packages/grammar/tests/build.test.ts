import { describe, expect, test } from 'vitest';
import { generateAsync } from '../src/$$.js';

describe('generate', () => {
  test('generates parser from simple grammar', async () => {
    const result = await generateAsync({
      name: 'test',
      rules: {
        source_file: $ => $.expression,
        expression: () => 'hello',
      },
    });

    expect(result).toMatchSnapshot();
  });
});
