# Treant

A set of tree-sitter packages oriented around optimal type safety and ease of use.

| Package                                               | Description                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| [`@treant/cli`](packages/cli)                         | Command-line interface for Treant tools                         |
| [`@treant/core`](packages/core)                       | Core utilities shared across Treant packages                    |
| [`@treant/generator`](packages/generator)             | TypeScript SDK generator for tree-sitter grammars               |
| [`@treant/grammar`](packages/grammar)                 | Grammar type definitions and functions to navigate grammar data |
| [`@treant/graphql`](packages/graphql)                 | GraphQL high level package wrapping all others                  |
| [`@treant/graphql-sdk`](packages/graphql-sdk)         | GraphQL SDK (generated)                                         |
| [`@treant/graphql-grammar`](packages/graphql-grammar) | GraphQL grammar definition and WASM parser                      |

## Release Process

This monorepo uses [changesets](https://github.com/changesets/changesets) for managing releases.

### Creating a Release

1. **Stage changes**: When you have changes ready to release, run:
   ```bash
   pnpm ship:stage
   ```
   This opens an interactive prompt where you can:
   - Select which packages to release
   - Choose version bumps (patch/minor/major)
   - Add a summary of changes
   - Dependencies will automatically cascade (e.g., if `@treant/graphql-sdk` updates, `@treant/graphql` will also be bumped)

2. **Ship the release**: When ready to publish, run:
   ```bash
   pnpm ship
   ```
   This will:
   - Build all packages (fails fast if broken)
   - Apply version bumps from changesets
   - Update CHANGELOG.md files
   - Publish to npm
   - Create git tags
   - Push to GitHub
   - Create GitHub releases with changelogs

### Notes

- No changesets are needed during development, just when releasing
- Each package gets its own version, git tag, and GitHub release
- The process respects workspace dependencies and cascades updates automatically
