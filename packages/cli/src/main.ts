#!/usr/bin/env node

import { Command } from '@effect/cli';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { Effect } from 'effect';
import { mainCommand } from './commands/$.js';

const cli = Command.run(mainCommand, {
  name: 'treant',
  version: '1.0.0',
});

// Run the CLI with NodeContext.layer which provides all required services
NodeRuntime.runMain(
  cli(process.argv).pipe(
    Effect.provide(NodeContext.layer),
    Effect.scoped
  )
);
