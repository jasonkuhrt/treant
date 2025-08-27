#!/usr/bin/env node

import { Command } from '@effect/cli';
import { NodeContext, NodeFileSystem, NodePath, NodeRuntime, NodeTerminal } from '@effect/platform-node';
import { Effect, Layer } from 'effect';
import { mainCommand } from './commands/$.js';

const main = Command.run(mainCommand, {
  name: 'treant',
  version: '1.0.0',
})(process.argv).pipe(
  Effect.provide(
    Layer.mergeAll(
      NodeContext.layer,
      NodeTerminal.layer,
      NodeFileSystem.layer,
      NodePath.layer,
    ),
  ),
  Effect.scoped,
);

NodeRuntime.runMain(main);
