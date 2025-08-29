import { Rule } from './generated/dsl/types.js';

/**
 * Top-level grammar JSON structure
 */
export interface GrammarJson {
  $schema?: string;
  name: string;
  rules: Record<string, Rule>;
  extras?: Rule[];
  conflicts?: string[][];
  precedences?: Precedence[];
  externals?: Rule[];
  inline?: string[];
  supertypes?: string[];
  word?: string;
}

/**
 * Precedence definition for conflict resolution
 */
export interface Precedence {
  type: string;
  value: number;
}
