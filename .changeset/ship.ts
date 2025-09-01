#!/usr/bin/env tsx

import { Command, Options } from '@effect/cli';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { Console, Effect, pipe } from 'effect';
import { execSync } from 'node:child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Shell execution service
class ShellError {
  readonly _tag = 'ShellError';
  constructor(readonly message: string, readonly command: string) {}
}

const exec = (command: string, options?: { capture?: boolean }) =>
  Effect.sync(() => {
    Console.log(`→ ${command}`).pipe(Effect.runSync);
    if (options?.capture) {
      return execSync(command, { encoding: 'utf8' }).trim();
    }
    execSync(command, { stdio: 'inherit' });
    return '';
  }).pipe(
    Effect.mapError((error) => new ShellError(String(error), command)),
  );

// Changelog extraction
const extractChangelogForVersion = (changelogPath: string, version: string) =>
  Effect.sync(() => {
    try {
      const changelog = readFileSync(changelogPath, 'utf8');
      const versionRegex = new RegExp(
        `## ${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|\\().*?(?=## \\d|$)`,
        's',
      );
      const match = changelog.match(versionRegex);

      if (match) {
        const content = match[0]
          .replace(/^## .*$/m, '')
          .trim();
        return content || 'Release notes not available';
      }
      return 'Release notes not available';
    }
    catch {
      return 'Release notes not available';
    }
  });

// Parse tag into package name and version
const parseTag = (tag: string) => {
  const lastAtIndex = tag.lastIndexOf('@');
  return {
    packageName: tag.substring(0, lastAtIndex),
    version: tag.substring(lastAtIndex + 1),
  };
};

// Create GitHub release for a tag
const createGitHubRelease = (tag: string) =>
  Effect.gen(function*() {
    const { packageName, version } = parseTag(tag);
    const packageNameWithoutScope = packageName.replace('@treant/', '');
    const packageDir = join('packages', packageNameWithoutScope);
    const changelogPath = join(packageDir, 'CHANGELOG.md');

    const changelogContent = yield* extractChangelogForVersion(changelogPath, version);

    yield* Console.log(`  Creating release for ${tag}...`);

    const tempFile = `/tmp/release-notes-${Date.now()}.md`;

    yield* Effect.try({
      try: () => {
        writeFileSync(tempFile, changelogContent);
        execSync(`gh release create "${tag}" --title "${tag}" --notes-file "${tempFile}"`, { stdio: 'inherit' });
        unlinkSync(tempFile);
        return Console.log(`  ✓ Release created for ${tag}`);
      },
      catch: (error) => {
        try {
          unlinkSync(tempFile);
        }
        catch {}
        return Console.error(`  ✗ Failed to create release for ${tag}: ${error}`);
      },
    }).pipe(Effect.flatten);
  });

// GitHub-only release flow
const createGitHubReleasesOnly = Effect.gen(function*() {
  yield* Console.log('■ Creating GitHub releases for existing tags...\n');

  const tagsOutput = yield* exec('git tag -l "*@*"', { capture: true });

  if (!tagsOutput) {
    yield* Console.log('No package tags found');
    return;
  }

  const tags = tagsOutput.split('\n').filter(Boolean);
  yield* Console.log(`Found ${tags.length} package tags`);

  const existingReleases = yield* exec('gh release list --limit 100', { capture: true });

  for (const tag of tags) {
    if (existingReleases.includes(tag)) {
      yield* Console.log(`  ✓ Release already exists for ${tag}`);
      continue;
    }
    yield* createGitHubRelease(tag);
  }

  yield* Console.log('\n✓ GitHub releases created!');
});

// Full release flow
const fullRelease = Effect.gen(function*() {
  yield* Console.log('■ Starting release process...\n');

  // Step 1: Build
  yield* Console.log('▶ Building all packages...');
  yield* exec('pnpm build');

  // Step 2: Version
  yield* Console.log('\n▶ Applying version changes...');
  yield* exec('pnpm changeset version');

  // Step 3: Commit
  yield* Console.log('\n▶ Committing version changes...');
  yield* exec('git add -A');
  yield* exec('git commit -m "chore: version packages"');

  // Step 4: Publish
  yield* Console.log('\n▶ Publishing packages to npm...');
  const publishOutput = yield* exec('pnpm changeset publish', { capture: true });

  // Parse tags from output
  const tagRegex = /New tag:\s+(.*)/g;
  const tags: string[] = [];
  let match;
  while ((match = tagRegex.exec(publishOutput)) !== null) {
    tags.push(match[1]);
  }

  if (tags.length === 0) {
    yield* Console.log('\n⚠ No new packages were published');
    return;
  }

  yield* Console.log(`\n▶ Created tags: ${tags.join(', ')}`);

  // Step 5: Push
  yield* Console.log('\n▶ Pushing to GitHub...');
  yield* exec('git push --follow-tags');

  // Step 6: Create releases
  yield* Console.log('\n▶ Creating GitHub releases...');
  yield* Effect.forEach(tags, createGitHubRelease, { concurrency: 'unbounded' });

  yield* Console.log('\n✓ Release process complete!');
});

// CLI command
const shipCommand = Command.make('ship', {
  githubOnly: Options.boolean('github-only').pipe(
    Options.withAlias('g'),
    Options.withDescription('Only create GitHub releases for existing tags'),
    Options.withDefault(false),
  ),
}, ({ githubOnly }) => githubOnly ? createGitHubReleasesOnly : fullRelease);

// Main CLI app
const cli = Command.run(shipCommand, {
  name: 'ship',
  version: '1.0.0',
});

// Run the CLI
pipe(
  cli(process.argv.slice(2)),
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain,
);
