/**
 * Token rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { TokenRule } from '../generated/dsl/types.js';

export type { TokenRule };

export function isTokenRule(rule: Rule): rule is TokenRule {
  return rule.type === 'TOKEN';
}