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
