/**
 * Type Helpers Module
 *
 * Utilities for TypeScript code generation including case conversion,
 * JSDoc generation, and TypeScript-specific code patterns.
 */

import type { NodeType } from './grammar-analysis.js';

/**
 * Convert snake_case to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Convert PascalCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (match, offset) => offset === 0 ? match.toLowerCase() : '_' + match.toLowerCase())
    .toLowerCase();
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Generate TypeScript node interface name with aliasing for invalid identifiers
 */
export function getNodeInterfaceName(nodeType: string): string {
  const pascalType = toPascalCase(nodeType);
  const interfaceName = pascalType + 'Node';

  // Add $ suffix if the resulting name would be an invalid TS identifier
  if (!isValidTypeScriptIdentifier(interfaceName)) {
    return interfaceName + '$';
  }

  return interfaceName;
}

/**
 * Generate TypeScript type guard function name with aliasing
 */
export function getTypeGuardName(nodeType: string): string {
  const interfaceName = getNodeInterfaceName(nodeType);
  const guardName = 'is' + interfaceName;

  // Guard name should inherit the aliasing from interface name
  if (!isValidTypeScriptIdentifier(guardName)) {
    return guardName + '$';
  }

  return guardName;
}

/**
 * Generate TypeScript constructor function name with aliasing
 */
export function getConstructorName(nodeType: string): string {
  return getNodeInterfaceName(nodeType); // Already handles aliasing
}

/**
 * Generate file name from node type
 */
export function getNodeFileName(nodeType: string): string {
  return toSnakeCase(getNodeInterfaceName(nodeType).replace(/Node$/, ''));
}

/**
 * Generate JSDoc for node interface
 */
export function generateInterfaceJSDoc(node: NodeType, grammarName: string): string {
  const lines = ['/**'];

  // Add description based on node type
  lines.push(` * Represents a ${node.type.replace(/_/g, ' ')} in the ${grammarName} AST.`);
  lines.push(' * ');

  // Add child information if any
  if (node.children && node.children.types.length > 0) {
    lines.push(' * Children:');
    const childTypes = node.children.types
      .filter(t => t.named)
      .map(t => `{@link ${getNodeInterfaceName(t.type)}}`)
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

  // Add special markers
  if (node.root) {
    lines.push(' * @note This is a root node type');
    lines.push(' * ');
  }

  if (node.extra) {
    lines.push(' * @note This is an extra node (like comments or whitespace)');
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
export function generateConstructorJSDoc(node: NodeType): string {
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
      .filter(t => t.named)
      .forEach(childType => {
        const childName = toCamelCase(childType.type);
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
  const functionName = `get${toPascalCase(childType)}From${toPascalCase(parentType)}`;

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
    ` * const ${toCamelCase(childType)} = ${functionName}(${toCamelCase(parentType)});`,
    ` * if (${toCamelCase(childType)}) {`,
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
    ` * const ${toCamelCase(targetType)}s = extract${toPascalCase(targetType)}s(rootNode);`,
    ` * ${toCamelCase(targetType)}s.forEach(node => {`,
    ' *   // Process each node',
    ' * });',
    ' * ```',
    ' */',
  ].join('\n');
}

/**
 * Generate TypeScript union type members list
 */
export function generateUnionMembers(types: string[]): string[] {
  return types.map((type, index) => {
    const separator = index === 0 ? '' : '|';
    return `  ${separator} ${type}`;
  });
}

/**
 * Generate TypeScript array type literal
 */
export function generateArrayLiteral(items: string[], itemType: 'string' | 'number' = 'string'): string {
  const quotedItems = itemType === 'string'
    ? items.map(item => `'${item}'`)
    : items.map(String);
  return `[${quotedItems.join(', ')}]`;
}

/**
 * Generate TypeScript const assertion
 */
export function generateConstAssertion(name: string, value: string): string {
  return `export const ${name} = ${value} as const;`;
}

/**
 * Generate import statement for node types
 */
export function generateNodeImport(nodeType: string): string {
  const nodeName = getNodeInterfaceName(nodeType);
  const fileName = getNodeFileName(nodeType);
  return `import type { ${nodeName} } from './nodes/${fileName}.js';`;
}

/**
 * Generate relative import statement
 */
export function generateRelativeImport(
  imports: string[],
  modulePath: string,
  isTypeImport = true,
): string {
  const importKeyword = isTypeImport ? 'import type' : 'import';

  if (imports.length === 1) {
    return `${importKeyword} { ${imports[0]} } from '${modulePath}';`;
  }

  return [
    `${importKeyword} {`,
    ...imports.map(imp => `  ${imp},`),
    `} from '${modulePath}';`,
  ].join('\n');
}

/**
 * Validate TypeScript identifier
 */
export function isValidTypeScriptIdentifier(name: string): boolean {
  // TypeScript identifier rules: must start with letter, $, or _
  // and contain only letters, digits, $, or _
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

/**
 * Escape string for TypeScript string literal
 */
export function escapeStringLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Generate TypeScript template literal type
 */
export function generateTemplateLiteralType(parts: string[]): string {
  return `\`\${${parts.join('}\${')}\}`;
}

/**
 * Format TypeScript generic type parameters
 */
export function formatGenericParams(params: string[]): string {
  if (params.length === 0) return '';
  return `<${params.join(', ')}>`;
}

/**
 * Generate conditional type expression
 */
export function generateConditionalType(
  condition: string,
  trueType: string,
  falseType: string,
): string {
  return `${condition} extends true ? ${trueType} : ${falseType}`;
}

/**
 * Generate mapped type expression
 */
export function generateMappedType(
  keyType: string,
  valueType: string,
  modifiers?: { readonly?: boolean; optional?: boolean },
): string {
  const readonly = modifiers?.readonly ? 'readonly ' : '';
  const optional = modifiers?.optional ? '?' : '';

  return `{ ${readonly}[K in ${keyType}]${optional}: ${valueType} }`;
}

/**
 * Check if a node type needs aliasing (has invalid TS identifier)
 */
export function needsAliasing(nodeType: string): boolean {
  const interfaceName = toPascalCase(nodeType) + 'Node';
  return !isValidTypeScriptIdentifier(interfaceName);
}

/**
 * Get the clean export name (without $ suffix) for namespace exports
 */
export function getCleanExportName(nodeType: string): string {
  const interfaceName = getNodeInterfaceName(nodeType);
  // Remove $ suffix for clean namespace exports
  return interfaceName.endsWith('$') ? interfaceName.slice(0, -1) : interfaceName;
}

/**
 * Generate namespace export alias for invalid identifiers
 * Returns the export statement that aliases the $ suffixed name to clean name
 */
export function generateNamespaceAlias(nodeType: string): string | null {
  if (!needsAliasing(nodeType)) {
    return null;
  }

  const aliasedName = getNodeInterfaceName(nodeType); // Has $ suffix
  const cleanName = getCleanExportName(nodeType); // Without $ suffix

  return `export { ${aliasedName} as ${cleanName} }`;
}

// ================================================================
// ================================================================
//
//                     CODE GENERATION HELPERS
//
// ================================================================
// ================================================================

/**
 * Emit a TypeScript string literal with proper quoting and escaping
 */
export function emitStringLiteral(value: string): string {
  return `'${escapeStringLiteral(value)}'`;
}

/**
 * Emit a TypeScript identifier (bare name)
 */
export function emitIdentifier(name: string): string {
  return name;
}

/**
 * Emit a TypeScript type (identifier or literal based on context)
 */
export function emitType(name: string, asLiteral: boolean = true): string {
  return asLiteral ? emitStringLiteral(name) : emitIdentifier(name);
}

/**
 * Emit a union type with proper formatting
 */
export function emitUnionType(types: string[], asLiterals: boolean = true): string {
  const formattedTypes = types.map(type => emitType(type, asLiterals));
  return formattedTypes.join(' | ');
}

/**
 * Emit optional type (Type | null)
 */
export function emitOptionalType(type: string, asLiteral: boolean = true): string {
  return `${emitType(type, asLiteral)} | null`;
}

/**
 * Emit tuple type with proper formatting
 */
export function emitTupleType(types: Array<{ type: string; optional: boolean }>, asLiterals: boolean = true): string {
  const formattedTypes = types.map(t =>
    t.optional ? emitOptionalType(t.type, asLiterals) : emitType(t.type, asLiterals)
  );
  return `[${formattedTypes.join(', ')}]`;
}

/**
 * Emit interface property with proper formatting
 */
export function emitInterfaceProperty(key: string, valueType: string): string {
  return `  ${emitStringLiteral(key)}: ${valueType};`;
}

/**
 * Emit generated file header with eslint disable
 */
export function emitGeneratedFileHeader(description: string): string {
  return [
    '/* eslint-disable */',
    `// Auto-generated ${description}`,
    '// DO NOT EDIT - This file is overwritten by the generator',
    '',
  ].join('\n');
}
