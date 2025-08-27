import { Command } from '@effect/cli';
import { Console, Effect } from 'effect';
import { libraryCommand } from './library.js';

export const generateCommand = Command.make('generate', {}, () =>
  Effect.gen(function*() {
    yield* Console.log('Available commands:');
    yield* Console.log('  treant generate library  - Generate TypeScript SDK from grammar');
  })).pipe(Command.withSubcommands([libraryCommand]));
