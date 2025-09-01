/**
 * Cursor position maps for type-safe navigation
 * @generated
 */

/* eslint-disable */
// Auto-generated cursor position maps
// DO NOT EDIT - This file is overwritten by the generator

import type { Node } from 'web-tree-sitter';

/**
 * Maps parent node types to their possible child node types.
 * Used for type-safe gotoFirstChild and gotoChild operations.
 */
export interface ChildMap {
  'alias': 'name';
  'argument': 'name' | 'value';
  'arguments': 'argument';
  'arguments_definition': 'input_value_definition';
  'default_value': 'value';
  'definition': 'executable_definition' | 'type_system_definition' | 'type_system_extension';
  'description': 'string_value';
  'directive': 'arguments' | 'name';
  'directive_definition': 'arguments_definition' | 'description' | 'directive_locations' | 'name';
  'directive_location': 'executable_directive_location' | 'type_system_directive_location';
  'directive_locations': 'directive_location' | 'directive_locations';
  'directives': 'directive';
  'document': 'definition';
  'enum_type_definition': 'description' | 'directives' | 'enum_values_definition' | 'name';
  'enum_type_extension': 'directives' | 'enum_values_definition' | 'name';
  'enum_value': 'name';
  'enum_value_definition': 'description' | 'directives' | 'enum_value';
  'enum_values_definition': 'enum_value_definition';
  'executable_definition': 'fragment_definition' | 'operation_definition';
  'field': 'alias' | 'arguments' | 'directive' | 'name' | 'selection_set';
  'field_definition': 'arguments_definition' | 'description' | 'directives' | 'name' | 'type';
  'fields_definition': 'field_definition';
  'fragment_definition': 'directives' | 'fragment_name' | 'selection_set' | 'type_condition';
  'fragment_name': 'name';
  'fragment_spread': 'directives' | 'fragment_name';
  'implements_interfaces': 'implements_interfaces' | 'named_type';
  'inline_fragment': 'directives' | 'selection_set' | 'type_condition';
  'input_fields_definition': 'input_value_definition';
  'input_object_type_definition': 'description' | 'directives' | 'input_fields_definition' | 'name';
  'input_object_type_extension': 'directives' | 'input_fields_definition' | 'name';
  'input_value_definition': 'default_value' | 'description' | 'directives' | 'name' | 'type';
  'interface_type_definition': 'description' | 'directives' | 'fields_definition' | 'implements_interfaces' | 'name';
  'interface_type_extension': 'directives' | 'fields_definition' | 'implements_interfaces' | 'name';
  'list_type': 'type';
  'list_value': 'value';
  'named_type': 'name';
  'non_null_type': 'list_type' | 'named_type';
  'object_field': 'comma' | 'name' | 'value';
  'object_type_definition': 'description' | 'directives' | 'fields_definition' | 'implements_interfaces' | 'name';
  'object_type_extension': 'directives' | 'fields_definition' | 'implements_interfaces' | 'name';
  'object_value': 'object_field';
  'operation_definition': 'directives' | 'name' | 'operation_type' | 'selection_set' | 'variable_definitions';
  'root_operation_type_definition': 'named_type' | 'operation_type';
  'scalar_type_definition': 'description' | 'directives' | 'name';
  'scalar_type_extension': 'directives' | 'name';
  'schema_definition': 'description' | 'directives' | 'root_operation_type_definition';
  'schema_extension': 'directives' | 'root_operation_type_definition';
  'selection': 'field' | 'fragment_spread' | 'inline_fragment';
  'selection_set': 'selection';
  'source_file': 'document';
  'type': 'list_type' | 'named_type' | 'non_null_type';
  'type_condition': 'named_type';
  'type_definition': 'enum_type_definition' | 'input_object_type_definition' | 'interface_type_definition' | 'object_type_definition' | 'scalar_type_definition' | 'union_type_definition';
  'type_extension': 'enum_type_extension' | 'input_object_type_extension' | 'interface_type_extension' | 'object_type_extension' | 'scalar_type_extension' | 'union_type_extension';
  'type_system_definition': 'directive_definition' | 'schema_definition' | 'type_definition';
  'type_system_extension': 'schema_extension' | 'type_extension';
  'union_member_types': 'named_type' | 'union_member_types';
  'union_type_definition': 'description' | 'directives' | 'name' | 'union_member_types';
  'union_type_extension': 'directives' | 'name' | 'union_member_types';
  'value': 'boolean_value' | 'enum_value' | 'float_value' | 'int_value' | 'list_value' | 'null_value' | 'object_value' | 'string_value' | 'variable';
  'variable': 'name';
  'variable_definition': 'comma' | 'default_value' | 'directives' | 'type' | 'variable';
  'variable_definitions': 'variable_definition';
}

/**
 * Maps child node types to their possible parent node types.
 * Used for type-safe gotoParent operations.
 */
export interface ParentMap {
  'name': 'alias' | 'argument' | 'directive' | 'directive_definition' | 'enum_type_definition' | 'enum_type_extension' | 'enum_value' | 'field' | 'field_definition' | 'fragment_name' | 'input_object_type_definition' | 'input_object_type_extension' | 'input_value_definition' | 'interface_type_definition' | 'interface_type_extension' | 'named_type' | 'object_field' | 'object_type_definition' | 'object_type_extension' | 'operation_definition' | 'scalar_type_definition' | 'scalar_type_extension' | 'union_type_definition' | 'union_type_extension' | 'variable';
  'value': 'argument' | 'default_value' | 'list_value' | 'object_field';
  'argument': 'arguments';
  'input_value_definition': 'arguments_definition' | 'input_fields_definition';
  'executable_definition': 'definition';
  'type_system_definition': 'definition';
  'type_system_extension': 'definition';
  'string_value': 'description' | 'value';
  'arguments': 'directive' | 'field';
  'arguments_definition': 'directive_definition' | 'field_definition';
  'description': 'directive_definition' | 'enum_type_definition' | 'enum_value_definition' | 'field_definition' | 'input_object_type_definition' | 'input_value_definition' | 'interface_type_definition' | 'object_type_definition' | 'scalar_type_definition' | 'schema_definition' | 'union_type_definition';
  'directive_locations': 'directive_definition' | 'directive_locations';
  'executable_directive_location': 'directive_location';
  'type_system_directive_location': 'directive_location';
  'directive_location': 'directive_locations';
  'directive': 'directives' | 'field';
  'definition': 'document';
  'directives': 'enum_type_definition' | 'enum_type_extension' | 'enum_value_definition' | 'field_definition' | 'fragment_definition' | 'fragment_spread' | 'inline_fragment' | 'input_object_type_definition' | 'input_object_type_extension' | 'input_value_definition' | 'interface_type_definition' | 'interface_type_extension' | 'object_type_definition' | 'object_type_extension' | 'operation_definition' | 'scalar_type_definition' | 'scalar_type_extension' | 'schema_definition' | 'schema_extension' | 'union_type_definition' | 'union_type_extension' | 'variable_definition';
  'enum_values_definition': 'enum_type_definition' | 'enum_type_extension';
  'enum_value': 'enum_value_definition' | 'value';
  'enum_value_definition': 'enum_values_definition';
  'fragment_definition': 'executable_definition';
  'operation_definition': 'executable_definition';
  'alias': 'field';
  'selection_set': 'field' | 'fragment_definition' | 'inline_fragment' | 'operation_definition';
  'type': 'field_definition' | 'input_value_definition' | 'list_type' | 'variable_definition';
  'field_definition': 'fields_definition';
  'fragment_name': 'fragment_definition' | 'fragment_spread';
  'type_condition': 'fragment_definition' | 'inline_fragment';
  'implements_interfaces': 'implements_interfaces' | 'interface_type_definition' | 'interface_type_extension' | 'object_type_definition' | 'object_type_extension';
  'named_type': 'implements_interfaces' | 'non_null_type' | 'root_operation_type_definition' | 'type' | 'type_condition' | 'union_member_types';
  'input_fields_definition': 'input_object_type_definition' | 'input_object_type_extension';
  'default_value': 'input_value_definition' | 'variable_definition';
  'fields_definition': 'interface_type_definition' | 'interface_type_extension' | 'object_type_definition' | 'object_type_extension';
  'list_type': 'non_null_type' | 'type';
  'comma': 'object_field' | 'variable_definition';
  'object_field': 'object_value';
  'operation_type': 'operation_definition' | 'root_operation_type_definition';
  'variable_definitions': 'operation_definition';
  'root_operation_type_definition': 'schema_definition' | 'schema_extension';
  'field': 'selection';
  'fragment_spread': 'selection';
  'inline_fragment': 'selection';
  'selection': 'selection_set';
  'document': 'source_file';
  'non_null_type': 'type';
  'enum_type_definition': 'type_definition';
  'input_object_type_definition': 'type_definition';
  'interface_type_definition': 'type_definition';
  'object_type_definition': 'type_definition';
  'scalar_type_definition': 'type_definition';
  'union_type_definition': 'type_definition';
  'enum_type_extension': 'type_extension';
  'input_object_type_extension': 'type_extension';
  'interface_type_extension': 'type_extension';
  'object_type_extension': 'type_extension';
  'scalar_type_extension': 'type_extension';
  'union_type_extension': 'type_extension';
  'directive_definition': 'type_system_definition';
  'schema_definition': 'type_system_definition';
  'type_definition': 'type_system_definition';
  'schema_extension': 'type_system_extension';
  'type_extension': 'type_system_extension';
  'union_member_types': 'union_member_types' | 'union_type_definition' | 'union_type_extension';
  'boolean_value': 'value';
  'float_value': 'value';
  'int_value': 'value';
  'list_value': 'value';
  'null_value': 'value';
  'object_value': 'value';
  'variable': 'value' | 'variable_definition';
  'variable_definition': 'variable_definitions';
}

/**
 * Maps node types to their possible sibling node types.
 * Used for type-safe gotoNextSibling and gotoPreviousSibling operations.
 */
export interface SiblingMap {
  'alias': 'arguments' | 'directive' | 'name' | 'selection_set';
  'arguments': 'alias' | 'directive' | 'name' | 'selection_set';
  'arguments_definition': 'description' | 'directive_locations' | 'directives' | 'name' | 'type';
  'boolean_value': 'enum_value' | 'float_value' | 'int_value' | 'list_value' | 'null_value' | 'object_value' | 'string_value' | 'variable';
  'default_value': 'comma' | 'description' | 'directives' | 'name' | 'type' | 'variable';
  'description': 'arguments_definition' | 'default_value' | 'directive_locations' | 'directives' | 'enum_value' | 'enum_values_definition' | 'fields_definition' | 'implements_interfaces' | 'input_fields_definition' | 'name' | 'root_operation_type_definition' | 'type' | 'union_member_types';
  'directive': 'alias' | 'arguments' | 'name' | 'selection_set';
  'directive_definition': 'schema_definition' | 'type_definition';
  'directive_location': 'directive_locations';
  'directive_locations': 'arguments_definition' | 'description' | 'directive_location' | 'name';
  'directives': 'arguments_definition' | 'comma' | 'default_value' | 'description' | 'enum_value' | 'enum_values_definition' | 'fields_definition' | 'fragment_name' | 'implements_interfaces' | 'input_fields_definition' | 'name' | 'operation_type' | 'root_operation_type_definition' | 'selection_set' | 'type' | 'type_condition' | 'union_member_types' | 'variable' | 'variable_definitions';
  'enum_type_definition': 'input_object_type_definition' | 'interface_type_definition' | 'object_type_definition' | 'scalar_type_definition' | 'union_type_definition';
  'enum_type_extension': 'input_object_type_extension' | 'interface_type_extension' | 'object_type_extension' | 'scalar_type_extension' | 'union_type_extension';
  'enum_value': 'boolean_value' | 'description' | 'directives' | 'float_value' | 'int_value' | 'list_value' | 'null_value' | 'object_value' | 'string_value' | 'variable';
  'enum_values_definition': 'description' | 'directives' | 'name';
  'executable_definition': 'type_system_definition' | 'type_system_extension';
  'executable_directive_location': 'type_system_directive_location';
  'field': 'fragment_spread' | 'inline_fragment';
  'fields_definition': 'description' | 'directives' | 'implements_interfaces' | 'name';
  'fragment_definition': 'operation_definition';
  'fragment_name': 'directives' | 'selection_set' | 'type_condition';
  'fragment_spread': 'field' | 'inline_fragment';
  'implements_interfaces': 'description' | 'directives' | 'fields_definition' | 'name' | 'named_type';
  'inline_fragment': 'field' | 'fragment_spread';
  'input_fields_definition': 'description' | 'directives' | 'name';
  'input_object_type_definition': 'enum_type_definition' | 'interface_type_definition' | 'object_type_definition' | 'scalar_type_definition' | 'union_type_definition';
  'input_object_type_extension': 'enum_type_extension' | 'interface_type_extension' | 'object_type_extension' | 'scalar_type_extension' | 'union_type_extension';
  'interface_type_definition': 'enum_type_definition' | 'input_object_type_definition' | 'object_type_definition' | 'scalar_type_definition' | 'union_type_definition';
  'interface_type_extension': 'enum_type_extension' | 'input_object_type_extension' | 'object_type_extension' | 'scalar_type_extension' | 'union_type_extension';
  'list_type': 'named_type' | 'non_null_type';
  'list_value': 'boolean_value' | 'enum_value' | 'float_value' | 'int_value' | 'null_value' | 'object_value' | 'string_value' | 'variable';
  'named_type': 'implements_interfaces' | 'list_type' | 'non_null_type' | 'operation_type' | 'union_member_types';
  'non_null_type': 'list_type' | 'named_type';
  'object_type_definition': 'enum_type_definition' | 'input_object_type_definition' | 'interface_type_definition' | 'scalar_type_definition' | 'union_type_definition';
  'object_type_extension': 'enum_type_extension' | 'input_object_type_extension' | 'interface_type_extension' | 'scalar_type_extension' | 'union_type_extension';
  'object_value': 'boolean_value' | 'enum_value' | 'float_value' | 'int_value' | 'list_value' | 'null_value' | 'string_value' | 'variable';
  'operation_definition': 'fragment_definition';
  'operation_type': 'directives' | 'name' | 'named_type' | 'selection_set' | 'variable_definitions';
  'root_operation_type_definition': 'description' | 'directives';
  'scalar_type_definition': 'enum_type_definition' | 'input_object_type_definition' | 'interface_type_definition' | 'object_type_definition' | 'union_type_definition';
  'scalar_type_extension': 'enum_type_extension' | 'input_object_type_extension' | 'interface_type_extension' | 'object_type_extension' | 'union_type_extension';
  'schema_definition': 'directive_definition' | 'type_definition';
  'schema_extension': 'type_extension';
  'selection_set': 'alias' | 'arguments' | 'directive' | 'directives' | 'fragment_name' | 'name' | 'operation_type' | 'type_condition' | 'variable_definitions';
  'string_value': 'boolean_value' | 'enum_value' | 'float_value' | 'int_value' | 'list_value' | 'null_value' | 'object_value' | 'variable';
  'type': 'arguments_definition' | 'comma' | 'default_value' | 'description' | 'directives' | 'name' | 'variable';
  'type_condition': 'directives' | 'fragment_name' | 'selection_set';
  'type_definition': 'directive_definition' | 'schema_definition';
  'type_extension': 'schema_extension';
  'type_system_definition': 'executable_definition' | 'type_system_extension';
  'type_system_directive_location': 'executable_directive_location';
  'type_system_extension': 'executable_definition' | 'type_system_definition';
  'union_member_types': 'description' | 'directives' | 'name' | 'named_type';
  'union_type_definition': 'enum_type_definition' | 'input_object_type_definition' | 'interface_type_definition' | 'object_type_definition' | 'scalar_type_definition';
  'union_type_extension': 'enum_type_extension' | 'input_object_type_extension' | 'interface_type_extension' | 'object_type_extension' | 'scalar_type_extension';
  'value': 'comma' | 'name';
  'variable': 'boolean_value' | 'comma' | 'default_value' | 'directives' | 'enum_value' | 'float_value' | 'int_value' | 'list_value' | 'null_value' | 'object_value' | 'string_value' | 'type';
  'variable_definitions': 'directives' | 'name' | 'operation_type' | 'selection_set';
  'comma': 'default_value' | 'directives' | 'name' | 'type' | 'value' | 'variable';
  'float_value': 'boolean_value' | 'enum_value' | 'int_value' | 'list_value' | 'null_value' | 'object_value' | 'string_value' | 'variable';
  'int_value': 'boolean_value' | 'enum_value' | 'float_value' | 'list_value' | 'null_value' | 'object_value' | 'string_value' | 'variable';
  'name': 'alias' | 'arguments' | 'arguments_definition' | 'comma' | 'default_value' | 'description' | 'directive' | 'directive_locations' | 'directives' | 'enum_values_definition' | 'fields_definition' | 'implements_interfaces' | 'input_fields_definition' | 'operation_type' | 'selection_set' | 'type' | 'union_member_types' | 'value' | 'variable_definitions';
  'null_value': 'boolean_value' | 'enum_value' | 'float_value' | 'int_value' | 'list_value' | 'object_value' | 'string_value' | 'variable';
}

/**
 * Maps parent node types to ordered sequences of their child types.
 * Used for position-aware type-safe navigation in SEQ rules.
 */
export interface SequenceMap {
  'schema_definition': ['description?', 'directives?'];
  'schema_extension': ['directives?', 'root_operation_type_definition'];
  'scalar_type_extension': ['name', 'directives'];
  'enum_value_definition': ['description?', 'enum_value', 'directives?'];
  'field_definition': ['description?', 'name', 'arguments_definition?', 'type', 'directives?'];
  'input_value_definition': ['description?', 'name', 'type', 'default_value?', 'directives?'];
  'default_value': ['value'];
  'root_operation_type_definition': ['operation_type', 'named_type'];
  'variable_definition': ['variable', 'type', 'default_value?', 'directives?', 'comma?'];
  'field': ['alias?', 'name', 'arguments?', 'directive?', 'selection_set?'];
  'alias': ['name'];
  'argument': ['name', 'value'];
  'variable': ['name'];
  'object_field': ['name', 'value', 'comma?'];
  'fragment_spread': ['fragment_name', 'directives?'];
  'fragment_definition': ['fragment_name', 'type_condition', 'directives?', 'selection_set'];
  'inline_fragment': ['type_condition?', 'directives?', 'selection_set'];
  'type_condition': ['named_type'];
  'directive': ['name', 'arguments?'];
  'list_type': ['type'];
}

/**
 * Maps parent node types to child types at specific positions.
 * Used for type-safe gotoChild(index) operations.
 */
export interface PositionalChildMap {
  'schema_definition': ['description' | null, 'directives' | null];
  'schema_extension': ['directives' | null, 'root_operation_type_definition'];
  'scalar_type_extension': ['name', 'directives'];
  'enum_value_definition': ['description' | null, 'enum_value', 'directives' | null];
  'field_definition': ['description' | null, 'name', 'arguments_definition' | null, 'type', 'directives' | null];
  'input_value_definition': ['description' | null, 'name', 'type', 'default_value' | null, 'directives' | null];
  'default_value': ['value'];
  'root_operation_type_definition': ['operation_type', 'named_type'];
  'variable_definition': ['variable', 'type', 'default_value' | null, 'directives' | null, 'comma' | null];
  'field': ['alias' | null, 'name', 'arguments' | null, 'directive' | null, 'selection_set' | null];
  'alias': ['name'];
  'argument': ['name', 'value'];
  'variable': ['name'];
  'object_field': ['name', 'value', 'comma' | null];
  'fragment_spread': ['fragment_name', 'directives' | null];
  'fragment_definition': ['fragment_name', 'type_condition', 'directives' | null, 'selection_set'];
  'inline_fragment': ['type_condition' | null, 'directives' | null, 'selection_set'];
  'type_condition': ['named_type'];
  'directive': ['name', 'arguments' | null];
  'list_type': ['type'];
}

/**
 * Combined interface providing all cursor position relationship maps.
 * This is the main interface used by the cursor navigation system.
 */
export interface PositionMap {
  /** Child relationships */
  children: ChildMap;
  /** Parent relationships */
  parents: ParentMap;
  /** Sibling relationships */
  siblings: SiblingMap;
  /** Sequence information for ordered navigation */
  sequences: SequenceMap;
  /** Positional child information for index-based access */
  positional: PositionalChildMap;
}

/**
 * Utility type to get child types for a parent node type.
 */
export type GetChildTypes<T extends keyof ChildMap> = ChildMap[T];

/**
 * Utility type to get parent types for a child node type.
 */
export type GetParentTypes<T extends keyof ParentMap> = ParentMap[T];

/**
 * Utility type to get sibling types for a node type.
 */
export type GetSiblingTypes<T extends keyof SiblingMap> = SiblingMap[T];

/**
 * Utility type to get child type at specific position.
 */
export type GetChildAtPosition<
  T extends keyof PositionalChildMap,
  I extends number
> = PositionalChildMap[T] extends readonly (infer U)[]
  ? I extends keyof PositionalChildMap[T]
    ? PositionalChildMap[T][I]
    : never
  : never;
