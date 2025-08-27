#!/usr/bin/env node

import { Command, Options as Os, Prompt } from '@effect/cli';
import { Path } from '@effect/platform';
import { NodeContext, NodeFileSystem, NodeRuntime, NodeTerminal } from '@effect/platform-node';
import { Console, Effect, Option, Schema } from 'effect';
import {
  FirstPartyGrammar,
  GrammarInputSchema,
  resolveGrammarPaths,
} from './first-party-grammars.js';
import { generate } from './generator.js';

// Main command
const main = Command.make('treant', {
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
    const nameOverride = Option.getOrUndefined(args.name);
    const path = yield* Path.Path;
    const outputDir = path.resolve(args.output);

    // If no grammar specified, show interactive select
    if (!grammarInputRaw) {
      const selectedGrammar = yield* Prompt.select({
        message: 'Select a bundled grammar or choose custom:',
        choices: [
          ...FirstPartyGrammar.literals.map(grammar => ({
            title: grammar === 'graphql' ? 'GraphQL' : grammar,
            value: grammar,
            description: `Use bundled ${grammar === 'graphql' ? 'GraphQL' : grammar} grammar`,
          })),
          {
            title: 'Custom (specify path)',
            value: 'custom',
            description: 'Specify a directory path with grammar.json and node-types.json',
          },
        ],
      });

      if (selectedGrammar === 'custom') {
        grammarInputRaw = yield* Prompt.text({
          message: 'Enter the path to your grammar directory:',
          validate: (input) => {
            if (!input.startsWith('./') && !input.startsWith('../') && !input.startsWith('/')) {
              return Effect.fail('Path must start with ./, ../, or /');
            }
            return Effect.succeed(input);
          },
        });
      } else {
        grammarInputRaw = selectedGrammar;
      }
    }

    // Validate and parse the grammar input
    const grammarInput = yield* Schema.decodeUnknown(GrammarInputSchema)(grammarInputRaw).pipe(
      Effect.mapError((error) => {
        // Extract the meaningful part of the schema validation error
        const message = error.message || error.toString();
        const expectedMessage = message.match(/Expected a directory path.*or one of: .*/)?.[0] 
          || `Invalid grammar input: "${grammarInputRaw}"`;
        return new Error(expectedMessage);
      }),
    );

    // Resolve grammar paths
    const resolved = yield* resolveGrammarPaths(grammarInput);

    const grammarName = nameOverride || resolved.nameOverride || 
      (grammarInput._tag === 'literal' ? grammarInput.value : path.basename(grammarInput.value));
    
    yield* Console.log(`Generating ${grammarName} SDK...`);

    // Call the generator
    yield* generate({
      grammarPath: resolved.grammarPath,
      nodeTypesPath: resolved.nodeTypesPath,
      outputDir,
      nameOverride: nameOverride || resolved.nameOverride,
    });

    yield* Console.log('✅ Done');
  }).pipe(
    Effect.provide(NodeFileSystem.layer),
  ));

// Create and run CLI
const program = Command.run(main, {
  name: 'treant',
  version: '1.0.0',
});

NodeRuntime.runMain(
  program(process.argv).pipe(
    Effect.provide(NodeContext.layer),
    Effect.tapError((error) => {
      // Format and display error message without stack trace
      const message = error instanceof Error ? error.message : String(error);
      return Console.error(`❌ ${message}`);
    }),
  ),
  {
    disableErrorReporting: true, // Suppress default error reporting with stack traces
  },
);
