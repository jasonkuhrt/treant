# Treant

A TypeScript-first toolkit for working with Tree-sitter grammars. Generate type-safe SDKs from any Tree-sitter grammar with full IDE support (via TypeScript typings).

## Packages

| Package                                   | Version                                                                                                       | Description                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`@treant/graphql`](packages/graphql)     | [![npm](https://img.shields.io/npm/v/@treant/graphql.svg)](https://www.npmjs.com/package/@treant/graphql)     | Complete GraphQL parser with TypeScript SDK |
| [`@treant/cli`](packages/cli)             | [![npm](https://img.shields.io/npm/v/@treant/cli.svg)](https://www.npmjs.com/package/@treant/cli)             | CLI for generating SDKs from grammars       |
| [`@treant/generator`](packages/generator) | [![npm](https://img.shields.io/npm/v/@treant/generator.svg)](https://www.npmjs.com/package/@treant/generator) | SDK generator for Tree-sitter grammars      |
| [`@treant/grammar`](packages/grammar)     | [![npm](https://img.shields.io/npm/v/@treant/grammar.svg)](https://www.npmjs.com/package/@treant/grammar)     | TypeScript types for Tree-sitter grammars   |
| [`@treant/core`](packages/core)           | [![npm](https://img.shields.io/npm/v/@treant/core.svg)](https://www.npmjs.com/package/@treant/core)           | Core utilities                              |

### GraphQL-specific

| Package                                               | Version                                                                                                                   | Description                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [`@treant/graphql-sdk`](packages/graphql-sdk)         | [![npm](https://img.shields.io/npm/v/@treant/graphql-sdk.svg)](https://www.npmjs.com/package/@treant/graphql-sdk)         | Generated TypeScript SDK for GraphQL |
| [`@treant/graphql-grammar`](packages/graphql-grammar) | [![npm](https://img.shields.io/npm/v/@treant/graphql-grammar.svg)](https://www.npmjs.com/package/@treant/graphql-grammar) | GraphQL grammar assets (WASM, JSON)  |

## Development

This is a monorepo managed with pnpm and Turbo.

### Release Process

We use [changesets](https://github.com/changesets/changesets) for managing releases.

#### Creating a Release

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
   pnpm ship:release
   ```
   This will:
   - Build all packages (fails fast if broken)
   - Apply version bumps from changesets
   - Update CHANGELOG.md files
   - Publish to npm
   - Create git tags
   - Push to GitHub
   - Create GitHub releases with changelogs

3. **GitHub releases only** (if needed):
   ```bash
   pnpm ship:release:github
   ```

#### Notes

- No changesets are needed during development, just when releasing
- Each package gets its own version, git tag, and GitHub release
- The process respects workspace dependencies and cascades updates automatically
