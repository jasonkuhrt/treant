/**
 * Maps Generator Module
 *
 * Generates child/sibling/parent relationship maps for type-safe cursor navigation.
 * These maps provide the foundation for exhaustive conditional return types.
 */

import type { GrammarAnalysis } from '../core/grammar-analysis.js';
import {
  emitGeneratedFileHeader,
  emitInterfaceProperty,
  emitOptionalType,
  emitStringLiteral,
  emitTupleType,
  emitType,
  emitUnionType,
} from '../core/type-helpers.js';
import type { CursorConfig } from './cursor-generator.js';

/**
 * Generate cursor position maps for type-safe navigation
 */
export async function generateCursorMaps(
  analysis: GrammarAnalysis,
  config: CursorConfig,
): Promise<string> {
  const lines: string[] = [];

  // Generated file header with eslint disable
  lines.push(emitGeneratedFileHeader('cursor position maps'));

  // Import base types
  lines.push('import type { Node } from \'web-tree-sitter\';');
  lines.push('');

  // Generate child relationship map
  lines.push('/**');
  lines.push(' * Maps parent node types to their possible child node types.');
  lines.push(' * Used for type-safe gotoFirstChild and gotoChild operations.');
  lines.push(' */');
  lines.push('export interface ChildMap {');

  const childMapEntries: string[] = [];
  analysis.childRelationships.forEach((children, parent) => {
    const childTypes = Array.from(children).sort();
    if (childTypes.length > 0) {
      const unionType = emitUnionType(childTypes);
      childMapEntries.push(emitInterfaceProperty(parent, unionType));
    }
  });

  lines.push(...childMapEntries);
  lines.push('}');
  lines.push('');

  // Generate parent relationship map
  lines.push('/**');
  lines.push(' * Maps child node types to their possible parent node types.');
  lines.push(' * Used for type-safe gotoParent operations.');
  lines.push(' */');
  lines.push('export interface ParentMap {');

  const parentMapEntries: string[] = [];
  analysis.parentRelationships.forEach((parents, child) => {
    const parentTypes = Array.from(parents).sort();
    if (parentTypes.length > 0) {
      const unionType = emitUnionType(parentTypes);
      parentMapEntries.push(emitInterfaceProperty(child, unionType));
    }
  });

  lines.push(...parentMapEntries);
  lines.push('}');
  lines.push('');

  // Generate sibling relationship map based on shared parents
  lines.push('/**');
  lines.push(' * Maps node types to their possible sibling node types.');
  lines.push(' * Used for type-safe gotoNextSibling and gotoPreviousSibling operations.');
  lines.push(' */');
  lines.push('export interface SiblingMap {');

  const siblingMapEntries: string[] = [];
  analysis.namedNodes.forEach(node => {
    const nodeType = node.type;
    const siblings = new Set<string>();

    // Find all nodes that share at least one parent with this node
    const nodeParents = analysis.parentRelationships.get(nodeType) || new Set();
    nodeParents.forEach(parent => {
      const parentChildren = analysis.childRelationships.get(parent) || new Set();
      parentChildren.forEach(sibling => {
        if (sibling !== nodeType) {
          siblings.add(sibling);
        }
      });
    });

    if (siblings.size > 0) {
      const siblingTypes = Array.from(siblings).sort();
      const unionType = emitUnionType(siblingTypes);
      siblingMapEntries.push(emitInterfaceProperty(nodeType, unionType));
    }
  });

  lines.push(...siblingMapEntries);
  lines.push('}');
  lines.push('');

  // Generate sequence position map for ordered children
  lines.push('/**');
  lines.push(' * Maps parent node types to ordered sequences of their child types.');
  lines.push(' * Used for position-aware type-safe navigation in SEQ rules.');
  lines.push(' */');
  lines.push('export interface SequenceMap {');

  const sequenceMapEntries: string[] = [];

  // Extract sequence information from grammar rules
  for (const [ruleName, rule] of Object.entries(analysis.grammarRules)) {
    if (typeof rule === 'object' && rule !== null && rule.type === 'SEQ' && rule.members) {
      const sequence: string[] = [];

      rule.members.forEach(member => {
        if (typeof member === 'object' && member.type === 'SYMBOL' && member.name) {
          sequence.push(member.name);
        }
        else if (typeof member === 'object' && member.type === 'CHOICE' && member.members) {
          // Handle optional choices (CHOICE with BLANK)
          const hasBlank = member.members.some((m: any) => m.type === 'BLANK');
          const symbolMember = member.members.find((m: any) => m.type === 'SYMBOL');

          if (hasBlank && symbolMember && symbolMember.name) {
            sequence.push(symbolMember.name + '?'); // Mark as optional
          }
        }
      });

      if (sequence.length > 0) {
        const sequenceTypes = sequence.map(s => ({ type: s, optional: false }));
        const sequenceLiteral = emitTupleType(sequenceTypes);
        sequenceMapEntries.push(emitInterfaceProperty(ruleName, sequenceLiteral));
      }
    }
  }

  lines.push(...sequenceMapEntries);
  lines.push('}');
  lines.push('');

  // Generate positional child map for index-based access
  lines.push('/**');
  lines.push(' * Maps parent node types to child types at specific positions.');
  lines.push(' * Used for type-safe gotoChild(index) operations.');
  lines.push(' */');
  lines.push('export interface PositionalChildMap {');

  const positionalMapEntries: string[] = [];

  // Generate positional maps for sequence rules
  for (const [ruleName, rule] of Object.entries(analysis.grammarRules)) {
    if (typeof rule === 'object' && rule !== null && rule.type === 'SEQ' && rule.members) {
      const positions: Array<{ index: number; type: string; optional: boolean }> = [];

      rule.members.forEach((member, index) => {
        if (typeof member === 'object') {
          if (member.type === 'SYMBOL' && member.name) {
            positions.push({ index, type: member.name, optional: false });
          }
          else if (member.type === 'CHOICE' && member.members) {
            const hasBlank = member.members.some((m: any) => m.type === 'BLANK');
            const symbolMember = member.members.find((m: any) => m.type === 'SYMBOL');

            if (hasBlank && symbolMember && symbolMember.name) {
              positions.push({ index, type: symbolMember.name, optional: true });
            }
          }
        }
      });

      if (positions.length > 0) {
        const tupleType = emitTupleType(positions);
        positionalMapEntries.push(emitInterfaceProperty(ruleName, tupleType));
      }
    }
  }

  lines.push(...positionalMapEntries);
  lines.push('}');
  lines.push('');

  // Generate combined position map interface
  lines.push('/**');
  lines.push(' * Combined interface providing all cursor position relationship maps.');
  lines.push(' * This is the main interface used by the cursor navigation system.');
  lines.push(' */');
  lines.push('export interface PositionMap {');
  lines.push('  /** Child relationships */');
  lines.push('  children: ChildMap;');
  lines.push('  /** Parent relationships */');
  lines.push('  parents: ParentMap;');
  lines.push('  /** Sibling relationships */');
  lines.push('  siblings: SiblingMap;');
  lines.push('  /** Sequence information for ordered navigation */');
  lines.push('  sequences: SequenceMap;');
  lines.push('  /** Positional child information for index-based access */');
  lines.push('  positional: PositionalChildMap;');
  lines.push('}');
  lines.push('');

  // Generate utility types for map access
  lines.push('/**');
  lines.push(' * Utility type to get child types for a parent node type.');
  lines.push(' */');
  lines.push('export type GetChildTypes<T extends keyof ChildMap> = ChildMap[T];');
  lines.push('');

  lines.push('/**');
  lines.push(' * Utility type to get parent types for a child node type.');
  lines.push(' */');
  lines.push('export type GetParentTypes<T extends keyof ParentMap> = ParentMap[T];');
  lines.push('');

  lines.push('/**');
  lines.push(' * Utility type to get sibling types for a node type.');
  lines.push(' */');
  lines.push('export type GetSiblingTypes<T extends keyof SiblingMap> = SiblingMap[T];');
  lines.push('');

  lines.push('/**');
  lines.push(' * Utility type to get child type at specific position.');
  lines.push(' */');
  lines.push('export type GetChildAtPosition<');
  lines.push('  T extends keyof PositionalChildMap,');
  lines.push('  I extends number');
  lines.push('> = PositionalChildMap[T] extends readonly (infer U)[]');
  lines.push('  ? I extends keyof PositionalChildMap[T]');
  lines.push('    ? PositionalChildMap[T][I]');
  lines.push('    : never');
  lines.push('  : never;');
  lines.push('');

  // Runtime maps removed - TypeScript interfaces provide all necessary type safety

  return lines.join('\n');
}
