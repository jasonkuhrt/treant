#!/usr/bin/env tsx

/**
 * Generate the tree-sitter grammar TypeScript library.
 *
 * This script reads the generated node-types.json and grammar.json files and creates:
 * - Node interfaces for each AST node type that extend web-tree-sitter's Node
 * - Type guards for runtime type checking
 * - Constructor functions for creating nodes
 * - TreeSitter[GrammarName] namespace with union type for type-safe grammar definitions
 *
 * IMPORTANT: This generator uses modern ESM syntax (import.meta, import assertions)
 * that requires proper module configuration. It should be:
 * - Executed with: tsx (not node directly)
 * - Type-checked at project level: tsc --noEmit (uses tsconfig.json)
 * - NOT type-checked individually: tsc --noEmit scripts/gen-grammar-lib.ts
 *   (single-file checking bypasses project configuration and will fail)
 */

import { createStreaming } from '@dprint/formatter';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import grammarJson from '../../graphql-grammar/src/grammar.json' with { type: 'json' };
import nodeTypes from '../../graphql-grammar/src/node-types.json' with { type: 'json' };

// Import Grammar type system
import * as Grammar from '@treant/grammar';
// Import JSDoc builders
import * as JSDoc from './lib/jsdoc/$.js';
// Import TypeScript syntax helpers
import * as TS from './lib/ts-syntax/$.js';

// Import cursor generation system
import {
  analyzeGrammar,
} from './generators/core/grammar-analysis.js';
import {
  DEFAULT_CURSOR_CONFIG,
  generateCursorSystem,
} from './generators/cursor/cursor-generator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sdkRoot = join(__dirname, '../../graphql-sdk');

// Type-safe grammar access
const grammar = grammarJson as Grammar.Types.GrammarJson;

// Parse command line arguments
const args = process.argv.slice(2);
const nameIndex = args.indexOf('--name');
const overrideName = nameIndex !== -1 && nameIndex + 1 < args.length ? args[nameIndex + 1] : null;

// Extract grammar name from grammar.json or use override
const grammarName = grammar.name;
// Special case for GraphQL to match existing expectation
const grammarNamePascal = overrideName || (grammarName === 'graphql' ? 'GraphQL' : TS.toPascalCase(grammarName));
const grammarNamespaceExport = `TreeSitter${grammarNamePascal}`;

// Type definitions for node-types.json structure
interface NodeType {
  type: string;
  named: boolean;
  fields?: Record<string, unknown>;
  children?: {
    multiple: boolean;
    required: boolean;
    types: Array<{ type: string; named: boolean }>;
  };
  extra?: boolean;
  root?: boolean;
}

// Generate the large section header
function generateSectionHeader(title: string, subtitle?: string): string {
  return JSDoc.buildSectionHeader({ title, ...(subtitle ? { subtitle } : {}) });
}

// Generate JSDoc for a node interface
function generateInterfaceJSDoc(node: NodeType): string {
  const description = [`Represents a ${node.type.replace(/_/g, ' ')} in the ${grammarName} AST.`];
  const additionalInfo: string[] = [];

  // Add child information if any
  if (node.children && node.children.types.length > 0) {
    const namedChildTypes = node.children.types.filter(t => t.named);
    if (namedChildTypes.length > 0) {
      additionalInfo.push('Children:');
      const childLinks = namedChildTypes
        .map(t => JSDoc.buildLink(TS.getNodeInterfaceName(t.type)))
        .join(', ');
      additionalInfo.push(`  ${childLinks}`);
    }
  }

  return JSDoc.buildInterfaceJSDoc(
    TS.getNodeInterfaceName(node.type),
    description.join(' '),
    additionalInfo.length > 0 ? additionalInfo : undefined,
  );
}

// Generate JSDoc for type guard
function generateTypeGuardJSDoc(node: NodeType): string {
  return JSDoc.buildTypeGuardJSDoc({
    nodeName: TS.getNodeInterfaceName(node.type),
    nodeType: node.type,
    functionName: TS.getTypeGuardName(node.type),
  });
}

// Generate JSDoc for constructor
function generateConstructorJSDoc(node: NodeType): string {
  const nodeName = TS.getNodeInterfaceName(node.type);

  // Extract child properties for documentation
  const properties = node.children?.types
    .filter(t => t.named)
    .map(childType => ({
      name: childType.type.replace(/_/g, ''),
      type: TS.getNodeInterfaceName(childType.type),
      description: '',
    }));

  return JSDoc.buildConstructorJSDoc({
    nodeName,
    ...(properties ? { properties } : {}),
  });
}

// Generate a node file
function generateNodeFile(node: NodeType): string {
  const nodeName = TS.getNodeInterfaceName(node.type);
  const typeGuardName = TS.getTypeGuardName(node.type);
  const lines: string[] = [];

  // ================================================================
  // ================================================================
  //
  //                           IMPORTS SECTION
  //
  // ================================================================
  // ================================================================

  lines.push('import type { Node } from \'web-tree-sitter\';');

  // Import child types
  if (node.children && node.children.types.length > 0) {
    const childImports = node.children.types
      .filter(t => t.named && t.type !== node.type)
      .map(t => `import type { ${TS.getNodeInterfaceName(t.type)} } from './${t.type}.js';`)
      .filter((v, i, a) => a.indexOf(v) === i); // unique

    if (childImports.length > 0) {
      childImports.forEach(imp => lines.push(imp));
    }
  }

  // ================================================================
  // ================================================================
  //
  //                           INTERFACE SECTION
  //
  // ================================================================
  // ================================================================

  // Type constant
  lines.push(`const TYPE = '${node.type}' as const;`);
  lines.push('');

  lines.push(generateSectionHeader(nodeName, `${grammarNamePascal} ${node.type.replace(/_/g, ' ')} node`));
  lines.push(generateInterfaceJSDoc(node));
  lines.push(`export interface ${nodeName} extends Node {`);
  lines.push(`  type: typeof TYPE;`);
  lines.push('}');

  // ================================================================
  // ================================================================
  //
  //                           TYPE GUARD SECTION
  //
  // ================================================================
  // ================================================================

  lines.push(generateSectionHeader('Type Guard'));
  lines.push(generateTypeGuardJSDoc(node));
  lines.push(`export function ${typeGuardName}(node: unknown): node is ${nodeName} {`);
  lines.push(`  return (node as any)?.type === TYPE;`);
  lines.push('}');

  // ================================================================
  // ================================================================
  //
  //                           CONSTRUCTOR SECTION
  //
  // ================================================================
  // ================================================================

  lines.push(generateSectionHeader('Constructor'));
  lines.push(generateConstructorJSDoc(node));

  lines.push(`export function ${nodeName}(props: Omit<${nodeName}, 'type'>): ${nodeName} {`);
  lines.push('  return {');
  lines.push(`    type: TYPE,`);
  lines.push('    ...props');
  lines.push('  };');
  lines.push('}');

  return lines.join('\n');
}

// Generate anonymous nodes file
function generateAnonymousNodesFile(
  punctuationTypes: string[],
  operatorTypes: string[],
  keywordTypes: string[],
  otherTypes: string[],
): string {
  const lines: string[] = [];

  lines.push(JSDoc.buildFileHeader({
    description: `Anonymous node types for the ${grammarName} AST.`,
    generated: true,
    doNotEdit: true,
  }));
  lines.push('');
  lines.push('import type { Node } from \'web-tree-sitter\';');
  lines.push('');

  // Generate Punctuation types
  if (punctuationTypes.length > 0) {
    lines.push(JSDoc.buildJSDoc({
      description: `Single-character punctuation tokens in ${grammarName}.`,
    }));
    lines.push(`export type PunctuationType = ${punctuationTypes.map(t => `'${t}'`).join(' | ')};`);
    lines.push('');

    lines.push(JSDoc.buildJSDoc({
      description: `Interface for punctuation nodes in the ${grammarName} AST.`,
    }));
    lines.push('export interface Punctuation extends Node {');
    lines.push('  type: PunctuationType;');
    lines.push('}');
    lines.push('');

    lines.push(JSDoc.buildJSDoc({
      description: `Type guard to check if a node is a ${JSDoc.buildLink('Punctuation')}.`,
    }));
    lines.push('export function isPunctuation(node: unknown): node is Punctuation {');
    lines.push(`  const types: PunctuationType[] = [${punctuationTypes.map(t => `'${t}'`).join(', ')}];`);
    lines.push(
      '  return node != null && typeof (node as any).type === \'string\' && types.includes((node as any).type as PunctuationType);',
    );
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Array of all punctuation node types.');
    lines.push(' */');
    lines.push(`export const punctuationTypes = [${punctuationTypes.map(t => `'${t}'`).join(', ')}] as const;`);
    lines.push('');
  }

  // Generate Operator types
  if (operatorTypes.length > 0) {
    lines.push('/**');
    lines.push(` * Multi-character operator tokens in ${grammarName}.`);
    lines.push(' */');
    lines.push(`export type OperatorType = ${operatorTypes.map(t => `'${t}'`).join(' | ')};`);
    lines.push('');

    lines.push('/**');
    lines.push(` * Interface for operator nodes in the ${grammarName} AST.`);
    lines.push(' */');
    lines.push('export interface Operator extends Node {');
    lines.push('  type: OperatorType;');
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Type guard to check if a node is an {@link Operator}.');
    lines.push(' */');
    lines.push('export function isOperator(node: unknown): node is Operator {');
    lines.push(`  const types: OperatorType[] = [${operatorTypes.map(t => `'${t}'`).join(', ')}];`);
    lines.push(
      '  return node != null && typeof (node as any).type === \'string\' && types.includes((node as any).type as OperatorType);',
    );
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Array of all operator node types.');
    lines.push(' */');
    lines.push(`export const operatorTypes = [${operatorTypes.map(t => `'${t}'`).join(', ')}] as const;`);
    lines.push('');
  }

  // Generate Keyword types
  if (keywordTypes.length > 0) {
    lines.push('/**');
    lines.push(` * Keyword tokens in ${grammarName}.`);
    lines.push(' */');
    lines.push(`export type KeywordType = ${keywordTypes.map(t => `'${t}'`).join(' | ')};`);
    lines.push('');

    lines.push('/**');
    lines.push(` * Interface for keyword nodes in the ${grammarName} AST.`);
    lines.push(' */');
    lines.push('export interface Keyword extends Node {');
    lines.push('  type: KeywordType;');
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Type guard to check if a node is a {@link Keyword}.');
    lines.push(' */');
    lines.push('export function isKeyword(node: unknown): node is Keyword {');
    lines.push(`  const types: KeywordType[] = [${keywordTypes.map(t => `'${t}'`).join(', ')}];`);
    lines.push(
      '  return node != null && typeof (node as any).type === \'string\' && types.includes((node as any).type as KeywordType);',
    );
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Array of all keyword node types.');
    lines.push(' */');
    lines.push(`export const keywordTypes = [${keywordTypes.map(t => `'${t}'`).join(', ')}] as const;`);
    lines.push('');
  }

  // Generate Other types
  if (otherTypes.length > 0) {
    lines.push('/**');
    lines.push(` * Other anonymous tokens in ${grammarName} (includes grammar-specific tokens).`);
    lines.push(' */');
    lines.push(`export type OtherAnonymousType = ${otherTypes.map(t => `'${t}'`).join(' | ')};`);
    lines.push('');

    lines.push('/**');
    lines.push(` * Interface for other anonymous nodes in the ${grammarName} AST.`);
    lines.push(' */');
    lines.push('export interface OtherAnonymous extends Node {');
    lines.push('  type: OtherAnonymousType;');
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Type guard to check if a node is an {@link OtherAnonymous}.');
    lines.push(' */');
    lines.push('export function isOtherAnonymous(node: unknown): node is OtherAnonymous {');
    lines.push(`  const types: OtherAnonymousType[] = [${otherTypes.map(t => `'${t}'`).join(', ')}];`);
    lines.push(
      '  return node != null && typeof (node as any).type === \'string\' && types.includes((node as any).type as OtherAnonymousType);',
    );
    lines.push('}');
    lines.push('');

    lines.push('/**');
    lines.push(' * Array of all other anonymous node types.');
    lines.push(' */');
    lines.push(`export const otherAnonymousTypes = [${otherTypes.map(t => `'${t}'`).join(', ')}] as const;`);
    lines.push('');
  }

  // Generate union type for all anonymous nodes
  lines.push(JSDoc.buildJSDoc({
    description: `Union type of all anonymous nodes in the ${grammarName} AST.`,
  }));
  lines.push('export type AnonymousNode =');
  const anonymousUnions = [];
  if (punctuationTypes.length > 0) anonymousUnions.push('Punctuation');
  if (operatorTypes.length > 0) anonymousUnions.push('Operator');
  if (keywordTypes.length > 0) anonymousUnions.push('Keyword');
  if (otherTypes.length > 0) anonymousUnions.push('OtherAnonymous');

  anonymousUnions.forEach((type, index) => {
    const separator = index === 0 ? '' : '|';
    lines.push(`  ${separator} ${type}`);
  });
  lines.push(';');
  lines.push('');

  // Generate comprehensive type guard
  lines.push('/**');
  lines.push(' * Type guard to check if a node is any anonymous node.');
  lines.push(' */');
  lines.push('export function isAnonymousNode(node: unknown): node is AnonymousNode {');

  const guards = [];
  if (punctuationTypes.length > 0) guards.push('isPunctuation(node)');
  if (operatorTypes.length > 0) guards.push('isOperator(node)');
  if (keywordTypes.length > 0) guards.push('isKeyword(node)');
  if (otherTypes.length > 0) guards.push('isOtherAnonymous(node)');

  lines.push(`  return ${guards.join(' || ')};`);
  lines.push('}');

  return lines.join('\n');
}

// Generate Layer 1: Generic Tree Utilities
function generateUtilsFile(): string {
  const lines: string[] = [];

  lines.push('import type * as WebTreeSitter from \'web-tree-sitter\';');
  lines.push('');
  lines.push('// Re-export Node namespace for convenient access');
  lines.push('import { Node } from \'./$$.js\';');
  lines.push('export { Node };');
  lines.push('');

  // Generate conditional type helper
  lines.push('/**');
  lines.push(' * Conditional type that maps node type strings to their corresponding TypeScript interfaces.');
  lines.push(' */');
  lines.push('type NodeTypeMap = {');
  for (const node of nodeTypes.filter((n: NodeType) => n.named)) {
    const interfaceName = TS.getNodeInterfaceName(node.type);
    lines.push(`  '${node.type}': import('./nodes/${node.type}.js').${interfaceName};`);
  }
  lines.push('};');
  lines.push('');

  lines.push('/**');
  lines.push(' * Get the TypeScript interface type for a node type string.');
  lines.push(' */');
  lines.push('type GetNodeType<T extends string> = T extends keyof NodeTypeMap ? NodeTypeMap[T] : WebTreeSitter.Node;');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Find the first child node of a specific type.',
    params: [
      { name: 'node', description: 'The parent node to search in' },
      { name: 'type', description: 'The type of node to find' },
    ],
    returns: { description: 'The first matching child node with proper type, or null if not found' },
    examples: [{
      code: [
        'const field = findChildByType(selectionSet, \'field\');',
        '// field is typed as FieldNode | null',
        'if (field) {',
        '  console.log(field.type); // "field"',
        '}',
      ],
    }],
  }));
  lines.push('export function findChildByType<T extends string>(');
  lines.push('  node: WebTreeSitter.Node,');
  lines.push('  type: T');
  lines.push('): GetNodeType<T> | null {');
  lines.push('  if (!node) return null;');
  lines.push('  for (let i = 0; i < node.childCount; i++) {');
  lines.push('    const child = node.child(i);');
  lines.push('    if (child?.type === type) {');
  lines.push('      return child as GetNodeType<T>;');
  lines.push('    }');
  lines.push('  }');
  lines.push('  return null;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Find all child nodes of a specific type.',
    params: [
      { name: 'node', description: 'The parent node to search in' },
      { name: 'type', description: 'The type of nodes to find' },
    ],
    returns: { description: 'Array of matching child nodes with proper types' },
    examples: [{
      code: [
        'const fields = findChildrenByType(selectionSet, \'field\');',
        '// fields is typed as FieldNode[]',
        'fields.forEach(field => {',
        '  console.log(field.type); // "field"',
        '});',
      ],
    }],
  }));
  lines.push('export function findChildrenByType<T extends string>(');
  lines.push('  node: WebTreeSitter.Node,');
  lines.push('  type: T');
  lines.push('): GetNodeType<T>[] {');
  lines.push('  if (!node) return [];');
  lines.push('  const results: GetNodeType<T>[] = [];');
  lines.push('  for (let i = 0; i < node.childCount; i++) {');
  lines.push('    const child = node.child(i);');
  lines.push('    if (child?.type === type) {');
  lines.push('      results.push(child as GetNodeType<T>);');
  lines.push('    }');
  lines.push('  }');
  lines.push('  return results;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Find a child node by following a path of node types.',
    params: [
      { name: 'node', description: 'The root node to start from' },
      { name: 'path', description: 'Array of node types to follow' },
    ],
    returns: { description: 'The node at the end of the path, or null if path doesn\'t exist' },
    examples: [{
      code: [
        '// Navigate: fragment_definition -> type_condition -> named_type -> name',
        'const name = findChildByPath(fragmentDef, [\'type_condition\', \'named_type\', \'name\']);',
      ],
    }],
  }));
  lines.push('export function findChildByPath(node: WebTreeSitter.Node, path: string[]): WebTreeSitter.Node | null {');
  lines.push('  if (!node) return null;');
  lines.push('  let current = node;');
  lines.push('  ');
  lines.push('  for (const nodeType of path) {');
  lines.push('    const child = findChildByType(current, nodeType);');
  lines.push('    if (!child) return null;');
  lines.push('    current = child;');
  lines.push('  }');
  lines.push('  ');
  lines.push('  return current;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Generic tree walker that visits every node in the AST.',
    params: [
      { name: 'node', description: 'The root node to start walking from' },
      { name: 'visitor', description: 'Function called for each node' },
    ],
    examples: [{
      code: [
        'walkTree(document, (node) => {',
        '  if (node.type === \'field\') {',
        '    console.log(\'Found field:\', node.text);',
        '  }',
        '});',
      ],
    }],
  }));
  lines.push('export function walkTree(node: WebTreeSitter.Node, visitor: (node: WebTreeSitter.Node) => void): void {');
  lines.push('  if (!node) return;');
  lines.push('  visitor(node);');
  lines.push('  ');
  lines.push('  for (let i = 0; i < node.childCount; i++) {');
  lines.push('    const child = node.child(i);');
  lines.push('    if (child) {');
  lines.push('      walkTree(child, visitor);');
  lines.push('    }');
  lines.push('  }');
  lines.push('}');
  lines.push('');

  // Add parser helper functions
  lines.push(JSDoc.buildJSDoc({
    description: [
      'Create a configured GraphQL parser instance for Node.js or browser environments.',
      '',
      'This helper handles the complex WASM loading logic and provides a ready-to-use',
      'parser with the GraphQL grammar loaded.',
    ],
    params: [{
      name: 'options',
      description: 'Optional configuration for WASM file paths',
      optional: true,
    }],
  }));
  lines.push('export async function createGraphQLParser(options?: {');
  lines.push('  /** Custom path to tree-sitter.wasm file */');
  lines.push('  treeSitterWasmPath?: string');
  lines.push('  /** Custom path to GraphQL grammar WASM file */');
  lines.push('  graphqlWasmPath?: string');
  lines.push('}): Promise<import(\'web-tree-sitter\').Parser> {');
  lines.push('  const WebTreeSitter = await import(\'web-tree-sitter\')');
  lines.push('  const isNode = typeof process !== \'undefined\' && process.versions && process.versions.node');
  lines.push('');
  lines.push('  if (isNode) {');
  lines.push('    // Node.js environment (tests, SSR, etc.)');
  lines.push('    const { promises: fs } = await import(\'node:fs\')');
  lines.push('    const path = await import(\'node:path\')');
  lines.push('    ');
  lines.push(
    '    const treeSitterWasmPath = options?.treeSitterWasmPath ?? path.join(process.cwd(), \'node_modules/web-tree-sitter/tree-sitter.wasm\')',
  );
  lines.push(
    '    const graphqlWasmPath = options?.graphqlWasmPath ?? path.join(process.cwd(), \'node_modules/treant-grammar-wasm/grammar.wasm\')',
  );
  lines.push('');
  lines.push('    await WebTreeSitter.Parser.init({');
  lines.push('      locateFile: (filename: string) => {');
  lines.push('        if (filename === \'tree-sitter.wasm\') {');
  lines.push('          return treeSitterWasmPath');
  lines.push('        }');
  lines.push('        return filename');
  lines.push('      },');
  lines.push('    })');
  lines.push('');
  lines.push('    const parser = new WebTreeSitter.Parser()');
  lines.push('    const wasmBuffer = await fs.readFile(graphqlWasmPath)');
  lines.push('    const GraphQL = await WebTreeSitter.Language.load(new Uint8Array(wasmBuffer))');
  lines.push('    parser.setLanguage(GraphQL)');
  lines.push('');
  lines.push('    return parser');
  lines.push('  } else {');
  lines.push('    // Browser environment - consumer needs to provide URLs');
  lines.push('    throw new Error(');
  lines.push('      \'createGraphQLParser() requires WASM URLs for browser environment. \' +');
  lines.push('      \'Please use createGraphQLParserForBrowser() instead.\'');
  lines.push('    )');
  lines.push('  }');
  lines.push('}');
  lines.push('');
  lines.push('/**');
  lines.push(' * Create a GraphQL parser for browser environments with provided WASM URLs.');
  lines.push(' */');
  lines.push('export async function createGraphQLParserForBrowser(');
  lines.push('  treeSitterWasmUrl: string,');
  lines.push('  graphqlWasmUrl: string');
  lines.push('): Promise<import(\'web-tree-sitter\').Parser> {');
  lines.push('  const WebTreeSitter = await import(\'web-tree-sitter\')');
  lines.push('  await WebTreeSitter.Parser.init({');
  lines.push('    locateFile: (filename: string) => {');
  lines.push('      if (filename === \'tree-sitter.wasm\') {');
  lines.push('        return treeSitterWasmUrl');
  lines.push('      }');
  lines.push('      return filename');
  lines.push('    },');
  lines.push('  })');
  lines.push('');
  lines.push('  const parser = new WebTreeSitter.Parser()');
  lines.push('');
  lines.push('  // Fetch the GraphQL grammar WASM file');
  lines.push('  const response = await fetch(graphqlWasmUrl)');
  lines.push('  if (!response.ok) {');
  lines.push('    throw new Error(');
  lines.push('      `Failed to load GraphQL grammar file: ${response.status} ${response.statusText}`');
  lines.push('    )');
  lines.push('  }');
  lines.push('');
  lines.push('  const wasmBuffer = await response.arrayBuffer()');
  lines.push('  if (wasmBuffer.byteLength === 0) {');
  lines.push('    throw new Error(\'GraphQL grammar file is empty or corrupted\')');
  lines.push('  }');
  lines.push('');
  lines.push('  const GraphQL = await WebTreeSitter.Language.load(new Uint8Array(wasmBuffer))');
  lines.push('  parser.setLanguage(GraphQL)');
  lines.push('');
  lines.push('  return parser');
  lines.push('}');
  lines.push('');

  // Add node validation utilities that were previously in CursorValidation
  lines.push(JSDoc.buildJSDoc({
    description: 'Check if a node type can have children based on the grammar.',
    params: [
      { name: 'nodeType', description: 'The node type to check' },
    ],
    returns: { description: 'True if the node type can have children' },
    examples: [{
      code: [
        'if (canHaveChildren(\'field\')) {',
        '  // Safe to call node.children',
        '}',
      ],
    }],
  }));
  lines.push('export function canHaveChildren(nodeType: string): boolean {');
  lines.push('  // In tree-sitter, all nodes can potentially have children');
  lines.push('  // This is a placeholder for grammar-specific logic if needed');
  lines.push('  return true;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Get possible child types for a parent node based on the grammar.',
    params: [
      { name: 'parentType', description: 'The parent node type' },
    ],
    returns: { description: 'Array of possible child node types' },
    examples: [{
      code: [
        'const childTypes = getPossibleChildTypes(\'field\');',
        '// Returns [\'alias\', \'name\', \'arguments\', \'directives\', \'selection_set\']',
      ],
    }],
  }));
  lines.push('export function getPossibleChildTypes(parentType: string): readonly string[] {');
  lines.push('  // This would use ChildMap from the cursor types in a real implementation');
  lines.push('  // For now, return empty array as tree-sitter handles validation');
  lines.push('  return [];');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Check if navigation from one node type to another is valid in the grammar.',
    params: [
      { name: 'from', description: 'The source node type' },
      { name: 'to', description: 'The target node type' },
    ],
    returns: { description: 'True if the navigation is valid' },
    examples: [{
      code: [
        'if (isValidNavigation(\'field\', \'name\')) {',
        '  // Safe to navigate from field to name',
        '}',
      ],
    }],
  }));
  lines.push('export function isValidNavigation(from: string, to: string): boolean {');
  lines.push('  // Tree-sitter only produces valid ASTs, so all navigations in the tree are valid');
  lines.push('  // This is a placeholder for type-level validation if needed');
  lines.push('  return true;');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// Generate Layer 2: Position-Optimized Accessors
function generateAccessorsFile(): string {
  const lines: string[] = [];
  const usedTypes = new Set<string>();

  // First, generate all accessor functions and collect used types
  const accessorLines: string[] = [];
  for (const [ruleName, rule] of Object.entries(grammar.rules)) {
    if (Grammar.Predicates.isSeqRule(rule)) {
      const ruleFunctions = generateAccessorFunctionsForRule(ruleName, rule);
      if (ruleFunctions.length > 0) {
        // Only add parent type if we actually generate functions for it
        usedTypes.add(TS.getNodeInterfaceName(ruleName));

        accessorLines.push(`/**`);
        accessorLines.push(` * Generated accessors for ${ruleName} (SEQ rule with ${rule.members.length} members)`);
        accessorLines.push(` */`);

        ruleFunctions.forEach(func => {
          accessorLines.push(...func.lines);
          usedTypes.add(func.childNodeType);
        });
      }
    }
  }

  // Import Node namespace instead of individual types
  lines.push('');
  lines.push('import { Node } from \'./$$.js\';');
  lines.push('');

  // Add the generated accessors
  lines.push(...accessorLines);

  return lines.join('\n');
}

// Helper function to detect semantic groupings (CHOICE rules with only SYMBOL members)
function detectSemanticGroupings(grammarRules: Record<string, Grammar.Types.Rule>): Map<string, string[]> {
  return Grammar.Analysis.detectSemanticGroupings(grammarRules);
}

// Helper function to generate accessor functions for a rule and return metadata
function generateAccessorFunctionsForRule(
  ruleName: string,
  rule: Grammar.Types.SeqRule,
): Array<{ lines: string[]; childNodeType: string }> {
  const functions: Array<{ lines: string[]; childNodeType: string }> = [];
  const nodeTypeName = TS.getNodeInterfaceName(ruleName);

  // Use Grammar library to extract child types
  const childTypes = Grammar.Analysis.extractDirectChildTypes(rule);

  // Generate accessor functions that search for child by type
  childTypes.forEach(({ type: childType }) => {
    const accessorName = `get${TS.toPascalCase(childType)}From${TS.toPascalCase(ruleName)}`;
    const childNodeType = TS.getNodeInterfaceName(childType);

    const funcLines = [
      `export function ${accessorName}(node: Node.${nodeTypeName}): Node.${childNodeType} | null {`,
      `  // Search through children to find the ${childType} node`,
      `  for (let i = 0; i < node.childCount; i++) {`,
      `    const child = node.child(i);`,
      `    if (child?.type === '${childType}') {`,
      `      return child as Node.${childNodeType};`,
      `    }`,
      `  }`,
      `  return null;`,
      `}`,
      '',
    ];

    functions.push({ lines: funcLines, childNodeType });
  });

  return functions;
}

// Generate Layer 3: Composite Extractors
function generateExtractorsFile(): string {
  const lines: string[] = [];

  lines.push('import type * as WebTreeSitter from \'web-tree-sitter\';');
  lines.push('import { walkTree, Node } from \'./utils.js\';');
  lines.push('');

  generateLayer3CompositeExtractors(lines);

  return lines.join('\n');
}

// Generate Layer 4: Structure Metadata
function generateMetadataFile(): string {
  const lines: string[] = [];

  lines.push('import type * as WebTreeSitter from \'web-tree-sitter\';');
  lines.push('');

  generateLayer4StructureMetadata(lines);

  return lines.join('\n');
}

// Generate Layer 3: Composite extractors for common patterns
function generateLayer3CompositeExtractors(lines: string[]): void {
  lines.push(JSDoc.buildJSDoc({
    description: 'Extract all nested fields from a selection set.',
    params: [{
      name: 'node',
      description: 'Selection set node to extract from',
    }],
    returns: {
      description: 'Array of field nodes found in the selection set',
    },
  }));
  lines.push('export function extractAllFields(node: WebTreeSitter.Node): Node.Field[] {');
  lines.push('  const fields: Node.Field[] = [];');
  lines.push('  walkTree(node, (child) => {');
  lines.push('    if (child.type === \'field\') {');
  lines.push('      fields.push(child as Node.Field);');
  lines.push('    }');
  lines.push('  });');
  lines.push('  return fields;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Extract all directive nodes from a subtree.',
    params: [{
      name: 'node',
      description: 'Root node to search from',
    }],
    returns: {
      description: 'Array of directive nodes',
    },
  }));
  lines.push('export function extractAllDirectives(node: WebTreeSitter.Node): Node.Directive[] {');
  lines.push('  const directives: Node.Directive[] = [];');
  lines.push('  walkTree(node, (child) => {');
  lines.push('    if (child.type === \'directive\') {');
  lines.push('      directives.push(child as Node.Directive);');
  lines.push('    }');
  lines.push('  });');
  lines.push('  return directives;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Extract all variable references from a subtree.',
    params: [{
      name: 'node',
      description: 'Root node to search from',
    }],
    returns: {
      description: 'Array of variable nodes',
    },
  }));
  lines.push('export function extractAllVariables(node: WebTreeSitter.Node): Node.Variable[] {');
  lines.push('  const variables: Node.Variable[] = [];');
  lines.push('  walkTree(node, (child) => {');
  lines.push('    if (child.type === \'variable\') {');
  lines.push('      variables.push(child as Node.Variable);');
  lines.push('    }');
  lines.push('  });');
  lines.push('  return variables;');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * Find all fragments (fragment spreads and inline fragments) in a subtree.');
  lines.push(' * ');
  lines.push(' * @param node - Root node to search from');
  lines.push(' * @returns Object containing arrays of fragment spreads and inline fragments');
  lines.push(' */');
  lines.push(
    'export function extractAllFragments(node: WebTreeSitter.Node): { spreads: Node.FragmentSpread[]; inline: Node.InlineFragment[] } {',
  );
  lines.push('  const spreads: Node.FragmentSpread[] = [];');
  lines.push('  const inline: Node.InlineFragment[] = [];');
  lines.push('  walkTree(node, (child) => {');
  lines.push('    if (child.type === \'fragment_spread\') {');
  lines.push('      spreads.push(child as Node.FragmentSpread);');
  lines.push('    } else if (child.type === \'inline_fragment\') {');
  lines.push('      inline.push(child as Node.InlineFragment);');
  lines.push('    }');
  lines.push('  });');
  lines.push('  return { spreads, inline };');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * Extract the text content of all name nodes in a subtree.');
  lines.push(' * ');
  lines.push(' * @param node - Root node to search from');
  lines.push(' * @returns Array of name strings');
  lines.push(' */');
  lines.push('export function extractAllNames(node: WebTreeSitter.Node): string[] {');
  lines.push('  const names: string[] = [];');
  lines.push('  walkTree(node, (child) => {');
  lines.push('    if (child.type === \'name\') {');
  lines.push('      names.push(child.text);');
  lines.push('    }');
  lines.push('  });');
  lines.push('  return names;');
  lines.push('}');
  lines.push('');
}

// Generate Layer 4: Structure metadata for introspection
function generateLayer4StructureMetadata(lines: string[]): void {
  // Pre-compute child types for all rules
  const childTypesMap: Record<string, string[]> = {};
  for (const [ruleName, rule] of Object.entries(grammar.rules)) {
    childTypesMap[ruleName] = Grammar.Analysis.extractChildTypes(rule);
  }
  lines.push(JSDoc.buildJSDoc({
    description: 'Get structural information about a node.',
    params: [{
      name: 'node',
      description: 'The node to analyze',
    }],
    returns: {
      description: 'Metadata about the node structure',
    },
  }));
  lines.push('export function getNodeMetadata(node: WebTreeSitter.Node): {');
  lines.push('  type: string;');
  lines.push('  childCount: number;');
  lines.push('  childTypes: string[];');
  lines.push('  isNamed: boolean;');
  lines.push('  hasError: boolean;');
  lines.push('  textLength: number;');
  lines.push('  depth: number;');
  lines.push('} {');
  lines.push('  const childTypes: string[] = [];');
  lines.push('  for (let i = 0; i < node.childCount; i++) {');
  lines.push('    const child = node.child(i);');
  lines.push('    if (child) childTypes.push(child.type);');
  lines.push('  }');
  lines.push('  ');
  lines.push('  return {');
  lines.push('    type: node.type,');
  lines.push('    childCount: node.childCount,');
  lines.push('    childTypes,');
  lines.push('    isNamed: node.isNamed,');
  lines.push('    hasError: node.hasError,');
  lines.push('    textLength: node.text.length,');
  lines.push('    depth: getNodeDepth(node),');
  lines.push('  };');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Calculate the depth of a node in the tree.',
    params: [{
      name: 'node',
      description: 'The node to measure',
    }],
    returns: {
      description: 'Depth from root (0-based)',
    },
  }));
  lines.push('export function getNodeDepth(node: WebTreeSitter.Node): number {');
  lines.push('  let depth = 0;');
  lines.push('  let current = node.parent;');
  lines.push('  while (current) {');
  lines.push('    depth++;');
  lines.push('    current = current.parent;');
  lines.push('  }');
  lines.push('  return depth;');
  lines.push('}');
  lines.push('');

  // Generate pre-computed child types mapping
  lines.push('/**');
  lines.push(' * Pre-computed mapping of node types to their possible child types.');
  lines.push(' */');
  lines.push('const CHILD_TYPES_MAP: Record<string, string[]> = {');
  for (const [ruleName, childTypes] of Object.entries(childTypesMap)) {
    lines.push(`  '${ruleName}': [${childTypes.map(t => `'${t}'`).join(', ')}],`);
  }
  lines.push('};');
  lines.push('');

  lines.push('/**');
  lines.push(' * Get all possible child types for a specific node type based on grammar rules.');
  lines.push(' * ');
  lines.push(' * @param nodeType - The node type to check');
  lines.push(' * @returns Array of possible child types');
  lines.push(' */');
  lines.push('export function getPossibleChildTypes(nodeType: string): string[] {');
  lines.push('  return CHILD_TYPES_MAP[nodeType] || [];');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * Check if a node matches expected grammar structure.');
  lines.push(' * ');
  lines.push(' * @param node - The node to validate');
  lines.push(' * @returns True if node structure matches grammar expectations');
  lines.push(' */');
  lines.push('export function validateNodeStructure(node: WebTreeSitter.Node): boolean {');
  lines.push('  const possibleChildTypes = getPossibleChildTypes(node.type);');
  lines.push('  if (possibleChildTypes.length === 0) {');
  lines.push('    // Unknown node type');
  lines.push('    return true;');
  lines.push('  }');
  lines.push('  ');
  lines.push('  for (let i = 0; i < node.childCount; i++) {');
  lines.push('    const child = node.child(i);');
  lines.push('    if (child && !possibleChildTypes.includes(child.type)) {');
  lines.push('      // Check if it\'s an anonymous node (not in CHILD_TYPES_MAP)');
  lines.push('      if (!CHILD_TYPES_MAP[child.type]) {');
  lines.push('        continue; // Anonymous nodes are valid');
  lines.push('      }');
  lines.push('      return false;');
  lines.push('    }');
  lines.push('  }');
  lines.push('  ');
  lines.push('  return true;');
  lines.push('}');
  lines.push('');

  lines.push(JSDoc.buildJSDoc({
    description: 'Get a summary of the AST structure for debugging.',
    params: [
      { name: 'node', description: 'Root node to summarize' },
      { name: 'maxDepth', description: 'Maximum depth to traverse', defaultValue: '3' },
    ],
    returns: {
      description: 'String representation of the tree structure',
    },
  }));
  lines.push('export function getASTSummary(node: WebTreeSitter.Node, maxDepth: number = 3): string {');
  lines.push('  const lines: string[] = [];');
  lines.push('  ');
  lines.push('  function traverse(n: WebTreeSitter.Node, depth: number, prefix: string): void {');
  lines.push('    if (depth > maxDepth) return;');
  lines.push('    ');
  lines.push('    const indent = \'  \'.repeat(depth);');
  lines.push('    const text = n.text.length > 50 ? n.text.substring(0, 50) + \'...\' : n.text;');
  lines.push('    lines.push(`${indent}${prefix}${n.type} (${n.childCount} children) "${text}"`);');
  lines.push('    ');
  lines.push('    for (let i = 0; i < n.childCount; i++) {');
  lines.push('      const child = n.child(i);');
  lines.push('      if (child) {');
  lines.push('        traverse(child, depth + 1, `[${i}] `);');
  lines.push('      }');
  lines.push('    }');
  lines.push('  }');
  lines.push('  ');
  lines.push('  traverse(node, 0, \'\');');
  lines.push('  return lines.join(\'\\n\');');
  lines.push('}');
  lines.push('');
}

// Helper to write formatted TypeScript files
async function writeFormattedFile(filePath: string, content: string, formatter: any): Promise<void> {
  try {
    // formatText is synchronous, not async
    const formatted = formatter.formatText(filePath, content);
    writeFileSync(filePath, formatted || content, 'utf8');
  }
  catch (error) {
    console.warn(`Warning: Failed to format ${filePath}, writing unformatted`, error);
    writeFileSync(filePath, content, 'utf8');
  }
}

(async () => {
  try {
    // Initialize dprint formatter
    console.log('Initializing dprint formatter...');

    // Try to read local dprint config
    let dprintConfig: any = {
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
    };

    const dprintConfigPath = join(__dirname, '../../../dprint.json');
    if (existsSync(dprintConfigPath)) {
      try {
        const configContent = readFileSync(dprintConfigPath, 'utf8');
        dprintConfig = JSON.parse(configContent);
        console.log('Using local dprint.json configuration');
      }
      catch (error) {
        console.warn('Failed to parse dprint.json, using defaults', error);
      }
    }

    // Get TypeScript plugin URL from config or use default
    const tsPluginUrl = dprintConfig.plugins?.find((p: string) => p.includes('typescript'))
      || 'https://plugins.dprint.dev/typescript-0.93.0.wasm';

    const formatter = await createStreaming(fetch(tsPluginUrl));

    // Configure formatter with project settings
    const globalConfig = {
      indentWidth: dprintConfig.typescript?.indentWidth || 2,
      lineWidth: dprintConfig.typescript?.lineWidth || 120,
    };

    formatter.setConfig(globalConfig, dprintConfig.typescript || {});

    // ================================================================
    // ================================================================
    //
    //                           SETUP DIRECTORIES
    //
    // ================================================================
    // ================================================================

    mkdirSync(join(sdkRoot, 'src-generated/nodes'), { recursive: true });
    mkdirSync(join(sdkRoot, 'src-generated/cursor'), { recursive: true });

    // Extract named and anonymous node types
    const namedNodes = nodeTypes.filter((node: NodeType) => node.named === true);
    const anonymousNodes = nodeTypes.filter((node: NodeType) => node.named === false);
    console.log(`Found ${namedNodes.length} named node types`);
    console.log(`Found ${anonymousNodes.length} anonymous node types`);

    // No standalone RuleName - using ${grammarNamespaceExport}.Node['type'] in grammar
    const ruleNames = namedNodes.map((node: NodeType) => node.type).sort();
    console.log(`Found ${ruleNames.length} rule names for Node union type`);

    // ================================================================
    // ================================================================
    //
    //                           GENERATE BASE TYPES
    //
    // ================================================================
    // ================================================================
    const typesFileHeader = JSDoc.buildFileHeader({
      description: 'Type definitions for tree-sitter AST nodes.',
      generated: true,
      doNotEdit: true,
    });

    const nodeReexportJSDoc = JSDoc.buildJSDoc({
      description: [
        'Re-export of Node from web-tree-sitter.',
        '',
        'Note: We chose web-tree-sitter over node-tree-sitter for the following reasons:',
        '- Works in both Node.js and browser environments (via WebAssembly)',
        '- Aligns with our WASM-based distribution model',
        '- Single distribution file (no platform-specific builds)',
        '',
        'Known limitations:',
        '- TypeScript definitions are incomplete compared to node-tree-sitter',
        '- Missing some methods like descendantsOfType in the type definitions',
        '- The actual runtime API is complete, only the types are limited',
      ],
      see: ['https://github.com/tree-sitter/tree-sitter/issues/349'],
    });

    const typesContent = `${typesFileHeader}

${nodeReexportJSDoc}
export type { Node } from 'web-tree-sitter';
`;

    await writeFormattedFile(join(sdkRoot, 'src-generated/types.ts'), typesContent, formatter);
    console.log('Generated src-generated/types.ts');

    // ================================================================
    // ================================================================
    //
    //                           GENERATE NODE FILES
    //
    // ================================================================
    // ================================================================

    for (const node of namedNodes) {
      const nodeFile = generateNodeFile(node as NodeType);
      const fileName = `${node.type}.ts`;
      await writeFormattedFile(join(sdkRoot, 'src-generated/nodes', fileName), nodeFile, formatter);
    }
    console.log(`Generated ${namedNodes.length} node files in src-generated/nodes/`);

    // ================================================================
    // ================================================================
    //
    //                     GENERATE ANONYMOUS NODES FILE
    //
    // ================================================================
    // ================================================================

    // Categorize anonymous nodes using patterns
    const punctuationNodes = anonymousNodes.filter((node: NodeType) =>
      node.type.length === 1 && /^[^a-zA-Z0-9]$/.test(node.type)
    );

    const operatorNodes = anonymousNodes.filter((node: NodeType) =>
      node.type.length > 1 && /^[^a-zA-Z0-9]+$/.test(node.type)
    );

    const keywordNodes = anonymousNodes.filter((node: NodeType) => /^[a-z]+$/.test(node.type));

    const otherNodes = anonymousNodes.filter((node: NodeType) =>
      !punctuationNodes.includes(node as any)
      && !operatorNodes.includes(node as any)
      && !keywordNodes.includes(node as any)
    );

    console.log(`Categorized anonymous nodes:`);
    console.log(`  - ${punctuationNodes.length} punctuation nodes`);
    console.log(`  - ${operatorNodes.length} operator nodes`);
    console.log(`  - ${keywordNodes.length} keyword nodes`);
    console.log(`  - ${otherNodes.length} other nodes`);

    // Generate anonymous nodes file
    const anonymousNodesContent = generateAnonymousNodesFile(
      punctuationNodes.map(n => n.type),
      operatorNodes.map(n => n.type),
      keywordNodes.map(n => n.type),
      otherNodes.map(n => n.type),
    );
    await writeFormattedFile(join(sdkRoot, 'src/anonymous-nodes.ts'), anonymousNodesContent, formatter);
    console.log('Generated src/anonymous-nodes.ts');

    // Generate Layer 1: Utils file
    const utilsContent = generateUtilsFile();
    await writeFormattedFile(join(sdkRoot, 'src/utils.ts'), utilsContent, formatter);
    console.log('Generated src/utils.ts');

    // Generate Layer 2: Accessors file
    const accessorsContent = generateAccessorsFile();
    await writeFormattedFile(join(sdkRoot, 'src/accessors.ts'), accessorsContent, formatter);
    console.log('Generated src/accessors.ts');

    // Generate Layer 3: Extractors file
    const extractorsContent = generateExtractorsFile();
    await writeFormattedFile(join(sdkRoot, 'src/extractors.ts'), extractorsContent, formatter);
    console.log('Generated src/extractors.ts');

    // Generate Layer 4: Metadata file
    const metadataContent = generateMetadataFile();
    await writeFormattedFile(join(sdkRoot, 'src/metadata.ts'), metadataContent, formatter);
    console.log('Generated src/metadata.ts');

    // ================================================================
    // ================================================================
    //
    //                           GENERATE CURSOR SYSTEM
    //
    // ================================================================
    // ================================================================

    // Analyze grammar for cursor generation
    console.log('🎯 Generating type-safe cursor system...');
    const grammarAnalysis = analyzeGrammar(nodeTypes, grammar as any);

    // Setup generator config for cursor system
    const cursorConfig = {
      projectRoot: sdkRoot,
      sdkRoot,
      grammarName,
      grammarNamePascal,
      grammarNamespaceExport,
      formatter,
      outputDir: join(sdkRoot, 'src-generated'),
    };

    // Generate cursor system
    await generateCursorSystem(cursorConfig, grammarAnalysis, DEFAULT_CURSOR_CONFIG);
    console.log('✅ Type-safe cursor navigation system generated successfully');

    // ================================================================
    // ================================================================
    //
    //                           GENERATE NODE NAMESPACE FILES
    //
    // ================================================================
    // ================================================================

    // Detect semantic groupings first
    const semanticGroupings = detectSemanticGroupings(grammar.rules);

    // Create node directory
    const nodeDir = join(sdkRoot, 'src/node');
    const nodeGroupDir = join(nodeDir, 'group');
    await fs.promises.mkdir(nodeDir, { recursive: true });
    await fs.promises.mkdir(nodeGroupDir, { recursive: true });

    // Generate node/$$.ts with all node exports
    const nodeBarrelLines = [
      '// Auto-generated from parser/src/node-types.json',
      '// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts',
      '',
    ];

    // Re-export all node types
    nodeBarrelLines.push('// Re-export all node types');
    ruleNames.forEach(type => {
      nodeBarrelLines.push(`export type { ${TS.getNodeInterfaceName(type)} } from '../nodes/${type}.js';`);
      nodeBarrelLines.push(`export { ${TS.getTypeGuardName(type)} } from '../nodes/${type}.js';`);
    });

    // Re-export anonymous nodes
    nodeBarrelLines.push('');
    nodeBarrelLines.push('// Re-export anonymous node types');
    nodeBarrelLines.push(`export type {`);
    nodeBarrelLines.push(`  AnonymousNode,`);
    nodeBarrelLines.push(`  Punctuation,`);
    nodeBarrelLines.push(`  Operator,`);
    nodeBarrelLines.push(`  Keyword,`);
    nodeBarrelLines.push(`  OtherAnonymous,`);
    nodeBarrelLines.push(`  PunctuationType,`);
    nodeBarrelLines.push(`  OperatorType,`);
    nodeBarrelLines.push(`  KeywordType,`);
    nodeBarrelLines.push(`  OtherAnonymousType`);
    nodeBarrelLines.push(`} from '../anonymous-nodes.js';`);
    nodeBarrelLines.push('');
    nodeBarrelLines.push(`export {`);
    nodeBarrelLines.push(`  isAnonymousNode,`);
    nodeBarrelLines.push(`  isPunctuation,`);
    nodeBarrelLines.push(`  isOperator,`);
    nodeBarrelLines.push(`  isKeyword,`);
    nodeBarrelLines.push(`  isOtherAnonymous,`);
    nodeBarrelLines.push(`  punctuationTypes,`);
    nodeBarrelLines.push(`  operatorTypes,`);
    nodeBarrelLines.push(`  keywordTypes,`);
    nodeBarrelLines.push(`  otherAnonymousTypes`);
    nodeBarrelLines.push(`} from '../anonymous-nodes.js';`);

    await writeFormattedFile(join(nodeDir, '$$.ts'), nodeBarrelLines.join('\n'), formatter);
    console.log('Generated src/node/$$.ts');

    // Generate node/$.ts with namespace re-export
    const nodeNamespaceContent = `/**
 * Node types and type guards for ${grammarName} AST.
 *
 * This namespace provides access to all ${grammarName} AST node types and type guards.
 *
 * @example
 * \`\`\`typescript
 * import { Node } from '../$$.js';
 *
 * // Use specific node types
 * const field: Node.Field = ...;
 *
 * // Use type guards
 * if (Node.isField(node)) {
 *   // node is now typed as Field
 * }
 *
 * // Use semantic groups
 * if (Node.Group.isValue(node)) {
 *   // node is now typed as Value union
 * }
 * \`\`\`
 */
export * from './$$.js';
${semanticGroupings.size > 0 ? 'export * as Group from \'./group/$.js\';' : ''}
`;

    await writeFormattedFile(join(nodeDir, '$.ts'), nodeNamespaceContent, formatter);
    console.log('Generated src/node/$.ts');

    // Generate node/group/$$.ts with all group exports
    if (semanticGroupings.size > 0) {
      const groupBarrelLines = [
        '// Auto-generated from parser/src/node-types.json',
        '// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts',
        '',
        '// Import node types for unions',
      ];

      // Import all needed node types - need ALL types for Named union
      const allMemberNames = new Set<string>();

      // Add all types used in semantic groups
      for (const memberNames of semanticGroupings.values()) {
        memberNames.forEach(name => allMemberNames.add(name));
      }

      // Add ALL rule names for Named union
      ruleNames.forEach(name => allMemberNames.add(name));

      // Import with aliases to avoid conflicts
      groupBarrelLines.push('import type {');
      Array.from(allMemberNames).sort().forEach(name => {
        const nodeName = TS.getNodeInterfaceName(name);
        groupBarrelLines.push(`  ${nodeName} as _${nodeName},`);
      });
      groupBarrelLines.push('} from \'../$$.js\';');

      groupBarrelLines.push('');
      groupBarrelLines.push('// Import type guards');
      groupBarrelLines.push('import {');
      Array.from(allMemberNames).sort().forEach(name => {
        const guardName = TS.getTypeGuardName(name);
        groupBarrelLines.push(`  ${guardName} as _${guardName},`);
      });
      groupBarrelLines.push('} from \'../$$.js\';');

      // Generate union types for each grouping
      for (const [groupName, memberNames] of semanticGroupings) {
        const groupNamePascal = TS.toPascalCase(groupName);
        const memberTypes = memberNames.map(name => '_' + TS.getNodeInterfaceName(name)).join(' | ');

        groupBarrelLines.push('');
        groupBarrelLines.push(`/**`);
        groupBarrelLines.push(` * Union type for ${groupName} nodes.`);
        groupBarrelLines.push(` * Members: ${memberNames.join(', ')}`);
        groupBarrelLines.push(` */`);
        groupBarrelLines.push(`export type ${groupNamePascal} = ${memberTypes};`);
      }

      // Generate type guards for each grouping
      groupBarrelLines.push('');
      groupBarrelLines.push('// Type guards for semantic groups');
      for (const [groupName, memberNames] of semanticGroupings) {
        const groupNamePascal = TS.toPascalCase(groupName);
        const guardName = `is${groupNamePascal}`;
        const memberChecks = memberNames.map(name => `_${TS.getTypeGuardName(name)}(node)`).join(' || ');

        // Improved JSDoc that lists all member types
        const memberTypesList = memberNames.map(name => TS.getNodeInterfaceName(name)).join(', ');

        groupBarrelLines.push('');
        groupBarrelLines.push(`/**`);
        groupBarrelLines.push(` * Type guard to check if a node is a ${groupName} node.`);
        groupBarrelLines.push(` * `);
        groupBarrelLines.push(` * Returns true if the node is one of: ${memberTypesList}`);
        groupBarrelLines.push(` * `);
        groupBarrelLines.push(` * @param node - The node to check`);
        groupBarrelLines.push(` * @returns True if the node is a ${groupName} node`);
        groupBarrelLines.push(` */`);
        groupBarrelLines.push(`export function ${guardName}(node: unknown): node is ${groupNamePascal} {`);
        groupBarrelLines.push(`  return ${memberChecks};`);
        groupBarrelLines.push(`}`);
      }

      // Add Named, Anonymous, and Any groups
      groupBarrelLines.push('');
      groupBarrelLines.push('// Core node categorization groups');
      groupBarrelLines.push('');

      // Import all node types for Named union
      groupBarrelLines.push('/**');
      groupBarrelLines.push(' * Union type for all named nodes (non-anonymous nodes).');
      groupBarrelLines.push(' * These are the nodes that can be used as grammar rules.');
      groupBarrelLines.push(' */');
      groupBarrelLines.push('export type Named =');
      ruleNames.forEach((type, index) => {
        const nodeName = TS.getNodeInterfaceName(type);
        const separator = index === 0 ? ' ' : '| ';
        groupBarrelLines.push(`  ${separator}_${nodeName}`);
      });
      groupBarrelLines.push(';');
      groupBarrelLines.push('');

      // Anonymous union type
      groupBarrelLines.push('/**');
      groupBarrelLines.push(' * Union type for all anonymous nodes.');
      groupBarrelLines.push(' * These include punctuation, operators, keywords, and other tokens.');
      groupBarrelLines.push(' */');
      groupBarrelLines.push('export type Anonymous = import(\'../../anonymous-nodes.js\').AnonymousNode;');
      groupBarrelLines.push('');

      // Any union type
      groupBarrelLines.push('/**');
      groupBarrelLines.push(' * Union type of all AST nodes.');
      groupBarrelLines.push(' * This type represents any possible node in the syntax tree.');
      groupBarrelLines.push(' */');
      groupBarrelLines.push('export type Any = Named | Anonymous;');
      groupBarrelLines.push('');

      // Type guards for core groups
      groupBarrelLines.push('/**');
      groupBarrelLines.push(' * Type guard to check if a node is a named (non-anonymous) node.');
      groupBarrelLines.push(' * ');
      groupBarrelLines.push(' * @param node - The node to check');
      groupBarrelLines.push(' * @returns True if the node is a named node');
      groupBarrelLines.push(' */');
      groupBarrelLines.push('export function isNamed(node: unknown): node is Named {');
      groupBarrelLines.push(
        '  return node != null && typeof node === \'object\' && \'type\' in node && node.type !== undefined && (',
      );
      // Generate checks for all named node types
      const namedChecks = ruleNames.map(type => `_${TS.getTypeGuardName(type)}(node)`);
      for (let i = 0; i < namedChecks.length; i += 5) {
        const chunk = namedChecks.slice(i, i + 5).join(' || ');
        groupBarrelLines.push(`    ${chunk}${i + 5 < namedChecks.length ? ' ||' : ''}`);
      }
      groupBarrelLines.push('  );');
      groupBarrelLines.push('}');
      groupBarrelLines.push('');

      groupBarrelLines.push('/**');
      groupBarrelLines.push(' * Type guard to check if a node is an anonymous node.');
      groupBarrelLines.push(' * ');
      groupBarrelLines.push(' * @param node - The node to check');
      groupBarrelLines.push(' * @returns True if the node is an anonymous node');
      groupBarrelLines.push(' */');
      groupBarrelLines.push('export function isAnonymous(node: unknown): node is Anonymous {');
      groupBarrelLines.push('  // Import the function at the top of the file');
      groupBarrelLines.push(
        '  return node != null && typeof node === \'object\' && \'type\' in node && !isNamed(node);',
      );
      groupBarrelLines.push('}');

      await writeFormattedFile(join(nodeGroupDir, '$$.ts'), groupBarrelLines.join('\n'), formatter);
      console.log('Generated src/node/group/$$.ts');

      // Generate node/group/$.ts with namespace re-export
      const groupNamespaceContent = `/**
 * Semantic groupings of nodes based on grammar CHOICE rules.
 * These represent higher-level semantic categories defined in the grammar.
 *
 * @example
 * \`\`\`typescript
 * import { Node } from '../../$$.js';
 *
 * // Check if a node is a value node
 * if (Node.Group.isValue(node)) {
 *   // node is now typed as Value union
 * }
 * \`\`\`
 */
export * from './$$.js';
`;

      await writeFormattedFile(join(nodeGroupDir, '$.ts'), groupNamespaceContent, formatter);
      console.log('Generated src/node/group/$.ts');
    }

    // ================================================================
    // ================================================================
    //
    //                           GENERATE MAIN BARREL EXPORT
    //
    // ================================================================
    // ================================================================
    const mainBarrelLines = [
      JSDoc.buildFileHeader({
        description: `Tree-sitter ${grammarName} grammar library exports.`,
        generated: true,
        doNotEdit: true,
      }),
      '',
    ];

    // Generate namespace aliases for invalid TypeScript identifiers
    const aliases = ruleNames
      .map(type => TS.generateNamespaceAlias(type))
      .filter((alias): alias is string => alias !== null);

    if (aliases.length > 0) {
      mainBarrelLines.push('');
      mainBarrelLines.push('// Namespace aliases for invalid TypeScript identifiers');
      aliases.forEach(alias => mainBarrelLines.push(alias));
    }

    // Export 4-layer architecture
    mainBarrelLines.push('');
    mainBarrelLines.push('// Export 4-layer architecture');
    mainBarrelLines.push('');
    mainBarrelLines.push('// Layer 1: Generic Tree Utilities');
    mainBarrelLines.push(`export * as Utils from './utils.js';`);
    mainBarrelLines.push('');
    mainBarrelLines.push('// Layer 2: Position-Optimized Accessors');
    mainBarrelLines.push(`export * as Accessors from './accessors.js';`);
    mainBarrelLines.push('');
    mainBarrelLines.push('// Layer 3: Composite Extractors');
    mainBarrelLines.push(`export * as Extractors from './extractors.js';`);
    mainBarrelLines.push('');
    mainBarrelLines.push('// Layer 4: Structure Metadata');
    mainBarrelLines.push(`export * as Metadata from './metadata.js';`);
    mainBarrelLines.push('');
    mainBarrelLines.push('// Type-safe cursor navigation system');
    mainBarrelLines.push(`export * as Cursor from './cursor/$.js';`);

    // Export Node namespace using ESM namespace import
    mainBarrelLines.push('');
    mainBarrelLines.push(JSDoc.buildJSDoc({
      description: [
        `Namespace containing all ${grammarName} AST node types and type guards.`,
        'This provides a cleaner API by grouping all node-related exports.',
      ],
    }));
    mainBarrelLines.push('export * as Node from \'./node/$.js\';');

    await writeFormattedFile(join(sdkRoot, 'src/$$.ts'), mainBarrelLines.join('\n'), formatter);
    console.log('Generated src/$$.ts');

    // ================================================================
    // ================================================================
    //
    //                           GENERATE NAMESPACE FILE
    //
    // ================================================================
    // ================================================================
    const namespaceJSDoc = JSDoc.buildJSDoc({
      description: [
        `Tree-sitter ${grammarName} AST nodes namespace.`,
        '',
        `This namespace provides access to all ${grammarName} AST node types, type guards,`,
        'and constructor functions generated from the tree-sitter grammar.',
      ],
      examples: [{
        code: [
          `import { ${grammarNamespaceExport} } from './src/nodes/$.js';`,
          '',
          '// Access the union type of all nodes',
          `type AnyNode = ${grammarNamespaceExport}.Node;`,
          '',
          '// Use specific node types',
          `const node: ${grammarNamespaceExport}.NameNode = ...;`,
          '',
          '// Use type guards',
          `if (${grammarNamespaceExport}.isNameNode(node)) {`,
          '  // node is now typed as NameNode',
          '}',
        ],
      }],
    });

    const namespaceContent = `${namespaceJSDoc}
export * as ${grammarNamespaceExport} from './$$.js';
`;

    await writeFormattedFile(join(sdkRoot, 'src/$.ts'), namespaceContent, formatter);
    console.log('Generated src/$.ts');

    console.log('✅ Successfully generated all grammar types!');
  }
  catch (error) {
    console.error('Error generating grammar types:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
