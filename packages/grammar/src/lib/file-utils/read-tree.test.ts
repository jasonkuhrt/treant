import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Effect, Layer, Schema } from 'effect';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { readTree } from './read-tree.js';

// Mock FileSystem implementation for testing
const createMockFileSystem = (files: Record<string, string>) => {
  const mockFs = {
    readFileString: (path: string) => {
      if (path in files) {
        return Effect.succeed(files[path]);
      }
      return Effect.fail({
        _tag: 'SystemError' as const,
        reason: 'NotFound',
        module: 'FileSystem',
        method: 'readFileString',
        pathOrDescriptor: path,
      });
    },
    exists: (path: string) => {
      // Check if path exists as file or as directory (prefix match)
      const exists = path in files || Object.keys(files).some(f => f.startsWith(path + '/'));
      return Effect.succeed(exists);
    },
  };

  return Layer.succeed(FileSystem.FileSystem, mockFs as unknown as FileSystem.FileSystem);
};

// Mock Path implementation
const mockPath = {
  join: (...paths: string[]) => paths.join('/'),
  basename: (path: string) => path.split('/').pop() || '',
  dirname: (path: string) => {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '.';
  },
  extname: (path: string) => {
    const base = path.split('/').pop() || '';
    const dotIndex = base.lastIndexOf('.');
    return dotIndex > 0 ? base.slice(dotIndex) : '';
  },
  relative: (from: string, to: string) => to,
  resolve: (...paths: string[]) => paths.join('/'),
  normalize: (path: string) => path,
  isAbsolute: (path: string) => path.startsWith('/'),
  sep: '/',
  toNamespacedPath: (path: string) => path,
  fromFileUrl: (url: URL) => Effect.succeed(url.toString()),
  toFileUrl: (path: string) => Effect.succeed(new URL(`file://${path}`)),
  format: (pathObject: any) => '',
  parse: (path: string) => ({ root: '', dir: '', base: '', ext: '', name: '' }),
  [Path.TypeId]: Symbol.for('@effect/platform/Path'),
} as unknown as Path.Path;

const mockPathLayer = Layer.succeed(Path.Path, mockPath);

describe('readTree', () => {
  describe('value-level behavior', () => {
    it('reads a simple string file', async () => {
      const files = {
        '/test/file.txt': 'hello world',
      };

      const spec = {
        'file.txt': Schema.String,
      } as const;

      const result = await readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      expect(result).toEqual({
        'file.txt': 'hello world',
      });
    });

    it('reads and parses a JSON file with schema', async () => {
      const TestSchema = Schema.Struct({
        name: Schema.String,
        value: Schema.Number,
      });

      const files = {
        '/test/data.json': JSON.stringify({ name: 'test', value: 42 }),
      };

      const spec = {
        'data.json': TestSchema,
      } as const;

      const result = await readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      expect(result).toEqual({
        'data.json': {
          raw: '{"name":"test","value":42}',
          parsed: { name: 'test', value: 42 },
        },
      });
    });

    it('handles optional files with Schema.UndefinedOr', async () => {
      const files = {
        '/test/required.txt': 'required content',
        // optional.txt doesn't exist
      };

      const spec = {
        'required.txt': Schema.String,
        'optional.txt': Schema.UndefinedOr(Schema.String),
      } as const;

      const result = await readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      expect(result).toEqual({
        'required.txt': 'required content',
        'optional.txt': undefined,
      });
    });

    it('handles nested directories', async () => {
      const files = {
        '/test/config.json': '{"key":"value"}',
        '/test/src/index.ts': 'export const x = 1;',
        '/test/src/utils.ts': 'export const y = 2;',
      };

      const spec = {
        'config.json': Schema.Struct({ key: Schema.String }),
        'src': {
          'index.ts': Schema.String,
          'utils.ts': Schema.String,
        },
      } as const;

      const result = await readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      expect(result).toEqual({
        'config.json': {
          raw: '{"key":"value"}',
          parsed: { key: 'value' },
        },
        'src': {
          'index.ts': 'export const x = 1;',
          'utils.ts': 'export const y = 2;',
        },
      });
    });

    it('handles optional directories (all children optional)', async () => {
      const files = {
        '/test/main.txt': 'main content',
        // opt_dir doesn't exist
      };

      const spec = {
        'main.txt': Schema.String,
        'opt_dir': {
          'file1.txt': Schema.UndefinedOr(Schema.String),
          'file2.txt': Schema.UndefinedOr(Schema.String),
        },
      } as const;

      const result = await readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      expect(result).toEqual({
        'main.txt': 'main content',
        'opt_dir': undefined,
      });
    });

    it('handles optional directory with some files present', async () => {
      const files = {
        '/test/opt_dir/file1.txt': 'content1',
        // file2.txt doesn't exist
      };

      const spec = {
        'opt_dir': {
          'file1.txt': Schema.UndefinedOr(Schema.String),
          'file2.txt': Schema.UndefinedOr(Schema.String),
        },
      } as const;

      const result = await readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      expect(result).toEqual({
        'opt_dir': {
          'file1.txt': 'content1',
          'file2.txt': undefined,
        },
      });
    });

    it('validates JSON against schema', async () => {
      const StrictSchema = Schema.Struct({
        required: Schema.String,
      });

      const files = {
        '/test/invalid.json': JSON.stringify({ wrong: 'field' }),
      };

      const spec = {
        'invalid.json': StrictSchema,
      } as const;

      const result = readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      await expect(result).rejects.toThrow(/Schema validation failed/);
    });

    it('handles malformed JSON', async () => {
      const files = {
        '/test/bad.json': 'not valid json',
      };

      const spec = {
        'bad.json': Schema.Struct({ key: Schema.String }),
      } as const;

      const result = readTree('/test', spec).pipe(
        Effect.provide(createMockFileSystem(files)),
        Effect.provide(mockPathLayer),
        Effect.runPromise,
      );

      await expect(result).rejects.toThrow(/Failed to parse JSON/);
    });
  });

  describe('type-level inference', () => {
    it('infers correct types for string files', () => {
      const spec = {
        'file.txt': Schema.String,
      } as const;

      type Result = Effect.Effect.Success<ReturnType<typeof readTree<typeof spec>>>;

      type Expected = {
        'file.txt': string;
      };
      expectTypeOf<Result>().toMatchTypeOf<Expected>();
    });

    it('infers correct types for JSON files', () => {
      const TestSchema = Schema.Struct({
        name: Schema.String,
        count: Schema.Number,
      });

      const spec = {
        'data.json': TestSchema,
      } as const;

      type Result = Effect.Effect.Success<ReturnType<typeof readTree<typeof spec>>>;

      type Expected = {
        'data.json': {
          raw: string;
          parsed: {
            readonly name: string;
            readonly count: number;
          };
        };
      };
      expectTypeOf<Result>().toMatchTypeOf<Expected>();
    });

    it('infers optional properties correctly', () => {
      const spec = {
        'required.txt': Schema.String,
        'optional.txt': Schema.UndefinedOr(Schema.String),
        'optional.json': Schema.UndefinedOr(Schema.Struct({ key: Schema.String })),
      } as const;

      type Result = Effect.Effect.Success<ReturnType<typeof readTree<typeof spec>>>;

      type Expected = {
        'required.txt': string;
        'optional.txt': string | undefined;
        'optional.json': {
          raw: string;
          parsed: {
            readonly key: string;
          };
        } | undefined;
      };
      expectTypeOf<Result>().toMatchTypeOf<Expected>();
    });

    it('infers nested directory types', () => {
      const spec = {
        'config.json': Schema.Struct({ enabled: Schema.Boolean }),
        'src': {
          'main.ts': Schema.String,
          'test.ts': Schema.UndefinedOr(Schema.String),
        },
      } as const;

      type Result = Effect.Effect.Success<ReturnType<typeof readTree<typeof spec>>>;

      type Expected = {
        'config.json': {
          raw: string;
          parsed: {
            readonly enabled: boolean;
          };
        };
        'src': {
          'main.ts': string;
          'test.ts': string | undefined;
        };
      };
      expectTypeOf<Result>().toMatchTypeOf<Expected>();
    });

    it('infers optional directory types (all children optional)', () => {
      const spec = {
        'main.txt': Schema.String,
        'opt_dir': {
          'a.txt': Schema.UndefinedOr(Schema.String),
          'b.txt': Schema.UndefinedOr(Schema.String),
        },
      } as const;

      type Result = Effect.Effect.Success<ReturnType<typeof readTree<typeof spec>>>;

      type Expected = {
        'main.txt': string;
        'opt_dir': {
          'a.txt': string | undefined;
          'b.txt': string | undefined;
        } | undefined;
      };
      expectTypeOf<Result>().toMatchTypeOf<Expected>();
    });

    it('correctly types complex nested structures', () => {
      const spec = {
        'package.json': Schema.Struct({
          name: Schema.String,
          version: Schema.String,
        }),
        'src': {
          'index.ts': Schema.String,
          'config': {
            'dev.json': Schema.UndefinedOr(Schema.Struct({ debug: Schema.Boolean })),
            'prod.json': Schema.UndefinedOr(Schema.Struct({ debug: Schema.Boolean })),
          },
        },
        'tests': {
          'unit.test.ts': Schema.UndefinedOr(Schema.String),
          'integration.test.ts': Schema.UndefinedOr(Schema.String),
        },
      } as const;

      type Result = Effect.Effect.Success<ReturnType<typeof readTree<typeof spec>>>;

      type Expected = {
        'package.json': {
          raw: string;
          parsed: {
            readonly name: string;
            readonly version: string;
          };
        };
        'src': {
          'index.ts': string;
          'config': {
            'dev.json': {
              raw: string;
              parsed: {
                readonly debug: boolean;
              };
            } | undefined;
            'prod.json': {
              raw: string;
              parsed: {
                readonly debug: boolean;
              };
            } | undefined;
          } | undefined;
        };
        'tests': {
          'unit.test.ts': string | undefined;
          'integration.test.ts': string | undefined;
        } | undefined;
      };
      expectTypeOf<Result>().toMatchTypeOf<Expected>();
    });
  });
});
