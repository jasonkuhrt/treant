// Tree-sitter provides these as globals when evaluating the grammar

export default grammar({
  name: "test",

  extras: ($) => [
    /\s/,
  ],

  rules: {
    source_file: ($) => repeat($.statement),
    
    statement: ($) => choice(
      $.assignment,
      $.expression_statement,
    ),
    
    assignment: ($) => seq(
      $.identifier,
      '=',
      $.expression,
      ';',
    ),
    
    expression_statement: ($) => seq(
      $.expression,
      ';',
    ),
    
    expression: ($) => choice(
      $.identifier,
      $.number,
      $.binary_expression,
    ),
    
    binary_expression: ($) => choice(
      seq($.expression, '+', $.expression),
      seq($.expression, '-', $.expression),
      seq($.expression, '*', $.expression),
      seq($.expression, '/', $.expression),
    ),
    
    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,
    
    number: () => /\d+/,
  }
});