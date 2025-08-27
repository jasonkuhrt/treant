import { FileSystem, Path } from '@effect/platform';
import { Effect, Match, Schema } from 'effect';
import { toPascalCase } from './lib/case.js';
import { loadPackageJson } from './lib/package-utils.js';
import { PathOrLiteral, type PathOrLiteralType } from './lib/path-or-literal.js';

export const FirstPartyGrammar = Schema.Literal('graphql');

export type FirstPartyGrammar = Schema.Schema.Type<typeof FirstPartyGrammar>;

export const GrammarInputSchema = PathOrLiteral(FirstPartyGrammar.literals);

export const isFirstPartyGrammar = Schema.is(FirstPartyGrammar);

export type GrammarInput = PathOrLiteralType<typeof FirstPartyGrammar.literals>;

// Helper to resolve grammar from name or directory path
export const resolveGrammarPaths = (grammarInput: GrammarInput) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    switch (grammarInput._tag) {
      case 'path': {
        // Directory path provided - use conventional layout
        const grammarDir = path.resolve(grammarInput.value);
        const grammarPath = path.join(grammarDir, 'grammar.json');
        const nodeTypesPath = path.join(grammarDir, 'node-types.json');

        // Check if files exist
        const grammarExists = yield* fs.exists(grammarPath);
        const nodeTypesExists = yield* fs.exists(nodeTypesPath);

        return yield* Match.value({ grammarExists, nodeTypesExists }).pipe(
          Match.when({ grammarExists: true, nodeTypesExists: true }, () =>
            Effect.succeed({
              grammarPath,
              nodeTypesPath,
              nameOverride: undefined,
            })),
          Match.orElse(() =>
            Effect.fail(
              new Error(
                `Grammar files not found in ${grammarDir}. Expected:\n`
                  + `  ${grammarPath}\n`
                  + `  ${nodeTypesPath}`,
              ),
            )
          ),
        );
      }

      case 'literal': {
        // It's a bundled grammar name
        const packageName = `@treant/${grammarInput.value}-grammar`;

        // Load the package configuration
        const loaded = yield* loadGrammarPackage(packageName);

        // Check if files exist
        const grammarExists = yield* fs.exists(loaded.grammarPath);
        const nodeTypesExists = yield* fs.exists(loaded.nodeTypesPath);

        return yield* Match.value({ grammarExists, nodeTypesExists }).pipe(
          Match.when({ grammarExists: true, nodeTypesExists: true }, () =>
            Effect.succeed({
              grammarPath: loaded.grammarPath,
              nodeTypesPath: loaded.nodeTypesPath,
              nameOverride: loaded.nameOverride || toPascalCase(grammarInput.value),
            })),
          Match.orElse(() =>
            Effect.fail(
              new Error(
                `Grammar files not found for ${packageName}. Expected at:\n  ${loaded.grammarPath}\n  ${loaded.nodeTypesPath}`,
              ),
            )
          ),
        );
      }
    }
  });

export const loadGrammarPackage = (packageName: string) =>
  Effect.gen(function*() {
    const path = yield* Path.Path;

    // Load the package.json
    const { packageJson, packageJsonPath } = yield* loadPackageJson(packageName);

    // Get treant config
    const treantConfig = packageJson.treant || {};

    // Resolve paths
    const packageDir = path.dirname(packageJsonPath);
    const grammarPath = path.resolve(packageDir, treantConfig.grammar || 'src/grammar.json');
    const nodeTypesPath = path.resolve(packageDir, treantConfig.nodeTypes || 'src/node-types.json');

    return {
      packageJson,
      treantConfig,
      grammarPath,
      nodeTypesPath,
      nameOverride: treantConfig.displayName,
    };
  });
