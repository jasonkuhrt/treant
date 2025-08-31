import * as FileSystem from '@effect/platform/FileSystem';
import * as Path from '@effect/platform/Path';
import { Effect, Schema } from 'effect';
import { FileReadError } from './$.js';

// Helper type to check if a schema is T | undefined
type IsUndefinedOrSchema<S> = S extends Schema.Schema<infer A, any> 
  ? undefined extends A ? true : false
  : false;

function isUndefinedOrSchema(schema: any): boolean {
  // Check if it's Schema.UndefinedOr (creates a Union with undefined)
  if (!Schema.isSchema(schema)) return false;

  // Schema.UndefinedOr creates a Union AST with undefined
  const ast = schema.ast;
  if (ast && ast._tag === 'Union') {
    // Check if one of the union members is undefined
    return ast.types.some((t: any) => t._tag === 'UndefinedKeyword');
  }
  return false;
}

// Extract the inner type from T | undefined
type UnwrapUndefinedOrSchema<S> = S extends Schema.Schema<infer A, any>
  ? Exclude<A, undefined> extends never ? never : Exclude<A, undefined>
  : never;

// Check if a schema is for a string type
type IsStringSchema<S> = S extends typeof Schema.String ? true : false;

// Infer the result type from a schema spec
type InferTreeResult<Spec> = 
  Spec extends Schema.Schema<any, any>
    ? IsUndefinedOrSchema<Spec> extends true
      ? UnwrapUndefinedOrSchema<Spec> extends string
        ? string | undefined  // Optional string
        : { raw: string; parsed: UnwrapUndefinedOrSchema<Spec> } | undefined  // Optional JSON
      : IsStringSchema<Spec> extends true
        ? string  // Required string
        : Spec extends Schema.Schema<infer A, any>
          ? { raw: string; parsed: A }  // Required JSON
          : never
    : Spec extends Record<string, any>
      ? AllOptional<Spec> extends true
        ? { [K in keyof Spec]: InferTreeResult<Spec[K]> } | undefined  // Optional directory
        : { [K in keyof Spec]: InferTreeResult<Spec[K]> }  // Required directory
      : never;

// Check if all properties in an object are optional schemas
type AllOptional<T> = T extends Record<string, any>
  ? { [K in keyof T]: IsUndefinedOrSchema<T[K]> }[keyof T] extends true
    ? true
    : false
  : false;

/**
 * Read a tree of files according to a schema specification.
 *
 * @param rootDir - The root directory to read from
 * @param spec - The schema specification for the file tree
 * @returns A structured result matching the input specification shape
 *
 * @example
 * const result = yield* readTree('/path/to/dir', {
 *   'grammar.json': GrammarJsonSchema,
 *   'node-types.json': NodeTypesSchema,
 *   'parser.c': Schema.String,
 *   'tree_sitter': {
 *     'parser.h': Schema.UndefinedOr(Schema.String),
 *     'alloc.h': Schema.UndefinedOr(Schema.String),
 *     'array.h': Schema.UndefinedOr(Schema.String),
 *   }
 * });
 */
export function readTree<const Spec>(
  rootDir: string,
  spec: Spec,
): Effect.Effect<InferTreeResult<Spec>, FileReadError, FileSystem.FileSystem | Path.Path> {
  return Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    function getInnerSchema(undefinedOrSchema: any): any {
      // For Schema.UndefinedOr, extract the non-undefined type from the union
      const ast = undefinedOrSchema.ast;
      if (ast && ast._tag === 'Union') {
        // Find the non-undefined type
        const nonUndefinedType = ast.types.find((t: any) => t._tag !== 'UndefinedKeyword');
        if (nonUndefinedType) {
          return Schema.make(nonUndefinedType);
        }
      }
      return Schema.String; // fallback
    }

    function isAllOptional(spec: Record<string, any>): boolean {
      return Object.values(spec).every(value => {
        if (Schema.isSchema(value)) {
          return isUndefinedOrSchema(value);
        }
        // If it's a nested object, check recursively
        return typeof value === 'object' && isAllOptional(value);
      });
    }

    function readSpec(dir: string, spec: any): Effect.Effect<any, FileReadError, FileSystem.FileSystem | Path.Path> {
      // If it's a schema, read the file
      if (Schema.isSchema(spec)) {
        const filePath = dir;
        const isOptional = isUndefinedOrSchema(spec);
        const innerSchema = isOptional ? getInnerSchema(spec) : spec;
        const isStringSchema = innerSchema === Schema.String
          || (innerSchema.ast && innerSchema.ast._tag === 'StringKeyword');

        if (isStringSchema) {
          // Plain string file
          if (isOptional) {
            return fs.readFileString(filePath).pipe(
              Effect.catchTag('SystemError', () => Effect.succeed(undefined)),
              Effect.orElse(() => Effect.succeed(undefined)),
            );
          }
          else {
            return fs.readFileString(filePath).pipe(
              Effect.mapError(error =>
                new FileReadError({
                  message: `Failed to read ${filePath}: ${error}`,
                  cause: error,
                })
              ),
            );
          }
        }
        else {
          // JSON file - needs parsing
          if (isOptional) {
            return Effect.gen(function*(_) {
              const exists = yield* fs.exists(filePath).pipe(
                Effect.orElseSucceed(() => false),
              );

              if (!exists) {
                return undefined;
              }

              const raw = yield* fs.readFileString(filePath).pipe(
                Effect.mapError(error =>
                  new FileReadError({
                    message: `Failed to read ${filePath}: ${error}`,
                    cause: error,
                  })
                ),
              );

              const parsed = yield* Effect.try({
                try: () => JSON.parse(raw),
                catch: error =>
                  new FileReadError({
                    message: `Failed to parse JSON in ${filePath}: ${error}`,
                    cause: error,
                  }),
              }).pipe(
                Effect.flatMap(json =>
                  Effect.mapError(
                    Schema.decodeUnknown(innerSchema)(json),
                    error =>
                      new FileReadError({
                        message: `Schema validation failed for ${filePath}: ${error}`,
                        cause: error,
                      }),
                  )
                ),
              );

              return { raw, parsed };
            }) as Effect.Effect<any, FileReadError, FileSystem.FileSystem | Path.Path>;
          }
          else {
            return Effect.gen(function*(_) {
              const raw = yield* fs.readFileString(filePath).pipe(
                Effect.mapError(error =>
                  new FileReadError({
                    message: `Failed to read ${filePath}: ${error}`,
                    cause: error,
                  })
                ),
              );

              const parsed = yield* Effect.try({
                try: () => JSON.parse(raw),
                catch: error =>
                  new FileReadError({
                    message: `Failed to parse JSON in ${filePath}: ${error}`,
                    cause: error,
                  }),
              }).pipe(
                Effect.flatMap(json =>
                  Effect.mapError(
                    Schema.decodeUnknown(innerSchema)(json),
                    error =>
                      new FileReadError({
                        message: `Schema validation failed for ${filePath}: ${error}`,
                        cause: error,
                      }),
                  )
                ),
              );

              return { raw, parsed };
            }) as Effect.Effect<any, FileReadError, FileSystem.FileSystem | Path.Path>;
          }
        }
      }

      // It's a nested object spec
      const entries = Object.entries(spec as Record<string, any>);
      const isDirOptional = isAllOptional(spec as Record<string, any>);

      if (isDirOptional) {
        // Check if directory exists first
        return Effect.gen(function*() {
          const exists = yield* fs.exists(dir).pipe(
            Effect.orElseSucceed(() => false),
          );

          if (!exists) {
            return undefined;
          }

          // Read all entries in parallel
          const results = yield* Effect.all(
            entries.map(([key, childSpec]) =>
              readSpec(path.join(dir, key), childSpec).pipe(
                Effect.map(value => [key, value] as const),
              )
            ),
          );

          return Object.fromEntries(results);
        });
      }
      else {
        // Read all entries in parallel
        return Effect.gen(function*() {
          const results = yield* Effect.all(
            entries.map(([key, childSpec]) =>
              readSpec(path.join(dir, key), childSpec).pipe(
                Effect.map(value => [key, value] as const),
              )
            ),
          );

          return Object.fromEntries(results);
        });
      }
    }

    return yield* readSpec(rootDir, spec);
  }) as any;
}