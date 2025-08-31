/**
 * Core generator implementation - pure functions working with in-memory data
 */

import { Grammar } from '@treant/grammar';
import { getNodeInterfaceName, getTypeGuardName } from './generators/type-helpers.js';
import * as TS from './lib/ts-syntax/$$.js';

// Import cursor generation system
import { type CursorGeneratorConfig, DEFAULT_CURSOR_CONFIG, generateCursorSystem } from './generators/cursor.js';

export interface GenerateOptions extends Grammar.BuiltGrammar {
  nameOverride?: string;
}

/**
 * Generated file content
 */
export interface GeneratedFile {
  path: string;
  content: string | Uint8Array; // Support binary content for WASM
}

/**
 * Generator output
 */
export interface GeneratorOutput {
  files: GeneratedFile[];
}

/**
 * Main generator function - pure, works with in-memory data
 */
export async function generate(options: GenerateOptions): Promise<GeneratorOutput> {
  const { grammar: grammarJson, nodeTypes, nameOverride, wasm } = options;

  // Extract grammar name
  const grammarName = grammarJson.name;
  const grammarNamePascal = nameOverride || (grammarName === 'graphql' ? 'GraphQL' : TS.toPascalCase(grammarName));
  const grammarNamespaceExport = `TreeSitter${grammarNamePascal}`;

  // Extract node types
  const namedNodes = nodeTypes.filter(node => node.named === true);
  const anonymousNodes = nodeTypes.filter(node => node.named === false);

  const files: GeneratedFile[] = [];

  // Generate node files with pattern-based navigators
  for (const node of namedNodes) {
    const nodeFile = generateEnhancedNodeFile(node, grammarJson, grammarName, grammarNamePascal);
    files.push({
      path: `nodes/${node.type}.ts`,
      content: nodeFile,
    });
  }

  // Generate anonymous node files for all anonymous nodes
  for (const node of anonymousNodes) {
    const nodeFile = generateAnonymousNodeFile(node, grammarName);
    files.push({
      path: `nodes/anonymous/${node.type}.ts`,
      content: nodeFile,
    });
  }

  // Generate anonymous nodes barrel file
  if (anonymousNodes.length > 0) {
    files.push({
      path: 'nodes/anonymous/$$.ts',
      content: generateAnonymousBarrelFile(anonymousNodes),
    });
    files.push({
      path: 'nodes/anonymous/$.ts',
      content: '/**\n * Anonymous node types namespace\n * @generated\n */\n\nexport * from \'./$$.js\';',
    });
  }

  // Generate types.ts
  files.push({
    path: 'types.ts',
    content: generateTypesFile(),
  });

  // Generate utils.ts
  files.push({
    path: 'utils.ts',
    content: generateUtilsFile(nodeTypes, grammarName),
  });

  // Generate node namespace with type guards (in nodes directory)
  files.push({
    path: 'nodes/$$.ts',
    content: generateNodeBarrelFile(namedNodes, anonymousNodes.length > 0),
  });
  files.push({
    path: 'nodes/$.ts',
    content: '/**\n * Node type guards namespace\n * @generated\n */\n\nexport * from \'./$$.js\';',
  });

  // Generate anonymous-nodes.ts
  files.push({
    path: 'anonymous-nodes.ts',
    content: generateAnonymousNodesFile(anonymousNodes as Grammar.NodeType[], grammarName),
  });

  // Generate errors
  files.push({
    path: 'errors/$$.ts',
    content: generateErrorsBarrelFile(),
  });
  files.push({
    path: 'errors/$.ts',
    content: '/**\n * Errors namespace export\n * @generated\n */\n\nexport * from \'./$$.js\';',
  });
  files.push({
    path: 'errors/navigation-expectation-error.ts',
    content: generateNavigationExpectationErrorFile(),
  });

  // Generate cursor system
  const grammarAnalysis = Grammar.Analysis.analyzeGrammar(nodeTypes as Grammar.NodeType[], grammarJson);
  const cursorFiles = await generateCursorSystemFiles(grammarAnalysis, DEFAULT_CURSOR_CONFIG);
  files.push(...cursorFiles);

  // Generate parser files
  files.push({
    path: 'parser/parser.ts',
    content: generateParserFile(grammarName, grammarNamePascal),
  });
  files.push({
    path: 'parser/$$.ts',
    content: '/**\n * Parser system barrel exports\n * @generated\n */\n\nexport * from \'./parser.js\';',
  });
  files.push({
    path: 'parser/$.ts',
    content: '/**\n * Parser system namespace export\n * @generated\n */\n\nexport * from \'./$$.js\';',
  });
  
  // Generate navigator files
  files.push({
    path: 'navigator/navigator.ts',
    content: generateNavigatorFile(grammarName, grammarNamePascal, nodeTypes as Grammar.NodeType[], anonymousNodes as Grammar.NodeType[]),
  });
  files.push({
    path: 'navigator/$$.ts',
    content: '/**\n * Navigator system barrel exports\n * @generated\n */\n\nexport * from \'./navigator.js\';',
  });
  files.push({
    path: 'navigator/$.ts',
    content: '/**\n * Navigator system namespace export\n * @generated\n */\n\nexport * from \'./$$.js\';',
  });

  // Generate namespace export files
  // Generate $$.ts (barrel export)
  files.push({
    path: '$$.ts',
    content: generateBarrelExportFile(namedNodes, grammarNamePascal),
  });

  // Generate $.ts (namespace export)
  files.push({
    path: '$.ts',
    content: generateNamespaceExportFile(grammarNamespaceExport),
  });

  // Add grammar artifacts for debugging
  files.push({
    path: '__artifacts__/grammar.json',
    content: JSON.stringify(grammarJson, null, 2),
  });

  files.push({
    path: '__artifacts__/node-types.json',
    content: JSON.stringify(nodeTypes, null, 2),
  });

  // If WASM is provided, add it to artifacts
  if (wasm) {
    if (typeof wasm === 'string') {
      // If it's a path, read the file
      const fs = await import('node:fs/promises');
      const wasmBuffer = await fs.readFile(wasm);
      files.push({
        path: '__artifacts__/parser.wasm',
        content: wasmBuffer,
      });
    }
    else {
      // It's already a buffer
      files.push({
        path: '__artifacts__/parser.wasm',
        content: wasm,
      });
    }
  }

  return { files };
}

/**
 * Emit SDK files to disk
 */
export async function emit(sdk: GeneratorOutput, outputDir: string): Promise<void> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  
  for (const file of sdk.files) {
    const filePath = path.join(outputDir, file.path);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.content);
  }
}

/**
 * Generate cursor system files
 */
async function generateCursorSystemFiles(
  analysis: Grammar.Analysis.GrammarAnalysis,
  cursorConfig = DEFAULT_CURSOR_CONFIG,
): Promise<GeneratedFile[]> {
  const { generateCursorMaps } = await import('./generators/maps.js');
  const { generateCursorConditionals } = await import('./generators/conditionals.js');

  const files: GeneratedFile[] = [];

  // Generate cursor position maps
  const mapsContent = await generateCursorMaps(analysis, cursorConfig);
  files.push({
    path: 'cursor/maps.ts',
    content: '/**\n * Cursor position maps for type-safe navigation\n * @generated\n */\n\n' + mapsContent,
  });

  // Generate conditional return types
  const conditionalsContent = await generateCursorConditionals(analysis, cursorConfig);
  files.push({
    path: 'cursor/conditionals.ts',
    content: '/**\n * Exhaustive conditional return types for cursor navigation\n * @generated\n */\n\n'
      + conditionalsContent,
  });

  // Generate main cursor interface
  const cursorContent = generateMainCursorInterface(analysis, cursorConfig);
  files.push({
    path: 'cursor/cursor.ts',
    content: '/**\n * Type-safe cursor interface with exhaustive navigation\n * @generated\n */\n\n' + cursorContent,
  });

  // Generate cursor barrel export ($$)
  const cursorBarrelExports = generateCursorBarrelExports(cursorConfig);
  files.push({
    path: 'cursor/$$.ts',
    content: '/**\n * Cursor navigation system barrel exports\n * @generated\n */\n\n' + cursorBarrelExports,
  });

  // Generate cursor namespace export ($)
  const cursorNamespaceExport = generateCursorNamespaceExport(cursorConfig);
  files.push({
    path: 'cursor/$.ts',
    content: '/**\n * Cursor navigation system namespace export\n * @generated\n */\n\n' + cursorNamespaceExport,
  });

  return files;
}

/**
 * Generate the main cursor interface with type-safe navigation methods
 */
function generateMainCursorInterface(
  analysis: Grammar.Analysis.GrammarAnalysis,
  config: { maxDepth: number; namespace: string },
): string {
  const lines: string[] = [];

  // Import required types
  lines.push('import type { TreeCursor as WebTreeSitterCursor, Tree, Node, Point } from \'web-tree-sitter\';');
  lines.push('import type { CursorConditionals } from \'./conditionals.js\';');
  lines.push('');

  // Generate TreeCursor interface with chaining
  lines.push('/**');
  lines.push(' * Type-safe cursor with chaining navigation and type flow.');
  lines.push(' * Each navigation method returns a new cursor with updated position type,');
  lines.push(' * enabling fluent chaining with compile-time type safety.');
  lines.push(' */');
  lines.push('export interface TreeCursor<$Position extends string = string> {');
  lines.push('  // Navigation methods return new cursor with updated type parameter');
  lines.push('  gotoFirstChild(): CursorConditionals.GotoFirstChild<$Position>;');
  lines.push('  gotoNextSibling(): CursorConditionals.GotoNextSibling<$Position>;');
  lines.push('  gotoPreviousSibling(): CursorConditionals.GotoPreviousSibling<$Position>;');
  lines.push('  gotoParent(): CursorConditionals.GotoParent<$Position>;');
  lines.push('');
  lines.push('  // Access to underlying TreeCursor instance');
  lines.push('  readonly raw: WebTreeSitterCursor;');
  lines.push('');
  lines.push('  // Convenience properties');
  lines.push('  readonly node: Node;');
  lines.push('  readonly nodeType: $Position;');
  lines.push('}');

  return lines.join('\n');
}

/**
 * Generate cursor barrel exports
 */
function generateCursorBarrelExports(config: { namespace: string }): string {
  return `export * from './cursor.js';
export * from './conditionals.js';
export * from './maps.js';`;
}

/**
 * Generate cursor namespace export
 */
function generateCursorNamespaceExport(config: { namespace: string }): string {
  return `export * as ${config.namespace} from './$$.js';`;
}

// Helper functions for generating different file types

function generateAnonymousNodeFile(node: Grammar.NodeType, grammarName: string): string {
  const nodeName = TS.toPascalCase(node.type);
  const typeGuardName = `is${nodeName}`;
  const lines: string[] = [];
  
  lines.push('import type { Node } from \'web-tree-sitter\';');
  lines.push('');
  lines.push(`const TYPE = '${node.type}' as const;`);
  lines.push('');
  
  // Interface
  lines.push(`/**`);
  lines.push(` * Represents the anonymous '${node.type}' node in the ${grammarName} AST.`);
  lines.push(` */`);
  lines.push(`export interface ${nodeName} extends Node {`);
  lines.push(`  type: typeof TYPE;`);
  lines.push(`  isNamed: false;`);
  lines.push('}');
  lines.push('');
  
  // Type guard
  lines.push(`/**`);
  lines.push(` * Type guard to check if a node is a '${node.type}' anonymous node.`);
  lines.push(` */`);
  lines.push(`export function ${typeGuardName}(node: Node | null | undefined): node is ${nodeName} {`);
  lines.push(`  return node?.type === TYPE && !node.isNamed;`);
  lines.push('}');
  
  return lines.join('\n');
}

function generateAnonymousBarrelFile(anonymousNodes: readonly Grammar.NodeType[]): string {
  const lines: string[] = [];
  
  lines.push('/**');
  lines.push(' * Anonymous node types and type guards');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('');
  
  anonymousNodes.forEach(node => {
    const nodeName = TS.toPascalCase(node.type);
    const guardName = `is${nodeName}`;
    
    // Export the interface and type guard
    lines.push(`export type { ${nodeName} } from './${node.type}.js';`);
    lines.push(`export { ${guardName} } from './${node.type}.js';`);
  });
  
  return lines.join('\n');
}

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

// Enhanced node file generator with pattern-based navigators
function generateEnhancedNodeFile(
  node: Grammar.NodeType,
  grammarJson: Grammar.GrammarJson,
  grammarName: string,
  grammarNamePascal: string,
): string {
  // TODO: Re-enable pattern-based navigators when seq pattern is properly imported
  // For now, just generate basic node file
  return generateNodeFile(node, grammarName, grammarNamePascal);
}

function generateTypesFile(): string {
  return `/**
 * Type definitions for tree-sitter AST nodes.
 * @generated
 */

export type { Node } from 'web-tree-sitter';
`;
}

function generateUtilsFile(nodeTypes: readonly Grammar.NodeType[], grammarName: string): string {
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

function generateAnonymousNodesFile(anonymousNodes: readonly Grammar.NodeType[], grammarName: string): string {
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

function generateBarrelExportFile(namedNodes: readonly Grammar.NodeType[], grammarNamePascal: string): string {
  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * Generated ${grammarNamePascal} SDK`);
  lines.push(` * @generated`);
  lines.push(` */`);
  lines.push('');

  // Export root utilities
  lines.push('// Root utilities');
  lines.push(`export * from './types.js';`);
  lines.push(`export * from './utils.js';`);
  lines.push(`export * from './anonymous-nodes.js';`);
  lines.push('');

  // Export cursor system namespace
  lines.push('// Cursor system');
  lines.push(`export * as Cursor from './cursor/$.js';`);
  lines.push('');

  // Export parser namespace
  lines.push('// Parser system');
  lines.push(`export * as Parser from './parser/$.js';`);
  lines.push('');
  
  // Export navigator namespace
  lines.push('// Navigator system');
  lines.push(`export * as Navigator from './navigator/$.js';`);
  lines.push('');

  // Export node namespace (includes both type guards and interfaces)
  lines.push('// Node type guards and interfaces');
  lines.push(`export * as Node from './nodes/$.js';`);
  lines.push('');
  
  // Export errors namespace
  lines.push('// Error types');
  lines.push(`export * as Errors from './errors/$.js';`);

  return lines.join('\n');
}

function generateNodeBarrelFile(namedNodes: readonly Grammar.NodeType[], hasAnonymousNodes: boolean): string {
  const lines: string[] = [];

  lines.push('/**');
  lines.push(' * Node type guards and utilities');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('');
  
  // Export Node class from web-tree-sitter (both as type and value)
  lines.push('export { Node } from \'web-tree-sitter\';');
  lines.push('');
  
  // Export Anonymous namespace if we have anonymous nodes
  if (hasAnonymousNodes) {
    lines.push('// Anonymous node types');
    lines.push('export * as Anonymous from \'./anonymous/$.js\';');
    lines.push('');
  }

  // Re-export all type guards from node files (now in same directory)
  namedNodes.forEach(node => {
    const interfaceName = getNodeInterfaceName(node.type);
    const guardName = getTypeGuardName(node.type);
    
    // Export the node interface with simplified name (e.g., SourceFileNode as SourceFile)
    const simplifiedName = TS.toPascalCase(node.type);
    lines.push(`export type { ${interfaceName} as ${simplifiedName} } from './${node.type}.js';`);
    
    // Export the type guard
    lines.push(`export { ${guardName} } from './${node.type}.js';`);

    // Also create shorter aliases without 'Node' suffix
    const shortName = `is${TS.toPascalCase(node.type)}`;
    if (shortName !== guardName) {
      lines.push(`export { ${guardName} as ${shortName} } from './${node.type}.js';`);
    }
  });

  return lines.join('\n');
}

function generateNamespaceExportFile(grammarNamespaceExport: string): string {
  return `/**
 * Namespace export for ${grammarNamespaceExport}
 * @generated
 */

export * as ${grammarNamespaceExport} from './$$.js';
`;
}

function generateNavigationExpectationErrorFile(): string {
  return `/**
 * Navigation expectation error
 * @generated
 */

export interface NavigationErrorContext {
  expectedNodeType: string;
  actualNodeType: string | null;
  path?: string[];
  searchText?: string;
}

export class NavigationExpectationError extends Error {
  public readonly context: NavigationErrorContext;

  constructor(message: string, context: NavigationErrorContext) {
    super(message);
    this.name = 'NavigationExpectationError';
    this.context = context;
  }
}
`;
}

function generateErrorsBarrelFile(): string {
  return `/**
 * Error types and utilities
 * @generated
 */

export { NavigationExpectationError } from './navigation-expectation-error.js';
export type { NavigationErrorContext } from './navigation-expectation-error.js';
`;
}

function generateNavigatorFile(
  grammarName: string, 
  grammarNamePascal: string,
  nodeTypes: readonly Grammar.NodeType[],
  anonymousNodes: readonly Grammar.NodeType[]
): string {
  const lines: string[] = [];
  
  lines.push('/**');
  lines.push(` * Navigator utilities for ${grammarName}`);
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('');
  lines.push('import type { Tree, Node } from \'web-tree-sitter\';');
  lines.push('import { NavigationExpectationError } from \'../errors/navigation-expectation-error.js\';');
  
  // Import node types
  const namedNodes = nodeTypes.filter(n => n.named);
  namedNodes.forEach(node => {
    lines.push(`import type { ${getNodeInterfaceName(node.type)} } from '../nodes/${node.type}.js';`);
  });
  
  // Import anonymous node types if they exist
  const literalNodes = anonymousNodes; // Use all anonymous nodes, not just single letters
  if (literalNodes.length > 0) {
    literalNodes.forEach(node => {
      lines.push(`import type { ${TS.toPascalCase(node.type)} } from '../nodes/anonymous/${node.type}.js';`);
    });
  }
  
  lines.push('');
  
  // Generate base Navigator interface
  lines.push('export interface Navigator<N extends Node = Node> {');
  lines.push('  node: N;');
  lines.push('  text: string;');
  lines.push('  path: string[];');
  lines.push('  child(index?: number): Navigator | null;');
  lines.push('}');
  lines.push('');
  
  const sourceFile = namedNodes.find(n => n.type === 'source_file');
  const keywordNode = namedNodes.find(n => n.type === 'keyword');
  
  // Generate SourceFileNavigator interface
  if (sourceFile) {
    lines.push('export interface SourceFileNavigator {');
    lines.push('  node: SourceFileNode;');
    lines.push('  text: string;');
    lines.push('  path: string[];');
    
    // Check if source_file has exactly one required child
    const hasSingleChild = sourceFile.children?.required && 
                          sourceFile.children?.multiple === false &&
                          sourceFile.children?.types?.length === 1;
    
    if (hasSingleChild && keywordNode && sourceFile.children?.types?.[0]?.type === 'keyword') {
      // Single keyword child - no parameters in type, returns KeywordNavigator
      lines.push('  child(): KeywordNavigator;');
    } else {
      // Multiple or optional children
      lines.push('  child(index?: number): Navigator | null;');
    }
    
    // Add keyword method if we have keyword node
    if (keywordNode && sourceFile) {
      // Check if keyword is required in source_file
      const isRequired = sourceFile.children?.required && 
                         sourceFile.children?.multiple === false &&
                         sourceFile.children?.types?.length === 1 &&
                         sourceFile.children?.types?.[0]?.type === 'keyword';
      
      if (isRequired) {
        lines.push('  keyword(): KeywordNavigator;');
      } else {
        lines.push('  keyword(): KeywordNavigator | null;');
        lines.push('  keywordOrThrow(): KeywordNavigator;');
      }
    }
    
    lines.push('}');
    lines.push('');
  }
  
  // Generate KeywordNavigator interface if we have keyword node and literals
  if (keywordNode && literalNodes && literalNodes.length > 0) {
    lines.push('export interface KeywordNavigator {');
    lines.push('  node: KeywordNode;');
    lines.push('  text: string;');
    lines.push('  path: string[];');
    
    // Keyword has exactly one child (the choice), no parameters needed
    const anonymousTypes = literalNodes.map(n => TS.toPascalCase(n.type)).join(' | ');
    lines.push(`  child(): ${anonymousTypes};`);
    
    // Add choice() method that returns the first anonymous child
    lines.push(`  choice(): ${anonymousTypes};`);
    
    // Add methods for anonymous literal nodes
    literalNodes.forEach(node => {
      const anonymousTypeName = TS.toPascalCase(node.type);
      lines.push(`  ${node.type}(): ${anonymousTypeName} | null;`);
      lines.push(`  ${node.type}OrThrow(): ${anonymousTypeName};`);
    });
    
    lines.push('}');
    lines.push('');
  }
  
  lines.push('/**');
  lines.push(' * Create a navigator from a tree (always returns the root source_file node)');
  lines.push(' */');
  if (sourceFile) {
    lines.push('export async function create(tree: Tree, path: string[] = []): Promise<SourceFileNavigator> {');
  } else {
    lines.push('export async function create(tree: Tree, path: string[] = []): Promise<Navigator<SourceFileNode>> {');
  }
  lines.push('  const rootNode = tree.rootNode as SourceFileNode;');
  lines.push('  return createSourceFileNavigator(rootNode, path);');
  lines.push('}');
  lines.push('');
  
  // Generate createSourceFileNavigator function
  if (sourceFile) {
    lines.push('function createSourceFileNavigator(node: SourceFileNode, path: string[]): SourceFileNavigator {');
  } else {
    lines.push('function createSourceFileNavigator(node: SourceFileNode, path: string[]): Navigator<SourceFileNode> {');
  }
  lines.push('  return {');
  lines.push('    node,');
  lines.push('    text: node.text,');
  lines.push('    path,');
  
  // Add child method if source_file has children
  if (sourceFile && sourceFile.children) {
    // Check if source_file has exactly one required child
    const hasSingleChild = sourceFile.children?.required && 
                          sourceFile.children?.multiple === false &&
                          sourceFile.children?.types?.length === 1;
    
    if (hasSingleChild && keywordNode && sourceFile.children?.types?.[0]?.type === 'keyword') {
      // Single keyword child - optional index must be 0, returns KeywordNavigator
      lines.push('    child(index = 0) {');
      lines.push('      const childNode = node.firstChild as KeywordNode;');
      lines.push('      const childPath = [...path, \'child(0)\'];');
      lines.push('      return createKeywordNavigator(childNode, childPath);');
      lines.push('    },');
    } else {
      // Multiple or optional children
      lines.push('    child(index = 0) {');
      lines.push('      const childNode = node.children[index];');
      lines.push('      if (childNode) {');
      lines.push('        const childPath = [...path, `child(${index})`];');
      lines.push('        return createNavigator(childNode, childPath);');
      lines.push('      }');
      lines.push('      return null;');
      lines.push('    },');
    }
  }
  
  // Add keyword() method if we have keyword node
  if (keywordNode && sourceFile) {
    // Check if keyword is required in source_file
    const isRequired = sourceFile.children?.required && 
                       sourceFile.children?.multiple === false &&
                       sourceFile.children?.types?.length === 1 &&
                       sourceFile.children?.types?.[0]?.type === 'keyword';
    
    if (isRequired) {
      // Keyword is required, so we can assert it exists
      lines.push('    keyword() {');
      lines.push('      const child = node.firstChild as KeywordNode;');
      lines.push('      const keywordPath = [...path, \'keyword()\'];');
      lines.push('      return createKeywordNavigator(child, keywordPath);');
      lines.push('    },');
    } else {
      // Keyword is optional
      lines.push('    keyword() {');
      lines.push('      const child = node.firstChild;');
      lines.push('      if (child && child.type === \'keyword\') {');
      lines.push('        const keywordPath = [...path, \'keyword()\'];');
      lines.push('        return createKeywordNavigator(child as KeywordNode, keywordPath);');
      lines.push('      }');
      lines.push('      return null;');
      lines.push('    },');
      lines.push('    keywordOrThrow() {');
      lines.push('      const result = this.keyword();');
      lines.push('      if (result === null) {');
      lines.push('        const actualChild = node.firstChild;');
      lines.push('        const currentPath = [...path, \'keyword()\'];');
      lines.push('        throw new NavigationExpectationError(');
      lines.push('          \'Expected to find keyword node but it was not present\',');
      lines.push('          {');
      lines.push('            expectedNodeType: \'keyword\',');
      lines.push('            actualNodeType: actualChild ? actualChild.type : null,');
      lines.push('            path: currentPath');
      lines.push('          }');
      lines.push('        );');
      lines.push('      }');
      lines.push('      return result;');
      lines.push('    },');
    }
  }
  
  lines.push('  };');
  lines.push('}');
  lines.push('');
  
  // Generate generic createNavigator for other nodes
  lines.push('function createNavigator<N extends Node>(node: N, path: string[]): Navigator<N> {');
  lines.push('  return {');
  lines.push('    node,');
  lines.push('    text: node.text,');
  lines.push('    path,');
  if (sourceFile && sourceFile.children) {
    lines.push('    child(index = 0) {');
    lines.push('      const childNode = node.children[index];');
    lines.push('      if (childNode) {');
    lines.push('        const childPath = [...path, `child(${index})`];');
    lines.push('        return createNavigator(childNode, childPath);');
    lines.push('      }');
    lines.push('      return null;');
    lines.push('    },');
  }
  // Generic navigators don't have specific navigation methods
  lines.push('  };');
  lines.push('}');
  
  // Generate createKeywordNavigator if we have keyword node and literals
  if (keywordNode && literalNodes && literalNodes.length > 0) {
    lines.push('');
    lines.push('function createKeywordNavigator(node: KeywordNode, path: string[]): KeywordNavigator {');
    lines.push('  return {');
    lines.push('    node,');
    lines.push('    text: node.text,');
    lines.push('    path,');
    
    // Add child method - keyword has exactly one anonymous child
    lines.push('    child() {');
    lines.push('      const childNode = node.firstChild;');
    if (literalNodes && literalNodes.length > 0) {
      const anonymousTypes = literalNodes.map(n => TS.toPascalCase(n.type)).join(' | ');
      lines.push(`      return childNode as ${anonymousTypes};`);
    } else {
      lines.push('      return childNode;');
    }
    lines.push('    },');
    
    // Add choice() method that returns the first anonymous child
    lines.push('    choice() {');
    lines.push('      const child = node.firstChild;');
    if (literalNodes && literalNodes.length > 0) {
      const anonymousTypes = literalNodes.map(n => TS.toPascalCase(n.type)).join(' | ');
      lines.push(`      return child as ${anonymousTypes};`);
    } else {
      lines.push('      return child;');
    }
    lines.push('    },');
    
    // Generate methods for literal nodes
    literalNodes.forEach(node => {
      const anonymousTypeName = TS.toPascalCase(node.type);
      
      // Regular method that returns null if not found
      lines.push(`    ${node.type}() {`);
      lines.push(`      // Find child with text '${node.type}'`);
      lines.push(`      const child = node.firstChild;`);
      lines.push(`      if (child && child.type === '${node.type}' && !child.isNamed) {`);
      lines.push(`        return child as ${anonymousTypeName};`);
      lines.push(`      }`);
      lines.push(`      return null;`);
      lines.push(`    },`);
      
      // OrThrow method that throws if not found
      lines.push(`    ${node.type}OrThrow() {`);
      lines.push(`      const result = this.${node.type}();`);
      lines.push(`      if (result === null) {`);
      lines.push(`        const actualChild = node.firstChild;`);
      lines.push(`        const currentPath = [...path, '${node.type}()'];`);
      lines.push(`        throw new NavigationExpectationError(`);
      lines.push(`          'Expected to find "${node.type}" but it was not present',`);
      lines.push(`          {`);
      lines.push(`            expectedNodeType: '${node.type}',`);
      lines.push(`            actualNodeType: actualChild ? actualChild.type : null,`);
      lines.push(`            searchText: '${node.type}',`);
      lines.push(`            path: currentPath`);
      lines.push(`          }`);
      lines.push(`        );`);
      lines.push(`      }`);
      lines.push(`      return result;`);
      lines.push(`    },`);
    });
    
    lines.push('  };');
    lines.push('}');
  }
  
  return lines.join('\n');
}

function generateParserFile(grammarName: string, grammarNamePascal: string): string {
  return `/**
 * Parser utilities for ${grammarName}
 * @generated
 */

import { Parser, Language } from 'web-tree-sitter';
import type { Tree } from 'web-tree-sitter';

/**
 * Create and initialize a parser for ${grammarName}.
 * Automatically loads the WASM grammar from the artifacts directory.
 */
export async function create(): Promise<Parser> {
  // Initialize the Parser library once
  await Parser.init();

  // Create a new parser instance
  const parser = new Parser();

  // Load the WASM grammar
  const wasmUrl = new URL('../__artifacts__/parser.wasm', import.meta.url);
  // Use pathname for Node.js (file://) or href for browser (http://)
  const wasmPath = wasmUrl.protocol === 'file:' ? wasmUrl.pathname : wasmUrl.href;
  const language = await Language.load(wasmPath);

  // Set the language on the parser
  parser.setLanguage(language);

  return parser;
}

/**
 * Parse source code and return the syntax tree.
 */
export async function parse(sourceCode: string): Promise<Tree> {
  const parser = await create();
  const tree = parser.parse(sourceCode);
  if (!tree) {
    throw new Error('Failed to parse source code');
  }
  return tree;
}
`;
}
