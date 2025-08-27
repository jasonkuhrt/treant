/**
 * Analysis utilities for tree-sitter grammar rules.
 * These functions extract information and patterns from grammar structures.
 */

import type { ChoiceRule, GrammarJson, Rule, SeqRule, SymbolRule } from './types.js';
import * as Predicates from './predicates.js';

/**
 * Get all SYMBOL members from a CHOICE rule
 */
export function getSymbolMembers(rule: ChoiceRule): SymbolRule[] {
  return rule.members.filter(Predicates.isSymbolRule);
}

/**
 * Get symbol names from a CHOICE rule
 */
export function getSymbolMemberNames(rule: ChoiceRule): string[] {
  return getSymbolMembers(rule).map(member => member.name);
}

/**
 * Detect semantic groupings in grammar rules.
 * A semantic grouping is a CHOICE rule where all members are SYMBOLs.
 */
export function detectSemanticGroupings(rules: Record<string, Rule>): Map<string, string[]> {
  const groupings = new Map<string, string[]>();

  for (const [ruleName, rule] of Object.entries(rules)) {
    if (Predicates.isChoiceRule(rule)) {
      const symbolMembers = getSymbolMembers(rule);
      // Check if all members are symbols and there's more than one
      if (symbolMembers.length === rule.members.length && symbolMembers.length > 1) {
        groupings.set(ruleName, symbolMembers.map(m => m.name));
      }
    }
  }

  return groupings;
}

/**
 * Extract all child types that can appear under a rule
 */
export function extractChildTypes(rule: Rule): string[] {
  const childTypes = new Set<string>();

  function traverse(r: Rule): void {
    if (Predicates.isSymbolRule(r)) {
      childTypes.add(r.name);
    } else if (Predicates.hasMembers(r)) {
      r.members.forEach(traverse);
    } else if (Predicates.hasContent(r)) {
      traverse(r.content);
    }
  }

  traverse(rule);
  return Array.from(childTypes);
}

/**
 * Extract direct child types from a SEQ rule
 */
export function extractDirectChildTypes(rule: SeqRule): Array<{ type: string; isOptional: boolean }> {
  const childTypes: Array<{ type: string; isOptional: boolean }> = [];

  rule.members.forEach(member => {
    if (Predicates.isSymbolRule(member)) {
      childTypes.push({ type: member.name, isOptional: false });
    } else if (Predicates.isOptionalRule(member) && Predicates.isChoiceRule(member)) {
      const content = Predicates.getOptionalContent(member);
      if (content && Predicates.isSymbolRule(content)) {
        childTypes.push({ type: content.name, isOptional: true });
      }
    }
  });

  return childTypes;
}

/**
 * Find all rules that reference a given symbol
 */
export function findSymbolReferences(grammar: GrammarJson, symbolName: string): string[] {
  const references: string[] = [];

  for (const [ruleName, rule] of Object.entries(grammar.rules)) {
    const childTypes = extractChildTypes(rule);
    if (childTypes.includes(symbolName)) {
      references.push(ruleName);
    }
  }

  return references;
}

/**
 * Check if a rule is a simple alias (just references another rule)
 */
export function isSimpleAlias(rule: Rule): rule is SymbolRule {
  return Predicates.isSymbolRule(rule);
}

/**
 * Get all terminal rules (STRING or PATTERN)
 */
export function getTerminalRules(rules: Record<string, Rule>): Record<string, Rule> {
  const terminals: Record<string, Rule> = {};

  for (const [name, rule] of Object.entries(rules)) {
    if (Predicates.isStringRule(rule) || Predicates.isPatternRule(rule)) {
      terminals[name] = rule;
    }
  }

  return terminals;
}

/**
 * Get all rules that can match empty string
 */
export function getNullableRules(rules: Record<string, Rule>): Set<string> {
  const nullable = new Set<string>();
  const visited = new Set<string>();

  function isNullable(ruleName: string): boolean {
    if (visited.has(ruleName)) {
      return nullable.has(ruleName);
    }
    visited.add(ruleName);

    const rule = rules[ruleName];
    if (!rule) return false;

    if (Predicates.isBlankRule(rule)) {
      nullable.add(ruleName);
      return true;
    }

    if (Predicates.isRepeatRule(rule)) {
      nullable.add(ruleName);
      return true;
    }

    if (Predicates.isChoiceRule(rule)) {
      // A choice is nullable if any member is nullable
      const hasNullableMember = rule.members.some(member => {
        if (Predicates.isBlankRule(member)) return true;
        if (Predicates.isSymbolRule(member)) return isNullable(member.name);
        return false;
      });
      if (hasNullableMember) {
        nullable.add(ruleName);
        return true;
      }
    }

    if (Predicates.isSeqRule(rule)) {
      // A sequence is nullable if all members are nullable
      const allNullable = rule.members.every(member => {
        if (Predicates.isBlankRule(member)) return true;
        if (Predicates.isSymbolRule(member)) return isNullable(member.name);
        if (Predicates.isRepeatRule(member)) return true;
        return false;
      });
      if (allNullable) {
        nullable.add(ruleName);
        return true;
      }
    }

    return false;
  }

  // Check all rules
  for (const ruleName of Object.keys(rules)) {
    isNullable(ruleName);
  }

  return nullable;
}

/**
 * Get the root rule name (usually 'source_file' or the first rule)
 */
export function getRootRuleName(grammar: GrammarJson): string {
  // Check for common root rule names
  if ('source_file' in grammar.rules) return 'source_file';
  if ('program' in grammar.rules) return 'program';
  if ('document' in grammar.rules) return 'document';

  // Otherwise return the first rule
  const firstRule = Object.keys(grammar.rules)[0];
  if (!firstRule) {
    throw new Error('Grammar has no rules');
  }
  return firstRule;
}