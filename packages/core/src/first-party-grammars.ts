import { FileSystem, Path } from '@effect/platform';
import { Effect, Match } from 'effect';

// TODO: Support package names (both first and third party)
// Spec for future implementation:
// 1. Accept package names like "graphql" or "@acme/sql-grammar"
// 2. Resolution strategy:
//    a. Try require.resolve from user's CWD (for installed packages)
//    b. If not found, fetch from npm registry:
//       - GET https://registry.npmjs.org/{package}
//       - Download tarball from latest version
//       - Extract to ~/.treant/cache/packages/{name}/{version}
//       - Use cached version for future runs
// 3. Support version specs: @user/grammar@1.2.3
// 4. Examples:
//    - "graphql" → @treant/graphql-grammar (first party)
//    - "@acme/sql-grammar" → third party package
//    - "github:user/repo" → future: GitHub support
//
// For now, only directory paths are supported.

export type GrammarInput = string; // Path to grammar directory

// Helper to resolve grammar from directory path
export const resolveGrammarPaths = (grammarPath: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    // Directory path provided - use conventional layout
    const grammarDir = path.resolve(grammarPath);
    const grammarJsonPath = path.join(grammarDir, 'grammar.json');
    const nodeTypesPath = path.join(grammarDir, 'node-types.json');

    // Check if files exist
    const grammarExists = yield* fs.exists(grammarJsonPath);
    const nodeTypesExists = yield* fs.exists(nodeTypesPath);

    return yield* Match.value({ grammarExists, nodeTypesExists }).pipe(
      Match.when({ grammarExists: true, nodeTypesExists: true }, () =>
        Effect.succeed({
          grammarPath: grammarJsonPath,
          nodeTypesPath,
          nameOverride: undefined,
        })),
      Match.orElse(() =>
        Effect.fail(
          new Error(
            `Grammar files not found in ${grammarDir}. Expected:\n`
              + `  ${grammarJsonPath}\n`
              + `  ${nodeTypesPath}`,
          ),
        )
      ),
    );
  });