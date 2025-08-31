import * as NodeContext from '@effect/platform-node/NodeContext';
import * as FileSystem from '@effect/platform/FileSystem';
import { Effect } from 'effect';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { withCachedDir } from './$.js';

describe('withCachedDir', () => {
  let cacheDir: string;
  const run = (fn: any) => fn.pipe(Effect.provide(NodeContext.layer), Effect.runPromise);

  beforeEach(async () => { cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-')); });
  afterEach(async () => { await fs.rm(cacheDir, { recursive: true, force: true }); });

  it('creates cache on first run', async () => {
    let calls = 0;
    const cachePath = path.join(cacheDir, 'key1');
    const gen = (dir: string) => Effect.gen(function*() {
      calls++;
      yield* FileSystem.FileSystem.pipe(Effect.flatMap(fs => fs.writeFileString(path.join(dir, 'test.txt'), 'data')));
      return dir;
    });
    
    const dir = await run(withCachedDir(cachePath, gen));
    expect(calls).toBe(1);
    expect(dir).toBe(cachePath);
    expect(await fs.readFile(path.join(dir, 'test.txt'), 'utf-8')).toBe('data');
  });

  it('uses cache on subsequent runs', async () => {
    let calls = 0;
    const cachePath = path.join(cacheDir, 'key2');
    const gen = (dir: string) => Effect.gen(function*() {
      calls++;
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(path.join(dir, 'test.txt'), `v${calls}`);
      return dir;
    });

    const dir1 = await run(withCachedDir(cachePath, gen));
    const dir2 = await run(withCachedDir(cachePath, gen));
    
    expect(calls).toBe(1); // Only called once
    expect(dir1).toBe(cachePath);
    expect(dir2).toBe(cachePath);
    expect(await fs.readFile(path.join(dir1, 'test.txt'), 'utf-8')).toBe('v1');
  });

  it('different paths use different caches', async () => {
    const cachePathA = path.join(cacheDir, 'a');
    const cachePathB = path.join(cacheDir, 'b');
    const gen = (val: string) => (dir: string) => Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(path.join(dir, 'f.txt'), val);
      return dir;
    });

    const dirA = await run(withCachedDir(cachePathA, gen('a')));
    const dirB = await run(withCachedDir(cachePathB, gen('b')));
    
    expect(dirA).toBe(cachePathA);
    expect(dirB).toBe(cachePathB);
    expect(await fs.readFile(path.join(dirA, 'f.txt'), 'utf-8')).toBe('a');
    expect(await fs.readFile(path.join(dirB, 'f.txt'), 'utf-8')).toBe('b');
  });

  it('cleans up cache on generator failure', async () => {
    const cachePath = path.join(cacheDir, 'fail');
    let attempt = 0;
    const gen = (dir: string) => Effect.gen(function*() {
      attempt++;
      if (attempt === 1) {
        yield* Effect.fail(new Error('first attempt fails'));
      }
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(path.join(dir, 'success.txt'), 'ok');
      return dir;
    });

    // First attempt should fail and clean up
    await expect(run(withCachedDir(cachePath, gen))).rejects.toThrow('first attempt fails');
    expect(await fs.access(cachePath).then(() => true).catch(() => false)).toBe(false);
    
    // Second attempt should succeed and create cache
    const dir = await run(withCachedDir(cachePath, gen));
    expect(dir).toBe(cachePath);
    expect(await fs.readFile(path.join(dir, 'success.txt'), 'utf-8')).toBe('ok');
  });
});