/**
 * Alias rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { AliasRule } from '../generated/dsl/types.js';

export type { AliasRule };

export function isAliasRule(rule: Rule): rule is AliasRule {
  return rule.type === 'ALIAS';
}