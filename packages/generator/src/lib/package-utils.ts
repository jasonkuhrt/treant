import { FileSystem, Path } from '@effect/platform';
import { Effect } from 'effect';

/**
 * Resolves a package's package.json URL using ESM import.meta.resolve
 */
export const resolvePackageJsonUrl = (packageName: string) =>
  Effect.try({
    try: () => import.meta.resolve(`${packageName}/package.json`),
    catch: (error) => new Error(`Cannot resolve package ${packageName}: ${error}`),
  });

/**
 * Loads and parses a package.json file from a package name
 */
export const loadPackageJson = (packageName: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;

    // Resolve the package location
    const packageJsonUrl = yield* resolvePackageJsonUrl(packageName);

    // Convert file URL to path
    const packageJsonPath = packageJsonUrl.replace('file://', '');

    // Read and parse package.json
    const packageJsonContent = yield* fs.readFileString(packageJsonPath);
    const packageJson = JSON.parse(packageJsonContent);

    return {
      packageJson,
      packageJsonPath,
    };
  });

/**
 * Gets the directory path from a package.json file path
 */
export const getPackageDir = (packageJsonPath: string) =>
  Effect.gen(function*() {
    const path = yield* Path.Path;
    return path.dirname(packageJsonPath);
  });