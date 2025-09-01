import { Command, Options as Os } from '@effect/cli';
import { Generator } from '@treant/generator';
import { Core } from '@treant/core';
import { Console, Effect, Option } from 'effect';

export const libraryCommand = Command.make('library', {
  grammar: Os.text('grammar').pipe(
    Os.withAlias('g'),
    Os.withDescription('Path to directory containing grammar.json and node-types.json (e.g., "./my-grammar/src")'),
    Os.optional,
  ),
  name: Os.text('name').pipe(
    Os.withAlias('n'),
    Os.withDescription('Display name override (e.g., "GraphQL")'),
    Os.optional,
  ),
  output: Os.text('output').pipe(
    Os.withAlias('o'),
    Os.withDescription('Output directory for generated SDK'),
    Os.withDefault('src-generated'),
  ),
}, (args) =>
  Effect.gen(function*() {
    let grammarPath = Option.getOrElse(args.grammar, () => '');

    // If no grammar specified, prompt for path
    if (!grammarPath) {
      yield* Console.log('Please specify a grammar directory path using --grammar');
      return yield* Effect.fail(new Error('Grammar path is required'));
    }

    yield* Console.log(`Generating library for grammar: ${grammarPath}`);

    // Validate grammar paths exist
    yield* Core.FirstPartyGrammars.resolveGrammarPaths(grammarPath);

    // Load the complete grammar using the helper
    const grammar = yield* Effect.promise(() => Generator.loadGrammar(grammarPath));

    // Generate the SDK
    const nameOverrideOption = Option.getOrUndefined(args.name);
    const sdk = yield* Effect.promise(() => Generator.generate({
      grammar,
      ...(nameOverrideOption ? { nameOverride: nameOverrideOption } : {}),
    }));

    // Emit the SDK files
    yield* Effect.promise(() => Generator.emit(sdk, args.output));

    yield* Console.log(`SDK generated successfully in ${args.output}`);
  }));