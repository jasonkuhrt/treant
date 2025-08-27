import { Command } from '@effect/cli';
import { Console, Effect } from 'effect';
import { generateCommand } from './generate/$.js';

export const mainCommand = Command.make('treant', {}, () =>
  Effect.gen(function*() {
    yield* Console.log('Treant CLI - Tree-sitter tools');
    yield* Console.log('Use "treant generate library" to generate TypeScript SDKs');
  })).pipe(Command.withSubcommands([generateCommand]));
