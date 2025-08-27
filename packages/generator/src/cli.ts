#!/usr/bin/env node

import { Command, Options as Os } from '@effect/cli';
import { NodeContext, NodeFileSystem, NodePath, NodeRuntime, NodeTerminal } from '@effect/platform-node';
import { Console, Effect, Layer, Option } from 'effect';
import {
  GrammarInputSchema,
} from './first-party-grammars.js';
import { promptForPathOrLiteral } from './lib/path-or-literal.js';

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

    // If no grammar specified, show interactive select
    if (!grammarInputRaw) {
      grammarInputRaw = yield* promptForPathOrLiteral(GrammarInputSchema, {
        selectMessage: 'Select a bundled grammar or choose custom:',
        textMessage: 'Enter the path to your grammar directory:',
        descriptionTransform: (literal) => `Use bundled ${literal} grammar`,
        pathOption: {
          description: 'Specify a directory path with grammar.json and node-types.json',
        },
      });
    }

    yield* Console.log(`Grammar input: ${grammarInputRaw}`);
  }));

// Create and run CLI
const program = Command.run(main, {
  name: 'treant',
  version: '1.0.0',
});

NodeRuntime.runMain(
  program(process.argv).pipe(
    Effect.provide(
      Layer.mergeAll(
        NodeContext.layer,
        NodeTerminal.layer,
        NodeFileSystem.layer,
        NodePath.layer,
      ),
    ),
    Effect.scoped,
  ),
);
