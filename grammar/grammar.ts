/**
 * Union type containing all rule names in this grammar.
 *
 * IMPORTANT: This type must be kept in sync with the actual rule names in the `rules` object below.
 *
 * Purpose:
 * - Provides type safety for the `$` parameter in rule functions
 * - Enables IntelliSense/autocomplete for `$.rule_name` references
 * - Catches typos in rule references at compile time
 *
 * Usage:
 * - Replace `$: any` with `$: GrammarSymbols<RuleName>` in rule functions
 * - When adding/removing/renaming rules, update this type accordingly
 *
 * Trade-offs:
 * - ✅ Full type safety and IDE support
 * - ❌ Manual maintenance required (circular dependency)
 * - ❌ Must keep type and rules object in sync
 *
 * Alternative: Use `$: any` for simpler maintenance but no type safety
 */
type RuleName =
  | 'source_file'
  | 'document'
  | 'definition'
  | 'executable_definition'
  | 'type_system_definition'
  | 'type_system_extension'
  | 'schema_definition'
  | 'schema_extension'
  | 'type_extension'
  | 'scalar_type_extension'
  | 'object_type_extension'
  | 'interface_type_extension'
  | 'union_type_extension'
  | 'enum_type_extension'
  | 'input_object_type_extension'
  | 'input_fields_definition'
  | 'enum_values_definition'
  | 'enum_value_definition'
  | 'implements_interfaces'
  | 'fields_definition'
  | 'field_definition'
  | 'arguments_definition'
  | 'input_value_definition'
  | 'default_value'
  | 'union_member_types'
  | 'root_operation_type_definition'
  | 'operation_definition'
  | 'operation_type'
  | 'type_definition'
  | 'scalar_type_definition'
  | 'object_type_definition'
  | 'interface_type_definition'
  | 'union_type_definition'
  | 'enum_type_definition'
  | 'input_object_type_definition'
  | 'variable_definitions'
  | 'variable_definition'
  | 'selection_set'
  | 'selection'
  | 'field'
  | 'alias'
  | 'arguments'
  | 'argument'
  | 'value'
  | 'variable'
  | 'string_value'
  | 'int_value'
  | 'float_value'
  | 'boolean_value'
  | 'null_value'
  | 'enum_value'
  | 'list_value'
  | 'object_value'
  | 'object_field'
  | 'fragment_spread'
  | 'fragment_definition'
  | 'fragment_name'
  | 'inline_fragment'
  | 'type_condition'
  | 'directives'
  | 'directive'
  | 'directive_definition'
  | 'directive_locations'
  | 'directive_location'
  | 'executable_directive_location'
  | 'type_system_directive_location'
  | 'type'
  | 'named_type'
  | 'list_type'
  | 'non_null_type'
  | 'name'
  | 'comment'
  | 'comma'
  | 'description';

export default grammar({
  name: 'graphql',

  extras: ($: GrammarSymbols<RuleName>) => [/[\s\uFEFF\u0009\u0020\u000A\u000D]/, $.comma, $.comment],

  rules: {
    source_file: ($: GrammarSymbols<RuleName>) => $.document,
    document: ($: GrammarSymbols<RuleName>) => repeat1($.definition),
    definition: ($: GrammarSymbols<RuleName>) =>
      choice(
        $.executable_definition,
        $.type_system_definition,
        $.type_system_extension,
      ),
    executable_definition: ($: GrammarSymbols<RuleName>) => choice($.operation_definition, $.fragment_definition),
    type_system_definition: ($: GrammarSymbols<RuleName>) =>
      choice($.schema_definition, $.type_definition, $.directive_definition),
    type_system_extension: ($: GrammarSymbols<RuleName>) => choice($.schema_extension, $.type_extension),
    schema_definition: ($: GrammarSymbols<RuleName>) =>
      seq(
        optional($.description),
        'schema',
        optional($.directives),
        '{',
        repeat1($.root_operation_type_definition),
        '}',
      ),
    schema_extension: ($: GrammarSymbols<RuleName>) =>
      seq(
        'extend',
        'schema',
        optional($.directives),
        '{',
        $.root_operation_type_definition,
        '}',
      ),
    type_extension: ($: GrammarSymbols<RuleName>) =>
      choice(
        $.scalar_type_extension,
        $.object_type_extension,
        $.interface_type_extension,
        $.union_type_extension,
        $.enum_type_extension,
        $.input_object_type_extension,
      ),
    scalar_type_extension: ($: GrammarSymbols<RuleName>) => seq('extend', 'scalar', $.name, $.directives),
    object_type_extension: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        choice(
          seq(
            'extend',
            'type',
            $.name,
            optional($.implements_interfaces),
            optional($.directives),
            $.fields_definition,
          ),
          seq(
            'extend',
            'type',
            $.name,
            optional($.implements_interfaces),
            optional($.directives),
          ),
        ),
      ),
    interface_type_extension: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        choice(
          seq(
            'extend',
            'interface',
            $.name,
            optional($.implements_interfaces),
            optional($.directives),
            $.fields_definition,
          ),
          seq(
            'extend',
            'interface',
            $.name,
            optional($.implements_interfaces),
            optional($.directives),
          ),
        ),
      ),
    union_type_extension: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        choice(
          seq(
            'extend',
            'union',
            $.name,
            optional($.directives),
            $.union_member_types,
          ),
          seq('extend', 'union', $.name, optional($.directives)),
        ),
      ),
    enum_type_extension: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        choice(
          seq(
            'extend',
            'enum',
            $.name,
            optional($.directives),
            $.enum_values_definition,
          ),
          seq('extend', 'enum', $.name, optional($.directives)),
        ),
      ),
    input_object_type_extension: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        choice(
          seq(
            'extend',
            'input',
            $.name,
            optional($.directives),
            repeat1($.input_fields_definition),
          ),
          seq('extend', 'input', $.name, optional($.directives)),
        ),
      ),
    input_fields_definition: ($: GrammarSymbols<RuleName>) => seq('{', repeat1($.input_value_definition), '}'),
    enum_values_definition: ($: GrammarSymbols<RuleName>) => seq('{', repeat1($.enum_value_definition), '}'),
    enum_value_definition: ($: GrammarSymbols<RuleName>) =>
      seq(optional($.description), $.enum_value, optional($.directives)),
    implements_interfaces: ($: GrammarSymbols<RuleName>) =>
      choice(
        seq($.implements_interfaces, '&', $.named_type),
        seq('implements', optional('&'), $.named_type),
      ),
    fields_definition: ($: GrammarSymbols<RuleName>) => seq('{', repeat1($.field_definition), '}'),
    field_definition: ($: GrammarSymbols<RuleName>) =>
      seq(
        optional($.description),
        $.name,
        optional($.arguments_definition),
        ':',
        $.type,
        optional($.directives),
      ),
    arguments_definition: ($: GrammarSymbols<RuleName>) => seq('(', repeat1($.input_value_definition), ')'),
    input_value_definition: ($: GrammarSymbols<RuleName>) =>
      seq(
        optional($.description),
        $.name,
        ':',
        $.type,
        optional($.default_value),
        optional($.directives),
      ),
    default_value: ($: GrammarSymbols<RuleName>) => seq('=', $.value),
    union_member_types: ($: GrammarSymbols<RuleName>) =>
      choice(
        seq($.union_member_types, '|', $.named_type),
        seq('=', optional('|'), $.named_type),
      ),
    root_operation_type_definition: ($: GrammarSymbols<RuleName>) => seq($.operation_type, ':', $.named_type),
    operation_definition: ($: GrammarSymbols<RuleName>) =>
      choice(
        $.selection_set,
        seq(
          $.operation_type,
          optional($.name),
          optional($.variable_definitions),
          optional($.directives),
          $.selection_set,
        ),
      ),
    operation_type: () => choice('query', 'mutation', 'subscription'),
    type_definition: ($: GrammarSymbols<RuleName>) =>
      choice(
        $.scalar_type_definition,
        $.object_type_definition,
        $.interface_type_definition,
        $.union_type_definition,
        $.enum_type_definition,
        $.input_object_type_definition,
      ),
    scalar_type_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        seq(optional($.description), 'scalar', $.name, optional($.directives)),
      ),
    object_type_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        seq(
          optional($.description),
          'type',
          $.name,
          optional($.implements_interfaces),
          optional($.directives),
          optional($.fields_definition),
        ),
      ),
    interface_type_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        seq(
          optional($.description),
          'interface',
          $.name,
          optional($.implements_interfaces),
          optional($.directives),
          optional($.fields_definition),
        ),
      ),
    union_type_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        seq(
          optional($.description),
          'union',
          $.name,
          optional($.directives),
          optional($.union_member_types),
        ),
      ),
    enum_type_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        seq(
          optional($.description),
          'enum',
          $.name,
          optional($.directives),
          optional($.enum_values_definition),
        ),
      ),
    input_object_type_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        seq(
          optional($.description),
          'input',
          $.name,
          optional($.directives),
          optional($.input_fields_definition),
        ),
      ),
    variable_definitions: ($: GrammarSymbols<RuleName>) => seq('(', repeat1($.variable_definition), ')'),
    variable_definition: ($: GrammarSymbols<RuleName>) =>
      seq(
        $.variable,
        ':',
        $.type,
        optional($.default_value),
        optional($.directives),
        optional($.comma),
      ),
    selection_set: ($: GrammarSymbols<RuleName>) => seq('{', repeat1($.selection), '}'),
    selection: ($: GrammarSymbols<RuleName>) => choice($.field, $.inline_fragment, $.fragment_spread),
    field: ($: GrammarSymbols<RuleName>) =>
      seq(
        optional($.alias),
        $.name,
        optional($.arguments),
        optional($.directive),
        optional($.selection_set),
      ),
    alias: ($: GrammarSymbols<RuleName>) => seq($.name, ':'),
    arguments: ($: GrammarSymbols<RuleName>) => seq('(', repeat1($.argument), ')'),
    argument: ($: GrammarSymbols<RuleName>) => seq($.name, ':', $.value),
    value: ($: GrammarSymbols<RuleName>) =>
      choice(
        $.variable,
        $.string_value,
        $.int_value,
        $.float_value,
        $.boolean_value,
        $.null_value,
        $.enum_value,
        $.list_value,
        $.object_value,
      ),
    variable: ($: GrammarSymbols<RuleName>) => seq('$', $.name),
    string_value: () =>
      choice(
        seq('"""', /([^"]|\n|""?[^"])*/, '"""'),
        seq('"', /[^"\\\n]*/, '"'),
      ),
    int_value: () => /-?(0|[1-9][0-9]*)/,
    float_value: () =>
      token(
        seq(
          /-?(0|[1-9][0-9]*)/,
          choice(
            /\.[0-9]+/,
            /(e|E)(\+|-)?[0-9]+/,
            seq(/\.[0-9]+/, /(e|E)(\+|-)?[0-9]+/),
          ),
        ),
      ),
    boolean_value: () => choice('true', 'false'),
    null_value: () => 'null',
    enum_value: ($: GrammarSymbols<RuleName>) => $.name,
    list_value: ($: GrammarSymbols<RuleName>) => seq('[', repeat($.value), ']'),
    object_value: ($: GrammarSymbols<RuleName>) => seq('{', repeat($.object_field), '}'),
    object_field: ($: GrammarSymbols<RuleName>) => seq($.name, ':', $.value, optional($.comma)),
    fragment_spread: ($: GrammarSymbols<RuleName>) => seq('...', $.fragment_name, optional($.directives)),
    fragment_definition: ($: GrammarSymbols<RuleName>) =>
      seq(
        'fragment',
        $.fragment_name,
        $.type_condition,
        optional($.directives),
        $.selection_set,
      ),
    fragment_name: ($: GrammarSymbols<RuleName>) => $.name,
    inline_fragment: ($: GrammarSymbols<RuleName>) =>
      seq(
        '...',
        optional($.type_condition),
        optional($.directives),
        $.selection_set,
      ),
    type_condition: ($: GrammarSymbols<RuleName>) => seq('on', $.named_type),
    directives: ($: GrammarSymbols<RuleName>) => repeat1($.directive),
    directive: ($: GrammarSymbols<RuleName>) => seq('@', $.name, optional($.arguments)),
    directive_definition: ($: GrammarSymbols<RuleName>) =>
      prec.right(
        1,
        seq(
          optional($.description),
          'directive',
          '@',
          $.name,
          optional($.arguments_definition),
          optional('repeatable'),
          'on',
          $.directive_locations,
        ),
      ),
    directive_locations: ($: GrammarSymbols<RuleName>) =>
      choice(
        seq($.directive_locations, '|', $.directive_location),
        seq(optional('|'), $.directive_location),
      ),
    directive_location: ($: GrammarSymbols<RuleName>) =>
      choice($.executable_directive_location, $.type_system_directive_location),
    executable_directive_location: () =>
      choice(
        'QUERY',
        'MUTATION',
        'SUBSCRIPTION',
        'FIELD',
        'FRAGMENT_DEFINITION',
        'FRAGMENT_SPREAD',
        'INLINE_FRAGMENT',
        'VARIABLE_DEFINITION',
      ),
    type_system_directive_location: () =>
      choice(
        'SCHEMA',
        'SCALAR',
        'OBJECT',
        'FIELD_DEFINITION',
        'ARGUMENT_DEFINITION',
        'INTERFACE',
        'UNION',
        'ENUM',
        'ENUM_VALUE',
        'INPUT_OBJECT',
        'INPUT_FIELD_DEFINITION',
      ),
    type: ($: GrammarSymbols<RuleName>) => choice($.named_type, $.list_type, $.non_null_type),
    named_type: ($: GrammarSymbols<RuleName>) => $.name,
    list_type: ($: GrammarSymbols<RuleName>) => seq('[', $.type, ']'),
    non_null_type: ($: GrammarSymbols<RuleName>) => choice(seq($.named_type, '!'), seq($.list_type, '!')),
    name: () => /[_A-Za-z][_0-9A-Za-z]*/,
    comment: () => token(seq('#', /.*/)),
    comma: () => ',',
    description: ($: GrammarSymbols<RuleName>) => $.string_value,
  },
});
