import { Command } from '@effect/cli';
import { Console, Effect } from 'effect';
import { generateCommand } from './generate/$.js';

export const mainCommand = Command.make('treant', {}, () =>
  Effect.gen(function*() {
    yield* Console.log('Treant CLI - Tree-sitter tools');
    yield* Console.log('Use "treant generate" to generate both grammar and SDK');
    yield* Console.log('Use "treant generate grammar" or "treant generate library" for specific tasks');
  })).pipe(Command.withSubcommands([generateCommand]));
