#!/usr/bin/env tsx

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const exec = (command: string, options?: { capture?: boolean }) => {
  console.log(`\n→ ${command}`);
  if (options?.capture) {
    return execSync(command, { encoding: 'utf8' }).trim();
  }
  execSync(command, { stdio: 'inherit' });
};

const extractChangelogForVersion = (changelogPath: string, version: string): string => {
  try {
    const changelog = readFileSync(changelogPath, 'utf8');
    // Match the version section - handles both ## 1.0.0 and ## 1.0.0 (date)
    const versionRegex = new RegExp(
      `## ${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|\\().*?(?=## \\d|$)`,
      's',
    );
    const match = changelog.match(versionRegex);

    if (match) {
      // Clean up the content - remove the version header line and trim
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
};

const main = async () => {
  console.log('■ Starting release process...\n');

  // Step 1: Build all packages first (fail fast)
  console.log('▶ Building all packages...');
  exec('pnpm build');

  // Step 2: Version packages using changesets
  console.log('\n▶ Applying version changes...');
  exec('pnpm changeset version');

  // Step 3: Commit version changes
  console.log('\n▶ Committing version changes...');
  exec('git add -A');
  exec('git commit -m "chore: version packages"');

  // Step 4: Publish packages and capture output to get tags
  console.log('\n▶ Publishing packages to npm...');
  const publishOutput = exec('pnpm changeset publish', { capture: true });

  // Parse the publish output to find the created tags
  // Changesets outputs lines like: "New tag: @treant/graphql@1.0.0"
  const tagRegex = /New tag:\s+(.*)/g;
  const tags: string[] = [];
  let match;
  while ((match = tagRegex.exec(publishOutput)) !== null) {
    tags.push(match[1]);
  }

  if (tags.length === 0) {
    console.log('\n⚠ No new packages were published');
    return;
  }

  console.log(`\n▶ Created tags: ${tags.join(', ')}`);

  // Step 5: Push commits and tags to GitHub
  console.log('\n▶ Pushing to GitHub...');
  exec('git push --follow-tags');

  // Step 6: Create GitHub releases for each tag
  console.log('\n▶ Creating GitHub releases...');

  for (const tag of tags) {
    // Extract package name and version from tag
    // Tags are like: @treant/graphql@1.0.0 or package-name@1.0.0
    const lastAtIndex = tag.lastIndexOf('@');
    const packageName = tag.substring(0, lastAtIndex);
    const version = tag.substring(lastAtIndex + 1);

    // Determine the package directory
    const packageNameWithoutScope = packageName.replace('@treant/', '');
    const packageDir = join('packages', packageNameWithoutScope);
    const changelogPath = join(packageDir, 'CHANGELOG.md');

    // Extract changelog content for this version
    const changelogContent = extractChangelogForVersion(changelogPath, version);

    // Create GitHub release
    console.log(`\n  Creating release for ${tag}...`);
    try {
      // Write changelog to temp file to avoid shell escaping issues
      const tempFile = `/tmp/release-notes-${Date.now()}.md`;
      require('fs').writeFileSync(tempFile, changelogContent);

      exec(`gh release create "${tag}" --title "${tag}" --notes-file "${tempFile}"`);

      // Clean up temp file
      require('fs').unlinkSync(tempFile);

      console.log(`  ✓ Release created for ${tag}`);
    }
    catch (error) {
      console.error(`  ✗ Failed to create release for ${tag}:`, error);
    }
  }

  console.log('\n✓ Release process complete!');
};

main().catch((error) => {
  console.error('\n✗ Release failed:', error);
  process.exit(1);
});
