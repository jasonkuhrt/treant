/**
 * Pattern rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { PatternRule } from '../generated/dsl/types.js';

export type { PatternRule };

export function isPatternRule(rule: Rule): rule is PatternRule {
  return rule.type === 'PATTERN';
}