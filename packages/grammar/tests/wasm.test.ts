import { describe, expect, test } from 'vitest';
import { generate } from '../src/generate.js';
import { NodeContext } from '@effect/platform-node';
import { Effect } from 'effect';

describe('WASM generation', () => {
  test('generates WASM file when wasm option is true', async () => {
    const grammar = {
      name: 'test_wasm',
      rules: {
        source_file: ($: any) => $.statement,
        statement: ($: any) => 'hello',
      },
    };

    const result = await generate(grammar, { wasm: true }).pipe(
      Effect.scoped,
      Effect.provide(NodeContext.layer),
      Effect.runPromise,
    );

    // Check that standard artifacts are present
    expect(result['grammar.json']).toBeDefined();
    expect(result['node-types.json']).toBeDefined();
    expect(result['parser.c']).toBeDefined();
    
    // Check that WASM file is present
    expect(result['parser.wasm']).toBeDefined();
    expect(result['parser.wasm']).toBeInstanceOf(Uint8Array);
    expect(result['parser.wasm']?.length).toBeGreaterThan(0);
  });

  test('does not generate WASM file when wasm option is false', async () => {
    const grammar = {
      name: 'test_no_wasm',
      rules: {
        source_file: ($: any) => $.statement,
        statement: ($: any) => 'world',
      },
    };

    const result = await generate(grammar, { wasm: false }).pipe(
      Effect.scoped,
      Effect.provide(NodeContext.layer),
      Effect.runPromise,
    );

    // Check that standard artifacts are present
    expect(result['grammar.json']).toBeDefined();
    expect(result['node-types.json']).toBeDefined();
    expect(result['parser.c']).toBeDefined();
    
    // Check that WASM file is NOT present
    expect(result['parser.wasm']).toBeUndefined();
  });

  test('does not generate WASM file when wasm option is not specified', async () => {
    const grammar = {
      name: 'test_default',
      rules: {
        source_file: ($: any) => 'test',
      },
    };

    const result = await generate(grammar).pipe(
      Effect.scoped,
      Effect.provide(NodeContext.layer),
      Effect.runPromise,
    );

    // Check that standard artifacts are present
    expect(result['grammar.json']).toBeDefined();
    expect(result['node-types.json']).toBeDefined();
    expect(result['parser.c']).toBeDefined();
    
    // Check that WASM file is NOT present by default
    expect(result['parser.wasm']).toBeUndefined();
  });
});