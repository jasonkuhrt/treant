/**
 * Blank rule
 */

import type { Rule } from '../generated/dsl/types.js';
import type { BlankRule } from '../generated/dsl/types.js';

export type { BlankRule };

export function isBlankRule(rule: Rule): rule is BlankRule {
  return rule.type === 'BLANK';
}