/**
 * Core generator implementation using Effect for all I/O
 */

import { createStreaming } from '@dprint/formatter';
import { FileSystem, Path } from '@effect/platform';
import { Grammar } from '@treant/grammar';
import { Console, Effect } from 'effect';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { getNodeInterfaceName, getTypeGuardName } from './generators/type-helpers.js';
import * as TS from './lib/ts-syntax/$$.js';

// Import cursor generation system - now from grammar package
import { DEFAULT_CURSOR_CONFIG, generateCursorSystem } from './generators/cursor.js';

export interface GenerateOptions {
  grammarPath: string;
  nodeTypesPath: string;
  outputDir: string;
  nameOverride?: string;
}

/**
 * Write a file with optional formatting
 */
const writeFormattedFile = (
  path: string,
  content: string,
  formatter: any,
) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;

    try {
      const formatted = formatter.formatText(path, content);
      yield* fs.writeFileString(path, formatted || content);
    }
    catch (error) {
      yield* Console.warn(`Failed to format ${path}, writing unformatted`);
      yield* fs.writeFileString(path, content);
    }
  });

/**
 * Ensure a directory exists
 */
const ensureDir = (path: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const pathApi = yield* Path.Path;

    // Check if exists
    const exists = yield* fs.exists(path).pipe(
      Effect.orElseSucceed(() => false),
    );

    if (!exists) {
      yield* fs.makeDirectory(path, { recursive: true });
    }
  });

/**
 * Load and parse JSON file
 */
const loadJson = <T = unknown>(path: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem;
    const content = yield* fs.readFileString(path);
    return JSON.parse(content) as T;
  });

/**
 * Main generator function using Effect
 */
export const generate = (options: GenerateOptions) =>
  Effect.gen(function*() {
    const { grammarPath, nodeTypesPath, outputDir, nameOverride } = options;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    // Load grammar and node types
    const grammarJson = yield* loadJson<Grammar.GrammarJson>(grammarPath);
    const nodeTypes = yield* loadJson<Grammar.NodeType[]>(nodeTypesPath);

    // Extract grammar name
    const grammarName = grammarJson.name;
    const grammarNamePascal = nameOverride || (grammarName === 'graphql' ? 'GraphQL' : TS.toPascalCase(grammarName));
    const grammarNamespaceExport = `TreeSitter${grammarNamePascal}`;

    // Initialize formatter

    // Try to load dprint config
    const dprintConfigPath = path.join(process.cwd(), 'dprint.json');
    const dprintConfig = yield* loadJson(dprintConfigPath).pipe(
      Effect.orElse(() =>
        Effect.succeed({
          typescript: {
            semiColons: 'prefer',
            quoteStyle: 'alwaysSingle',
            useBraces: 'whenNotSingleLine',
            bracePosition: 'sameLineUnlessHanging',
            singleBodyPosition: 'maintain',
            nextControlFlowPosition: 'nextLine',
            trailingCommas: 'onlyMultiLine',
            operatorPosition: 'nextLine',
            preferHanging: false,
            preferSingleLine: false,
          },
        })
      ),
    );

    const tsPluginUrl = (dprintConfig as any).plugins?.find((p: string) => p.includes('typescript'))
      || 'https://plugins.dprint.dev/typescript-0.93.0.wasm';

    // Cache directory for WASM files
    const cacheDir = `${homedir()}/.cache/treant`;
    const urlHash = createHash('md5').update(tsPluginUrl).digest('hex');
    const cacheFile = `${cacheDir}/formatter-${urlHash}.wasm`;

    // Ensure cache directory exists
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }

    // Load formatter with caching
    let formatter;
    if (existsSync(cacheFile)) {
      // Use cached WASM file
      const wasmBuffer = readFileSync(cacheFile);
      formatter = yield* Effect.promise(() => createStreaming(Promise.resolve(new Response(wasmBuffer))));
    }
    else {
      // Download and cache WASM file
      yield* Console.log('Downloading formatter (this is only needed once)...');
      const response = yield* Effect.promise(() => fetch(tsPluginUrl));
      const buffer = yield* Effect.promise(() => response.arrayBuffer());

      // Save to cache
      writeFileSync(cacheFile, Buffer.from(buffer));

      formatter = yield* Effect.promise(() => createStreaming(Promise.resolve(new Response(buffer))));
    }

    formatter.setConfig(
      {
        indentWidth: (dprintConfig as any).typescript?.indentWidth || 2,
        lineWidth: (dprintConfig as any).typescript?.lineWidth || 120,
      },
      (dprintConfig as any).typescript || {},
    );

    // Create output directories
    yield* ensureDir(path.join(outputDir, 'nodes'));
    yield* ensureDir(path.join(outputDir, 'cursor'));
    yield* ensureDir(path.join(outputDir, 'node', 'group'));

    // Extract node types
    const namedNodes = nodeTypes.filter(node => node.named === true);
    const anonymousNodes = nodeTypes.filter(node => node.named === false);

    // Generate node files
    yield* Effect.forEach(namedNodes, (node) =>
      Effect.gen(function*() {
        const nodeFile = generateNodeFile(node, grammarName, grammarNamePascal);
        const fileName = `${node.type}.ts`;
        const filePath = path.join(outputDir, 'nodes', fileName);
        yield* writeFormattedFile(filePath, nodeFile, formatter);
      }), { concurrency: 5 });

    // Generate other files

    // Generate types.ts
    const typesContent = generateTypesFile();
    yield* writeFormattedFile(path.join(outputDir, 'types.ts'), typesContent, formatter);

    // Generate utils.ts
    const utilsContent = generateUtilsFile(nodeTypes, grammarName);
    yield* writeFormattedFile(path.join(outputDir, 'utils.ts'), utilsContent, formatter);

    // Generate anonymous-nodes.ts
    const anonymousContent = generateAnonymousNodesFile(anonymousNodes, grammarName);
    yield* writeFormattedFile(path.join(outputDir, 'anonymous-nodes.ts'), anonymousContent, formatter);

    // Generate cursor system
    const grammarAnalysis = Grammar.Analysis.analyzeGrammar(nodeTypes, grammarJson);

    const cursorGeneratorConfig = {
      outputDir,
      formatter,
    };

    // Note: This would need to be refactored to use Effect as well
    yield* Effect.promise(() => generateCursorSystem(cursorGeneratorConfig, grammarAnalysis, DEFAULT_CURSOR_CONFIG));
  });

// Helper functions for generating different file types
function generateNodeFile(node: Grammar.NodeType, grammarName: string, grammarNamePascal: string): string {
  const nodeName = getNodeInterfaceName(node.type);
  const typeGuardName = getTypeGuardName(node.type);
  const lines: string[] = [];

  lines.push('import type { Node } from \'web-tree-sitter\';');

  // Import child types if needed
  if (node.children && node.children.types.length > 0) {
    const childImports = node.children.types
      .filter(t => t.named && t.type !== node.type)
      .map(t => `import type { ${getNodeInterfaceName(t.type)} } from './${t.type}.js';`)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (childImports.length > 0) {
      childImports.forEach(imp => lines.push(imp));
    }
  }

  lines.push('');
  lines.push(`const TYPE = '${node.type}' as const;`);
  lines.push('');

  // Interface
  lines.push(`/**`);
  lines.push(` * Represents a ${node.type.replace(/_/g, ' ')} in the ${grammarName} AST.`);
  lines.push(` */`);
  lines.push(`export interface ${nodeName} extends Node {`);
  lines.push(`  type: typeof TYPE;`);
  lines.push('}');
  lines.push('');

  // Type guard
  lines.push(`/**`);
  lines.push(` * Type guard for ${nodeName}`);
  lines.push(` */`);
  lines.push(`export function ${typeGuardName}(node: unknown): node is ${nodeName} {`);
  lines.push(`  return (node as any)?.type === TYPE;`);
  lines.push('}');

  return lines.join('\n');
}

function generateTypesFile(): string {
  return `/**
 * Type definitions for tree-sitter AST nodes.
 * @generated
 */

export type { Node } from 'web-tree-sitter';
`;
}

function generateUtilsFile(nodeTypes: Grammar.NodeType[], grammarName: string): string {
  const namedNodes = nodeTypes.filter(n => n.named);

  return `/**
 * Utility functions for ${grammarName} AST traversal.
 * @generated
 */

import type * as WebTreeSitter from 'web-tree-sitter';

// Node type imports would go here...

export function findChildByType<T extends string>(
  node: WebTreeSitter.Node,
  type: T
): WebTreeSitter.Node | null {
  if (!node) return null;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child?.type === type) {
      return child;
    }
  }
  return null;
}

export function findChildrenByType<T extends string>(
  node: WebTreeSitter.Node,
  type: T
): WebTreeSitter.Node[] {
  if (!node) return [];
  const results: WebTreeSitter.Node[] = [];
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child?.type === type) {
      results.push(child);
    }
  }
  return results;
}
`;
}

function generateAnonymousNodesFile(anonymousNodes: Grammar.NodeType[], grammarName: string): string {
  // Categorize anonymous nodes
  const punctuationNodes = anonymousNodes.filter(node => node.type.length === 1 && /^[^a-zA-Z0-9]$/.test(node.type));

  const operatorNodes = anonymousNodes.filter(node => node.type.length > 1 && /^[^a-zA-Z0-9]+$/.test(node.type));

  const keywordNodes = anonymousNodes.filter(node => /^[a-z]+$/.test(node.type));

  return `/**
 * Anonymous node types for the ${grammarName} AST.
 * @generated
 */

import type { Node } from 'web-tree-sitter';

// Punctuation types
export type PunctuationType = ${punctuationNodes.map(n => `'${n.type}'`).join(' | ') || 'never'};

// Operator types
export type OperatorType = ${operatorNodes.map(n => `'${n.type}'`).join(' | ') || 'never'};

// Keyword types
export type KeywordType = ${keywordNodes.map(n => `'${n.type}'`).join(' | ') || 'never'};
`;
}
