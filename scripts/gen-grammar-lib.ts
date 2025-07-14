#!/usr/bin/env tsx

/**
 * Generate the GraphQL grammar TypeScript library.
 *
 * This script reads the generated node-types.json file and creates:
 * - Node interfaces for each AST node type that extend web-tree-sitter's Node
 * - Type guards for runtime type checking
 * - Constructor functions for creating nodes
 * - TreeSitterGraphQL namespace with union type for type-safe grammar definitions
 */

import { createStreaming } from '@dprint/formatter';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeTypes from '../parser/src/node-types.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

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
}

// Convert snake_case to PascalCase
function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Generate the large section header
function generateSectionHeader(title: string, subtitle?: string): string {
  const lines = [
    '',
    '',
    '// ================================================================',
    '// ================================================================',
    '//',
    `//                           ${title}`,
    '//',
  ];

  if (subtitle) {
    lines.push(`//        ${subtitle}`);
    lines.push('//');
  }

  lines.push('// ================================================================');
  lines.push('// ================================================================');
  lines.push('');
  lines.push('');

  return lines.join('\n');
}

// Generate JSDoc for a node interface
function generateInterfaceJSDoc(node: NodeType): string {
  const lines = ['/**'];

  // Add description based on node type
  lines.push(` * Represents a ${node.type.replace(/_/g, ' ')} in the GraphQL AST.`);
  lines.push(' * ');

  // Add child information if any
  if (node.children && node.children.types.length > 0) {
    lines.push(' * Children:');
    const childTypes = node.children.types
      .filter(t => t.named)
      .map(t => `{@link ${toPascalCase(t.type)}Node}`)
      .join(', ');
    if (childTypes) {
      lines.push(` *   ${childTypes}`);
    }
    lines.push(' * ');
  }

  // Add example based on common node types
  if (node.type === 'field') {
    lines.push(' * @example');
    lines.push(' * ```graphql');
    lines.push(' * query {');
    lines.push(' *   user {');
    lines.push(' *     name    # This is a FieldNode');
    lines.push(' *   }');
    lines.push(' * }');
    lines.push(' * ```');
  }
  else if (node.type === 'argument') {
    lines.push(' * @example');
    lines.push(' * ```graphql');
    lines.push(' * field(id: "123")  # id: "123" is an ArgumentNode');
    lines.push(' * ```');
  }

  lines.push(' */');
  return lines.join('\n');
}

// Generate JSDoc for type guard
function generateTypeGuardJSDoc(node: NodeType): string {
  const nodeName = toPascalCase(node.type) + 'Node';
  return [
    '/**',
    ` * Type guard to check if a node is a {@link ${nodeName}}.`,
    ' * ',
    ' * @param node - The node to check',
    ` * @returns True if the node is a {@link ${nodeName}}`,
    ' * ',
    ' * @example',
    ' * ```typescript',
    ` * if (is${nodeName}(node)) {`,
    ` *   // TypeScript now knows node is ${nodeName}`,
    ` *   console.log(node.type); // '${node.type}'`,
    ' * }',
    ' * ```',
    ' */',
  ].join('\n');
}

// Generate JSDoc for constructor
function generateConstructorJSDoc(node: NodeType): string {
  const nodeName = toPascalCase(node.type) + 'Node';
  const lines = [
    '/**',
    ` * Creates a new {@link ${nodeName}} with the specified properties.`,
    ' * ',
  ];

  // Add parameter documentation based on common patterns
  if (node.children && node.children.types.length > 0) {
    lines.push(' * @param props - The node properties');

    // Document common child types
    node.children.types
      .filter(t => t.named)
      .forEach(childType => {
        const childName = childType.type.replace(/_/g, '');
        const childTypeName = toPascalCase(childType.type) + 'Node';
        lines.push(` * @param props.${childName} - {@link ${childTypeName}}`);
      });
  }

  lines.push(` * @returns A new {@link ${nodeName}}`);
  lines.push(' * ');
  lines.push(' * @example');
  lines.push(' * ```typescript');

  // Add example based on node type
  if (node.type === 'field') {
    lines.push(' * const field = FieldNode({');
    lines.push(' *   name: NameNode("user"),');
    lines.push(' *   arguments: ArgumentsNode([...])');
    lines.push(' * });');
  }
  else {
    lines.push(` * const node = ${nodeName}({`);
    lines.push(' *   // properties...');
    lines.push(' * });');
  }

  lines.push(' * ```');
  lines.push(' */');

  return lines.join('\n');
}

// Generate a node file
function generateNodeFile(node: NodeType): string {
  const nodeName = toPascalCase(node.type) + 'Node';
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
      .map(t => `import type { ${toPascalCase(t.type)}Node } from './${t.type}.js';`)
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

  lines.push(generateSectionHeader(nodeName, `GraphQL ${node.type.replace(/_/g, ' ')} node`));
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
  lines.push(`export function is${nodeName}(node: unknown): node is ${nodeName} {`);
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

    const dprintConfigPath = join(projectRoot, 'dprint.json');
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

    mkdirSync(join(projectRoot, 'grammar-lib/nodes'), { recursive: true });

    // Extract named node types
    const namedNodes = nodeTypes.filter((node: NodeType) => node.named === true);
    console.log(`Found ${namedNodes.length} named node types`);

    // No standalone RuleName - using TreeSitterGraphQL.Node['type'] in grammar
    const ruleNames = namedNodes.map((node: NodeType) => node.type).sort();
    console.log(`Found ${ruleNames.length} rule names for Node union type`);

    // ================================================================
    // ================================================================
    //
    //                           GENERATE BASE TYPES
    //
    // ================================================================
    // ================================================================
    const typesContent = `// Auto-generated from parser/src/node-types.json
// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts

/**
 * Base interface for all tree-sitter nodes.
 * This represents the common properties that all AST nodes share.
 */
// TreeSitterNode interface has been replaced by SyntaxNode from web-tree-sitter
// See exports above for details

/**
 * Re-export of Node from web-tree-sitter.
 * 
 * Note: We chose web-tree-sitter over node-tree-sitter for the following reasons:
 * - Works in both Node.js and browser environments (via WebAssembly)
 * - Aligns with our WASM-based distribution model
 * - Single distribution file (no platform-specific builds)
 * 
 * Known limitations:
 * - TypeScript definitions are incomplete compared to node-tree-sitter
 * - Missing some methods like descendantsOfType in the type definitions
 * - The actual runtime API is complete, only the types are limited
 * 
 * @see https://github.com/tree-sitter/tree-sitter/issues/349
 */
export type { Node } from 'web-tree-sitter';
`;

    await writeFormattedFile(join(projectRoot, 'grammar-lib/types.ts'), typesContent, formatter);
    console.log('Generated grammar-lib/types.ts');

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
      await writeFormattedFile(join(projectRoot, 'grammar-lib/nodes', fileName), nodeFile, formatter);
    }
    console.log(`Generated ${namedNodes.length} node files in grammar-lib/nodes/`);

    // ================================================================
    // ================================================================
    //
    //                           GENERATE BARREL EXPORT
    //
    // ================================================================
    // ================================================================
    const nodeBarrelLines = [
      '// Auto-generated from parser/src/node-types.json',
      '// DO NOT EDIT - This file is overwritten by scripts/gen-grammar-lib.ts',
      '',
    ];

    // Export all node types
    ruleNames.forEach(type => {
      nodeBarrelLines.push(`export * from './nodes/${type}.js';`);
    });

    // Import all node types for union
    nodeBarrelLines.push('');
    nodeBarrelLines.push('// Import all node types for union');
    ruleNames.forEach(type => {
      const nodeName = toPascalCase(type) + 'Node';
      nodeBarrelLines.push(`import type { ${nodeName} } from './nodes/${type}.js';`);
    });

    // Create union type
    nodeBarrelLines.push('');
    nodeBarrelLines.push('/**');
    nodeBarrelLines.push(' * Union type of all GraphQL AST nodes.');
    nodeBarrelLines.push(' * This type represents any possible node in the GraphQL syntax tree.');
    nodeBarrelLines.push(' */');
    nodeBarrelLines.push('export type Node =');
    ruleNames.forEach((type, index) => {
      const nodeName = toPascalCase(type) + 'Node';
      const separator = index === 0 ? '' : '|';
      nodeBarrelLines.push(`  ${separator} ${nodeName}`);
    });
    nodeBarrelLines.push(';');

    await writeFormattedFile(join(projectRoot, 'grammar-lib/$$.ts'), nodeBarrelLines.join('\n'), formatter);
    console.log('Generated grammar-lib/$$.ts');

    // ================================================================
    // ================================================================
    //
    //                           GENERATE NAMESPACE FILE
    //
    // ================================================================
    // ================================================================
    const namespaceContent = `/**
 * Tree-sitter GraphQL AST nodes namespace.
 * 
 * This namespace provides access to all GraphQL AST node types, type guards,
 * and constructor functions generated from the tree-sitter grammar.
 * 
 * @example
 * \`\`\`typescript
 * import { TreeSitterGraphQL } from './grammar-lib/nodes/$.js';
 * 
 * // Access the union type of all nodes
 * type AnyNode = TreeSitterGraphQL.Node;
 * 
 * // Use specific node types
 * const field: TreeSitterGraphQL.FieldNode = ...;
 * 
 * // Use type guards
 * if (TreeSitterGraphQL.isFieldNode(node)) {
 *   // node is now typed as FieldNode
 * }
 * \`\`\`
 */
export * as TreeSitterGraphQL from './$$.js';
`;

    await writeFormattedFile(join(projectRoot, 'grammar-lib/$.ts'), namespaceContent, formatter);
    console.log('Generated grammar-lib/$.ts');

    console.log('✅ Successfully generated all grammar types!');
  }
  catch (error) {
    console.error('Error generating grammar types:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
