import { Command, Options as Os } from '@effect/cli';
import { GeneratorSDK } from '@treant/generator-sdk';
import { Core } from '@treant/core';
import { Console, Effect, Option, Schema } from 'effect';
import { promptPathOrLiteral } from '../../lib/prompt-path-or-literal.js';

export const libraryCommand = Command.make('library', {
  grammar: Os.text('grammar').pipe(
    Os.withAlias('g'),
    Os.withDescription('Grammar name (e.g., "graphql") or directory path with grammar.json and node-types.json'),
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
    let grammarInputRaw = Option.getOrElse(args.grammar, () => '');

    // If no grammar specified, show interactive select
    if (!grammarInputRaw) {
      grammarInputRaw = yield* promptPathOrLiteral(Core.FirstPartyGrammars.GrammarInputSchema, {
        selectMessage: 'Select a bundled grammar or choose custom:',
        textMessage: 'Enter the path to your grammar directory:',
        descriptionTransform: (literal) => `Use bundled ${literal} grammar`,
        pathOption: {
          description: 'Specify a directory path with grammar.json and node-types.json',
        },
      });
    }

    yield* Console.log(`Generating library for grammar: ${grammarInputRaw}`);

    // Parse the grammar input
    const grammarInput = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(Core.FirstPartyGrammars.GrammarInputSchema)(grammarInputRaw),
      catch: (error) => new Error(`Invalid grammar input: ${error}`),
    });

    // Resolve grammar paths
    const { grammarPath, nodeTypesPath, nameOverride } = yield* Core.FirstPartyGrammars.resolveGrammarPaths(grammarInput);

    // Generate the SDK
    yield* GeneratorSDK.generate({
      grammarPath,
      nodeTypesPath,
      outputDir: args.output,
      nameOverride: Option.getOrUndefined(args.name) || nameOverride,
    });

    yield* Console.log(`SDK generated successfully in ${args.output}`);
  }));
