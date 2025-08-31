import * as PlatformError from '@effect/platform/Error';
import * as FileSystem from '@effect/platform/FileSystem';
import { Data, Effect, Schema } from 'effect';
import * as fs from 'node:fs/promises';

export class FileReadError extends Data.TaggedError('FileReadError')<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Read a file and return its content as a string, or None if it doesn't exist
 */
export const readFileStringOption = (path: string) =>
  FileSystem.FileSystem.pipe(
    Effect.flatMap(fs => fs.readFileString(path)),
    Effect.option,
  );

/**
 * Read and parse a JSON file
 */
export const readFileJson = <T = unknown>(path: string) =>
  FileSystem.FileSystem.pipe(
    Effect.flatMap(fs => fs.readFileString(path)),
    Effect.flatMap(content =>
      Effect.try({
        try: () => JSON.parse(content) as T,
        catch: (error) => new FileReadError({ message: `Failed to parse ${path}: ${error}`, cause: error }),
      })
    ),
  );

/**
 * Read, parse, and validate a JSON file with a schema
 * Returns both the raw JSON string and the parsed/validated data
 */
export const readFileJsonSchema = <A, I>(path: string, schema: Schema.Schema<A, I>) =>
  FileSystem.FileSystem.pipe(
    Effect.flatMap(fs => fs.readFileString(path)),
    Effect.flatMap(raw =>
      Effect.try({
        try: () => JSON.parse(raw),
        catch: (error) => new FileReadError({ message: `Failed to parse ${path}: ${error}`, cause: error }),
      }).pipe(
        Effect.flatMap(Schema.decodeUnknown(schema)),
        Effect.map(parsed => ({ raw, parsed })),
      )
    ),
  );

/**
 * Use a temporary directory for a scoped operation.
 * The directory is automatically removed after use.
 */
export const withTempDirectory = <A, E, R>(
  f: (tempDir: string) => Effect.Effect<A, E, R>,
): Effect.Effect<A, E | PlatformError.PlatformError, R | FileSystem.FileSystem> =>
  Effect.scoped(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem;
      const tempDir = yield* fs.makeTempDirectory({ prefix: 'treant-grammar-' });

      yield* Effect.addFinalizer(() =>
        fs.remove(tempDir, { recursive: true }).pipe(
          Effect.orElse(() => Effect.void),
        )
      );

      return yield* f(tempDir);
    }),
  );

/**
 * Copy a directory recursively to a destination.
 * Uses native Node.js fs.cp (available since v16.7.0).
 */
export const copyDirectory = (src: string, dest: string) =>
  Effect.tryPromise({
    try: () => fs.cp(src, dest, { recursive: true }),
    catch: (error) =>
      new FileReadError({
        message: `Failed to copy ${src} to ${dest}: ${error}`,
        cause: error,
      }),
  });

/**
 * Use a cached directory. If the cache exists, returns the cache path.
 * If not, runs the generator function to populate it.
 *
 * @param cachePath - Full path to the cache directory
 * @param generator - Function that populates a directory and returns its path
 * @returns The path to the cached directory
 */
export const withCachedDir = <E, R>(
  cachePath: string,
  generator: (dir: string) => Effect.Effect<string, E, R>,
): Effect.Effect<string, E | PlatformError.PlatformError, R | FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;

    // Check if cache exists
    const cacheExists = yield* fs.exists(cachePath);

    if (cacheExists) {
      // Return cached directory path
      return cachePath;
    }

    // Create cache directory and run generator
    yield* fs.makeDirectory(cachePath, { recursive: true });

    // Run generator with cleanup on failure
    const result = yield* generator(cachePath).pipe(
      Effect.catchAll((error) =>
        // Clean up the cache directory on failure
        fs.remove(cachePath, { recursive: true }).pipe(
          Effect.flatMap(() => Effect.fail(error)),
        )
      ),
    );

    return result;
  });

/**
 * Write an object as JSON to a file
 */
export const writeJson = (path: string, data: unknown) =>
  FileSystem.FileSystem.pipe(
    Effect.flatMap(fs => fs.writeFileString(path, JSON.stringify(data, null, 2))),
  );

export { readTree } from './read-tree.js';

export * as FileUtils from './$.js';
