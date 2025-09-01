import { Command } from '@effect/cli';
import { Console, Effect } from 'effect';
import { grammarCommand } from './grammar.js';
import { libraryCommand } from './library.js';
import { unifiedGenerateCommand } from './unified.js';

// Default generate command shows available options
const defaultGenerateCommand = Command.make('generate', {}, () =>
  Effect.gen(function*() {
    yield* Console.log('Available commands:');
    yield* Console.log('  treant generate all      - Generate both grammar and SDK (with caching)');
    yield* Console.log('  treant generate grammar  - Generate grammar artifacts only');
    yield* Console.log('  treant generate library  - Generate TypeScript SDK only');
  })
);

// Export with all subcommands
export const generateCommand = defaultGenerateCommand.pipe(
  Command.withSubcommands([unifiedGenerateCommand, grammarCommand, libraryCommand])
);
