import { Schema } from 'effect';

export type PathOrLiteral<$Literals extends readonly [string, ...string[]]> = ReturnType<
  typeof PathOrLiteral<$Literals>
>;

/**
 * Tagged union for path or literal values
 */
export const PathOrLiteral = <const Literals extends readonly [string, ...string[]]>(
  literals: Literals,
) => {
  // Define the path schema with clear error message
  const PathSchema = Schema.String.pipe(
    Schema.filter((s): s is string => s.startsWith('./') || s.startsWith('../') || s.startsWith('/'), {
      message: () => `Expected a directory path (starting with ./, ../, or /) or one of: ${literals.join(', ')}`,
    }),
  );

  // Create a union that tries literals first, then path
  const InputSchema = Schema.Union(
    Schema.Literal(...literals),
    PathSchema,
  ).annotations({
    message: () =>
      `Expected either a bundled grammar name (${
        literals.join(', ')
      }) or a directory path (starting with ./, ../, or /)`,
  });

  // Transform to tagged union
  return Schema.transform(
    InputSchema,
    Schema.Union(
      Schema.TaggedStruct('path', { value: PathSchema }),
      Schema.TaggedStruct('literal', { value: Schema.Literal(...literals) }),
    ),
    {
      decode: (input) => {
        if (input.startsWith('./') || input.startsWith('../') || input.startsWith('/')) {
          return { _tag: 'path' as const, value: input };
        }
        return { _tag: 'literal' as const, value: input as Literals[number] };
      },
      encode: (value) => value.value,
    },
  );
};

/**
 * Type helper to extract the type from PathOrLiteral schema
 */
export type PathOrLiteralType<Literals extends readonly [string, ...string[]]> =
  | { _tag: 'path'; value: string }
  | { _tag: 'literal'; value: Literals[number] };
