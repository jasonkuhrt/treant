import { NodeContext } from '@effect/platform-node';
import { Effect } from 'effect';
import { describe, expect, test } from 'vitest';
import { build } from '../src/build.js';

describe('WASM generation', () => {
  test('generates WASM file when wasm option is true', async () => {
    const grammar = {
      name: 'test_wasm',
      rules: {
        source_file: ($: any) => $.statement,
        statement: ($: any) => 'hello',
      },
    };

    const result = await build(grammar, { wasm: true }).pipe(
      Effect.scoped,
      Effect.provide(NodeContext.layer),
      Effect.runPromise,
    );
    expect(result).toMatchSnapshot();
  });

  test('does not generate WASM file when wasm option is false', async () => {
    const grammar = {
      name: 'test_no_wasm',
      rules: {
        source_file: ($: any) => $.statement,
        statement: ($: any) => 'world',
      },
    };

    const result = await build(grammar, { wasm: false }).pipe(
      Effect.scoped,
      Effect.provide(NodeContext.layer),
      Effect.runPromise,
    );

    // Check that standard artifacts are present
    expect(result.grammarJson).toBeDefined();
    expect(result.nodeTypes).toBeDefined();
    expect(result.parserC).toBeDefined();

    // Check that WASM file is NOT present
    expect(result.wasm).toBeUndefined();
  });

  test('does not generate WASM file when wasm option is not specified', async () => {
    const grammar = {
      name: 'test_default',
      rules: {
        source_file: ($: any) => 'test',
      },
    };

    const result = await build(grammar).pipe(
      Effect.scoped,
      Effect.provide(NodeContext.layer),
      Effect.runPromise,
    );

    // Check that standard artifacts are present
    expect(result.grammarJson).toBeDefined();
    expect(result.nodeTypes).toBeDefined();
    expect(result.parserC).toBeDefined();

    // Check that WASM file is NOT present by default
    expect(result.wasm).toBeUndefined();
  });
});
