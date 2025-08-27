import { Prompt } from '@effect/cli';
import { Terminal } from '@effect/platform';
import { QuitException } from '@effect/platform/Terminal';
import type { Core } from '@treant/core';
import { Effect } from 'effect';

/**
 * Complete interactive prompt for PathOrLiteral schemas
 * Handles both literal selection and custom path input
 */
export function promptPathOrLiteral<const Literals extends readonly [string, ...string[]]>(
  schema: Core.PathOrLiteral<Literals>,
  config: {
    selectMessage: string;
    textMessage: string;
    descriptionTransform: (literal: Literals[number]) => string;
    pathOption?: {
      title?: string;
      description?: string;
    };
  },
): Effect.Effect<string, QuitException, Terminal.Terminal> {
  const literals = schema.from.members[0].literals;

  return Effect.gen(function*() {
    const selected = yield* Prompt.select({
      message: config.selectMessage,
      choices: [
        ...literals.map((literal: Literals[number]) => ({
          title: literal,
          value: literal as string,
          description: config.descriptionTransform(literal),
        })),
        {
          title: config.pathOption?.title ?? 'Custom (specify path)',
          value: 'custom' as string,
          description: config.pathOption?.description ?? 'Specify a custom directory path',
        },
      ],
    });

    if (selected === 'custom') {
      return yield* Prompt.text({
        message: config.textMessage,
        validate: (input) => {
          if (!input.startsWith('./') && !input.startsWith('../') && !input.startsWith('/')) {
            return Effect.fail('Path must start with ./, ../, or /');
          }
          return Effect.succeed(input);
        },
      });
    }

    return selected;
  });
}
