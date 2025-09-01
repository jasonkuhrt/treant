/**
 * Grammar Code Generation Helpers
 *
 * Utilities specifically for generating TypeScript interfaces, type guards,
 * and other code constructs from tree-sitter grammar definitions.
 */

import { Grammar } from '@treant/grammar';
import { Core } from '@treant/core';

/**
 * Generate TypeScript node interface name with "Node" suffix
 */
export function getNodeInterfaceName(nodeType: string): string {
  const pascalType = Core.toPascalCase(nodeType);
  return pascalType + 'Node';
}

/**
 * Generate TypeScript type guard function name
 */
export function getTypeGuardName(nodeType: string): string {
  const interfaceName = getNodeInterfaceName(nodeType);
  return 'is' + interfaceName;
}

/**
 * Generate file name from node type
 */
export function getNodeFileName(nodeType: string): string {
  return Core.toSnakeCase(getNodeInterfaceName(nodeType).replace(/Node$/, ''));
}

/**
 * Generate JSDoc for node interface
 */
export function generateInterfaceJSDoc(node: Grammar.NodeType, grammarName: string): string {
  const lines = ['/**'];

  // Add description based on node type
  lines.push(` * Represents a ${node.type.replace(/_/g, ' ')} in the ${grammarName} AST.`);
  lines.push(' * ');

  // Add child information if any
  if (node.children && node.children.types.length > 0) {
    lines.push(' * Children:');
    const childTypes = node.children.types
      .filter((t: any) => t.named)
      .map((t: any) => `{@link ${getNodeInterfaceName(t.type)}}`)
      .join(', ');
    if (childTypes) {
      lines.push(` *   ${childTypes}`);
    }
    lines.push(' * ');
  }

  // Add fields information if any
  if (node.fields && Object.keys(node.fields).length > 0) {
    lines.push(' * Fields:');
    Object.keys(node.fields).forEach(fieldName => {
      lines.push(` *   ${fieldName}`);
    });
    lines.push(' * ');
  }


  lines.push(' */');
  return lines.join('\n');
}

/**
 * Generate JSDoc for type guard function
 */
export function generateTypeGuardJSDoc(nodeType: string): string {
  const nodeName = getNodeInterfaceName(nodeType);
  const guardName = getTypeGuardName(nodeType);

  return [
    '/**',
    ` * Type guard to check if a node is a {@link ${nodeName}}.`,
    ' * ',
    ' * @param node - The node to check',
    ` * @returns True if the node is a {@link ${nodeName}}`,
    ' * ',
    ' * @example',
    ' * ```typescript',
    ` * if (${guardName}(node)) {`,
    ` *   // TypeScript now knows node is ${nodeName}`,
    ` *   console.log(node.type); // '${nodeType}'`,
    ' * }',
    ' * ```',
    ' */',
  ].join('\n');
}

/**
 * Generate JSDoc for constructor function
 */
export function generateConstructorJSDoc(node: Grammar.NodeType): string {
  const nodeName = getNodeInterfaceName(node.type);
  const lines = [
    '/**',
    ` * Creates a new {@link ${nodeName}} with the specified properties.`,
    ' * ',
  ];

  // Add parameter documentation based on children
  if (node.children && node.children.types.length > 0) {
    lines.push(' * @param props - The node properties');

    // Document common child types
    node.children.types
      .filter((t: any) => t.named)
      .forEach((childType: any) => {
        const childName = Core.toCamelCase(childType.type);
        const childTypeName = getNodeInterfaceName(childType.type);
        lines.push(` * @param props.${childName} - {@link ${childTypeName}}`);
      });
  }

  lines.push(` * @returns A new {@link ${nodeName}}`);
  lines.push(' * ');
  lines.push(' * @example');
  lines.push(' * ```typescript');
  lines.push(` * const node = ${nodeName}({`);
  lines.push(' *   // properties...');
  lines.push(' * });');
  lines.push(' * ```');
  lines.push(' */');

  return lines.join('\n');
}

/**
 * Generate JSDoc for accessor function
 */
export function generateAccessorJSDoc(
  parentType: string,
  childType: string,
  position?: number,
): string {
  const parentName = getNodeInterfaceName(parentType);
  const childName = getNodeInterfaceName(childType);
  const functionName = `get${Core.toPascalCase(childType)}From${Core.toPascalCase(parentType)}`;

  const positionInfo = position !== undefined ? ` at position ${position}` : '';

  return [
    '/**',
    ` * Get the ${childType.replace(/_/g, ' ')} child${positionInfo} from a {@link ${parentName}}.`,
    ' * ',
    ` * @param node - The ${parentType.replace(/_/g, ' ')} node`,
    ` * @returns The {@link ${childName}} child, or null if not found`,
    ' * ',
    ' * @example',
    ' * ```typescript',
    ` * const ${Core.toCamelCase(childType)} = ${functionName}(${Core.toCamelCase(parentType)});`,
    ` * if (${Core.toCamelCase(childType)}) {`,
    ` *   // Use the ${childType.replace(/_/g, ' ')} node`,
    ' * }',
    ' * ```',
    ' */',
  ].join('\n');
}

/**
 * Generate JSDoc for extractor function
 */
export function generateExtractorJSDoc(
  targetType: string,
  description: string,
): string {
  return [
    '/**',
    ` * ${description}`,
    ' * ',
    ' * @param node - Root node to search from',
    ` * @returns Array of ${targetType.replace(/_/g, ' ')} nodes`,
    ' * ',
    ' * @example',
    ' * ```typescript',
    ` * const ${Core.toCamelCase(targetType)}s = extract${Core.toPascalCase(targetType)}s(rootNode);`,
    ` * ${Core.toCamelCase(targetType)}s.forEach(node => {`,
    ' *   // Process each node',
    ' * });',
    ' * ```',
    ' */',
  ].join('\n');
}

/**
 * Generate import statement for node types
 */
export function generateNodeImport(nodeType: string): string {
  const nodeName = getNodeInterfaceName(nodeType);
  const fileName = getNodeFileName(nodeType);
  return `import type { ${nodeName} } from './nodes/${fileName}.js';`;
}
