/**
 * Navigator utilities for graphql
 * @generated
 */

import type { Tree, Node } from 'web-tree-sitter';
import { NavigationExpectationError } from '../errors/navigation-expectation-error.js';
import type { AliasNode } from '../nodes/alias.js';
import type { ArgumentNode } from '../nodes/argument.js';
import type { ArgumentsNode } from '../nodes/arguments.js';
import type { ArgumentsDefinitionNode } from '../nodes/arguments_definition.js';
import type { BooleanValueNode } from '../nodes/boolean_value.js';
import type { DefaultValueNode } from '../nodes/default_value.js';
import type { DefinitionNode } from '../nodes/definition.js';
import type { DescriptionNode } from '../nodes/description.js';
import type { DirectiveNode } from '../nodes/directive.js';
import type { DirectiveDefinitionNode } from '../nodes/directive_definition.js';
import type { DirectiveLocationNode } from '../nodes/directive_location.js';
import type { DirectiveLocationsNode } from '../nodes/directive_locations.js';
import type { DirectivesNode } from '../nodes/directives.js';
import type { DocumentNode } from '../nodes/document.js';
import type { EnumTypeDefinitionNode } from '../nodes/enum_type_definition.js';
import type { EnumTypeExtensionNode } from '../nodes/enum_type_extension.js';
import type { EnumValueNode } from '../nodes/enum_value.js';
import type { EnumValueDefinitionNode } from '../nodes/enum_value_definition.js';
import type { EnumValuesDefinitionNode } from '../nodes/enum_values_definition.js';
import type { ExecutableDefinitionNode } from '../nodes/executable_definition.js';
import type { ExecutableDirectiveLocationNode } from '../nodes/executable_directive_location.js';
import type { FieldNode } from '../nodes/field.js';
import type { FieldDefinitionNode } from '../nodes/field_definition.js';
import type { FieldsDefinitionNode } from '../nodes/fields_definition.js';
import type { FragmentDefinitionNode } from '../nodes/fragment_definition.js';
import type { FragmentNameNode } from '../nodes/fragment_name.js';
import type { FragmentSpreadNode } from '../nodes/fragment_spread.js';
import type { ImplementsInterfacesNode } from '../nodes/implements_interfaces.js';
import type { InlineFragmentNode } from '../nodes/inline_fragment.js';
import type { InputFieldsDefinitionNode } from '../nodes/input_fields_definition.js';
import type { InputObjectTypeDefinitionNode } from '../nodes/input_object_type_definition.js';
import type { InputObjectTypeExtensionNode } from '../nodes/input_object_type_extension.js';
import type { InputValueDefinitionNode } from '../nodes/input_value_definition.js';
import type { InterfaceTypeDefinitionNode } from '../nodes/interface_type_definition.js';
import type { InterfaceTypeExtensionNode } from '../nodes/interface_type_extension.js';
import type { ListTypeNode } from '../nodes/list_type.js';
import type { ListValueNode } from '../nodes/list_value.js';
import type { NamedTypeNode } from '../nodes/named_type.js';
import type { NonNullTypeNode } from '../nodes/non_null_type.js';
import type { ObjectFieldNode } from '../nodes/object_field.js';
import type { ObjectTypeDefinitionNode } from '../nodes/object_type_definition.js';
import type { ObjectTypeExtensionNode } from '../nodes/object_type_extension.js';
import type { ObjectValueNode } from '../nodes/object_value.js';
import type { OperationDefinitionNode } from '../nodes/operation_definition.js';
import type { OperationTypeNode } from '../nodes/operation_type.js';
import type { RootOperationTypeDefinitionNode } from '../nodes/root_operation_type_definition.js';
import type { ScalarTypeDefinitionNode } from '../nodes/scalar_type_definition.js';
import type { ScalarTypeExtensionNode } from '../nodes/scalar_type_extension.js';
import type { SchemaDefinitionNode } from '../nodes/schema_definition.js';
import type { SchemaExtensionNode } from '../nodes/schema_extension.js';
import type { SelectionNode } from '../nodes/selection.js';
import type { SelectionSetNode } from '../nodes/selection_set.js';
import type { SourceFileNode } from '../nodes/source_file.js';
import type { StringValueNode } from '../nodes/string_value.js';
import type { TypeNode } from '../nodes/type.js';
import type { TypeConditionNode } from '../nodes/type_condition.js';
import type { TypeDefinitionNode } from '../nodes/type_definition.js';
import type { TypeExtensionNode } from '../nodes/type_extension.js';
import type { TypeSystemDefinitionNode } from '../nodes/type_system_definition.js';
import type { TypeSystemDirectiveLocationNode } from '../nodes/type_system_directive_location.js';
import type { TypeSystemExtensionNode } from '../nodes/type_system_extension.js';
import type { UnionMemberTypesNode } from '../nodes/union_member_types.js';
import type { UnionTypeDefinitionNode } from '../nodes/union_type_definition.js';
import type { UnionTypeExtensionNode } from '../nodes/union_type_extension.js';
import type { ValueNode } from '../nodes/value.js';
import type { VariableNode } from '../nodes/variable.js';
import type { VariableDefinitionNode } from '../nodes/variable_definition.js';
import type { VariableDefinitionsNode } from '../nodes/variable_definitions.js';
import type { CommaNode } from '../nodes/comma.js';
import type { CommentNode } from '../nodes/comment.js';
import type { FloatValueNode } from '../nodes/float_value.js';
import type { IntValueNode } from '../nodes/int_value.js';
import type { NameNode } from '../nodes/name.js';
import type { NullValueNode } from '../nodes/null_value.js';
import type { Exclamation } from '../nodes/anonymous/exclamation.js';
import type { Quote } from '../nodes/anonymous/quote.js';
import type { TripleQuote } from '../nodes/anonymous/triple_quote.js';
import type { Dollar } from '../nodes/anonymous/dollar.js';
import type { Ampersand } from '../nodes/anonymous/ampersand.js';
import type { Lparen } from '../nodes/anonymous/lparen.js';
import type { Rparen } from '../nodes/anonymous/rparen.js';
import type { Ellipsis } from '../nodes/anonymous/ellipsis.js';
import type { Colon } from '../nodes/anonymous/colon.js';
import type { Equals } from '../nodes/anonymous/equals.js';
import type { At } from '../nodes/anonymous/at.js';
import type { UpperArgumentDefinition } from '../nodes/anonymous/upper_argument_definition.js';
import type { UpperEnum } from '../nodes/anonymous/upper_enum.js';
import type { UpperEnumValue } from '../nodes/anonymous/upper_enum_value.js';
import type { UpperField } from '../nodes/anonymous/upper_field.js';
import type { UpperFieldDefinition } from '../nodes/anonymous/upper_field_definition.js';
import type { UpperFragmentDefinition } from '../nodes/anonymous/upper_fragment_definition.js';
import type { UpperFragmentSpread } from '../nodes/anonymous/upper_fragment_spread.js';
import type { UpperInlineFragment } from '../nodes/anonymous/upper_inline_fragment.js';
import type { UpperInputFieldDefinition } from '../nodes/anonymous/upper_input_field_definition.js';
import type { UpperInputObject } from '../nodes/anonymous/upper_input_object.js';
import type { UpperInterface } from '../nodes/anonymous/upper_interface.js';
import type { UpperMutation } from '../nodes/anonymous/upper_mutation.js';
import type { UpperObject } from '../nodes/anonymous/upper_object.js';
import type { UpperQuery } from '../nodes/anonymous/upper_query.js';
import type { UpperScalar } from '../nodes/anonymous/upper_scalar.js';
import type { UpperSchema } from '../nodes/anonymous/upper_schema.js';
import type { UpperSubscription } from '../nodes/anonymous/upper_subscription.js';
import type { UpperUnion } from '../nodes/anonymous/upper_union.js';
import type { UpperVariableDefinition } from '../nodes/anonymous/upper_variable_definition.js';
import type { Lbracket } from '../nodes/anonymous/lbracket.js';
import type { Rbracket } from '../nodes/anonymous/rbracket.js';
import type { Directive } from '../nodes/anonymous/directive.js';
import type { Enum } from '../nodes/anonymous/enum.js';
import type { Extend } from '../nodes/anonymous/extend.js';
import type { False } from '../nodes/anonymous/false.js';
import type { Fragment } from '../nodes/anonymous/fragment.js';
import type { Implements } from '../nodes/anonymous/implements.js';
import type { Input } from '../nodes/anonymous/input.js';
import type { Interface } from '../nodes/anonymous/interface.js';
import type { Mutation } from '../nodes/anonymous/mutation.js';
import type { On } from '../nodes/anonymous/on.js';
import type { Query } from '../nodes/anonymous/query.js';
import type { Repeatable } from '../nodes/anonymous/repeatable.js';
import type { Scalar } from '../nodes/anonymous/scalar.js';
import type { Schema } from '../nodes/anonymous/schema.js';
import type { Subscription } from '../nodes/anonymous/subscription.js';
import type { True } from '../nodes/anonymous/true.js';
import type { Type } from '../nodes/anonymous/type.js';
import type { Union } from '../nodes/anonymous/union.js';
import type { Lbrace } from '../nodes/anonymous/lbrace.js';
import type { Pipe } from '../nodes/anonymous/pipe.js';
import type { Rbrace } from '../nodes/anonymous/rbrace.js';

export interface Navigator<N extends Node = Node> {
  node: N;
  path: string[];
  child(index?: number): Navigator | null;
}

export interface SourceFileNavigator {
  node: SourceFileNode;
  path: string[]
  child(): DocumentNavigator;
}

export interface AliasNavigator {
  node: AliasNode;
  path: string[]
  child(): NameNode;
}

export interface ArgumentNavigator {
  node: ArgumentNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ArgumentsNavigator {
  node: ArgumentsNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ArgumentsDefinitionNavigator {
  node: ArgumentsDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DefaultValueNavigator {
  node: DefaultValueNode;
  path: string[]
  child(): ValueNavigator;
}

export interface DefinitionNavigator {
  node: DefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DescriptionNavigator {
  node: DescriptionNode;
  path: string[]
  child(): StringValueNode;
}

export interface DirectiveNavigator {
  node: DirectiveNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DirectiveDefinitionNavigator {
  node: DirectiveDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DirectiveLocationNavigator {
  node: DirectiveLocationNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DirectiveLocationsNavigator {
  node: DirectiveLocationsNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DirectivesNavigator {
  node: DirectivesNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface DocumentNavigator {
  node: DocumentNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface EnumTypeDefinitionNavigator {
  node: EnumTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface EnumTypeExtensionNavigator {
  node: EnumTypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface EnumValueNavigator {
  node: EnumValueNode;
  path: string[]
  child(): NameNode;
}

export interface EnumValueDefinitionNavigator {
  node: EnumValueDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface EnumValuesDefinitionNavigator {
  node: EnumValuesDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ExecutableDefinitionNavigator {
  node: ExecutableDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface FieldNavigator {
  node: FieldNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface FieldDefinitionNavigator {
  node: FieldDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface FieldsDefinitionNavigator {
  node: FieldsDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface FragmentDefinitionNavigator {
  node: FragmentDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface FragmentNameNavigator {
  node: FragmentNameNode;
  path: string[]
  child(): NameNode;
}

export interface FragmentSpreadNavigator {
  node: FragmentSpreadNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ImplementsInterfacesNavigator {
  node: ImplementsInterfacesNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InlineFragmentNavigator {
  node: InlineFragmentNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InputFieldsDefinitionNavigator {
  node: InputFieldsDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InputObjectTypeDefinitionNavigator {
  node: InputObjectTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InputObjectTypeExtensionNavigator {
  node: InputObjectTypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InputValueDefinitionNavigator {
  node: InputValueDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InterfaceTypeDefinitionNavigator {
  node: InterfaceTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface InterfaceTypeExtensionNavigator {
  node: InterfaceTypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ListTypeNavigator {
  node: ListTypeNode;
  path: string[]
  child(): TypeNavigator;
}

export interface ListValueNavigator {
  node: ListValueNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface NamedTypeNavigator {
  node: NamedTypeNode;
  path: string[]
  child(): NameNode;
}

export interface NonNullTypeNavigator {
  node: NonNullTypeNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ObjectFieldNavigator {
  node: ObjectFieldNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ObjectTypeDefinitionNavigator {
  node: ObjectTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ObjectTypeExtensionNavigator {
  node: ObjectTypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ObjectValueNavigator {
  node: ObjectValueNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface OperationDefinitionNavigator {
  node: OperationDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface RootOperationTypeDefinitionNavigator {
  node: RootOperationTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ScalarTypeDefinitionNavigator {
  node: ScalarTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ScalarTypeExtensionNavigator {
  node: ScalarTypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface SchemaDefinitionNavigator {
  node: SchemaDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface SchemaExtensionNavigator {
  node: SchemaExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface SelectionNavigator {
  node: SelectionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface SelectionSetNavigator {
  node: SelectionSetNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface TypeNavigator {
  node: TypeNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface TypeConditionNavigator {
  node: TypeConditionNode;
  path: string[]
  child(): NamedTypeNavigator;
}

export interface TypeDefinitionNavigator {
  node: TypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface TypeExtensionNavigator {
  node: TypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface TypeSystemDefinitionNavigator {
  node: TypeSystemDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface TypeSystemExtensionNavigator {
  node: TypeSystemExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface UnionMemberTypesNavigator {
  node: UnionMemberTypesNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface UnionTypeDefinitionNavigator {
  node: UnionTypeDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface UnionTypeExtensionNavigator {
  node: UnionTypeExtensionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface ValueNavigator {
  node: ValueNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface VariableNavigator {
  node: VariableNode;
  path: string[]
  child(): NameNode;
}

export interface VariableDefinitionNavigator {
  node: VariableDefinitionNode;
  path: string[]
  child(index?: number): Navigator | null;
}

export interface VariableDefinitionsNavigator {
  node: VariableDefinitionsNode;
  path: string[]
  child(index?: number): Navigator | null;
}

/**
 * Create a navigator from a tree (always returns the root source_file node)
 */
export async function create(tree: Tree, path: string[] = []): Promise<SourceFileNavigator> {
  const rootNode = tree.rootNode as SourceFileNode;
  return createSourceFileNavigator(rootNode, path);
}

function createSourceFileNavigator(node: SourceFileNode, path: string[]): SourceFileNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild as DocumentNode;
      if (!childNode) {
        throw new NavigationExpectationError('Expected document child but found none', {
          expectedNodeType: 'document',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      const childPath = [...path, 'child()'];
      return createDocumentNavigator(childNode, childPath);
    },
  };
}

function createAliasNavigator(node: AliasNode, path: string[]): AliasNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected name child but found none', {
          expectedNodeType: 'name',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode as NameNode;
    },
  };
}

function createArgumentNavigator(node: ArgumentNode, path: string[]): ArgumentNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createArgumentsNavigator(node: ArgumentsNode, path: string[]): ArgumentsNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createArgumentsDefinitionNavigator(node: ArgumentsDefinitionNode, path: string[]): ArgumentsDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDefaultValueNavigator(node: DefaultValueNode, path: string[]): DefaultValueNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected value child but found none', {
          expectedNodeType: 'value',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      const childPath = [...path, 'child()'];
      return createValueNavigator(childNode as ValueNode, childPath);
    },
  };
}

function createDefinitionNavigator(node: DefinitionNode, path: string[]): DefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDescriptionNavigator(node: DescriptionNode, path: string[]): DescriptionNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected string_value child but found none', {
          expectedNodeType: 'string_value',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode as StringValueNode;
    },
  };
}

function createDirectiveNavigator(node: DirectiveNode, path: string[]): DirectiveNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDirectiveDefinitionNavigator(node: DirectiveDefinitionNode, path: string[]): DirectiveDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDirectiveLocationNavigator(node: DirectiveLocationNode, path: string[]): DirectiveLocationNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDirectiveLocationsNavigator(node: DirectiveLocationsNode, path: string[]): DirectiveLocationsNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDirectivesNavigator(node: DirectivesNode, path: string[]): DirectivesNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createDocumentNavigator(node: DocumentNode, path: string[]): DocumentNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createEnumTypeDefinitionNavigator(node: EnumTypeDefinitionNode, path: string[]): EnumTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createEnumTypeExtensionNavigator(node: EnumTypeExtensionNode, path: string[]): EnumTypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createEnumValueNavigator(node: EnumValueNode, path: string[]): EnumValueNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected name child but found none', {
          expectedNodeType: 'name',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode as NameNode;
    },
  };
}

function createEnumValueDefinitionNavigator(node: EnumValueDefinitionNode, path: string[]): EnumValueDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createEnumValuesDefinitionNavigator(node: EnumValuesDefinitionNode, path: string[]): EnumValuesDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createExecutableDefinitionNavigator(node: ExecutableDefinitionNode, path: string[]): ExecutableDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createFieldNavigator(node: FieldNode, path: string[]): FieldNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createFieldDefinitionNavigator(node: FieldDefinitionNode, path: string[]): FieldDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createFieldsDefinitionNavigator(node: FieldsDefinitionNode, path: string[]): FieldsDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createFragmentDefinitionNavigator(node: FragmentDefinitionNode, path: string[]): FragmentDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createFragmentNameNavigator(node: FragmentNameNode, path: string[]): FragmentNameNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected name child but found none', {
          expectedNodeType: 'name',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode as NameNode;
    },
  };
}

function createFragmentSpreadNavigator(node: FragmentSpreadNode, path: string[]): FragmentSpreadNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createImplementsInterfacesNavigator(node: ImplementsInterfacesNode, path: string[]): ImplementsInterfacesNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInlineFragmentNavigator(node: InlineFragmentNode, path: string[]): InlineFragmentNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInputFieldsDefinitionNavigator(node: InputFieldsDefinitionNode, path: string[]): InputFieldsDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInputObjectTypeDefinitionNavigator(node: InputObjectTypeDefinitionNode, path: string[]): InputObjectTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInputObjectTypeExtensionNavigator(node: InputObjectTypeExtensionNode, path: string[]): InputObjectTypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInputValueDefinitionNavigator(node: InputValueDefinitionNode, path: string[]): InputValueDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInterfaceTypeDefinitionNavigator(node: InterfaceTypeDefinitionNode, path: string[]): InterfaceTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createInterfaceTypeExtensionNavigator(node: InterfaceTypeExtensionNode, path: string[]): InterfaceTypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createListTypeNavigator(node: ListTypeNode, path: string[]): ListTypeNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected type child but found none', {
          expectedNodeType: 'type',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      const childPath = [...path, 'child()'];
      return createTypeNavigator(childNode as TypeNode, childPath);
    },
  };
}

function createListValueNavigator(node: ListValueNode, path: string[]): ListValueNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createNamedTypeNavigator(node: NamedTypeNode, path: string[]): NamedTypeNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected name child but found none', {
          expectedNodeType: 'name',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode as NameNode;
    },
  };
}

function createNonNullTypeNavigator(node: NonNullTypeNode, path: string[]): NonNullTypeNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createObjectFieldNavigator(node: ObjectFieldNode, path: string[]): ObjectFieldNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createObjectTypeDefinitionNavigator(node: ObjectTypeDefinitionNode, path: string[]): ObjectTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createObjectTypeExtensionNavigator(node: ObjectTypeExtensionNode, path: string[]): ObjectTypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createObjectValueNavigator(node: ObjectValueNode, path: string[]): ObjectValueNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createOperationDefinitionNavigator(node: OperationDefinitionNode, path: string[]): OperationDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createRootOperationTypeDefinitionNavigator(node: RootOperationTypeDefinitionNode, path: string[]): RootOperationTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createScalarTypeDefinitionNavigator(node: ScalarTypeDefinitionNode, path: string[]): ScalarTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createScalarTypeExtensionNavigator(node: ScalarTypeExtensionNode, path: string[]): ScalarTypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createSchemaDefinitionNavigator(node: SchemaDefinitionNode, path: string[]): SchemaDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createSchemaExtensionNavigator(node: SchemaExtensionNode, path: string[]): SchemaExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createSelectionNavigator(node: SelectionNode, path: string[]): SelectionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createSelectionSetNavigator(node: SelectionSetNode, path: string[]): SelectionSetNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createTypeNavigator(node: TypeNode, path: string[]): TypeNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createTypeConditionNavigator(node: TypeConditionNode, path: string[]): TypeConditionNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected named_type child but found none', {
          expectedNodeType: 'named_type',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      const childPath = [...path, 'child()'];
      return createNamedTypeNavigator(childNode as NamedTypeNode, childPath);
    },
  };
}

function createTypeDefinitionNavigator(node: TypeDefinitionNode, path: string[]): TypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createTypeExtensionNavigator(node: TypeExtensionNode, path: string[]): TypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createTypeSystemDefinitionNavigator(node: TypeSystemDefinitionNode, path: string[]): TypeSystemDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createTypeSystemExtensionNavigator(node: TypeSystemExtensionNode, path: string[]): TypeSystemExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createUnionMemberTypesNavigator(node: UnionMemberTypesNode, path: string[]): UnionMemberTypesNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createUnionTypeDefinitionNavigator(node: UnionTypeDefinitionNode, path: string[]): UnionTypeDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createUnionTypeExtensionNavigator(node: UnionTypeExtensionNode, path: string[]): UnionTypeExtensionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createValueNavigator(node: ValueNode, path: string[]): ValueNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createVariableNavigator(node: VariableNode, path: string[]): VariableNavigator {
  return {
    node,
    path,
    child() {
      const childNode = node.firstChild;
      if (!childNode) {
        throw new NavigationExpectationError('Expected name child but found none', {
          expectedNodeType: 'name',
          actualNodeType: null,
          path: [...path, 'child()']
        });
      }
      return childNode as NameNode;
    },
  };
}

function createVariableDefinitionNavigator(node: VariableDefinitionNode, path: string[]): VariableDefinitionNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createVariableDefinitionsNavigator(node: VariableDefinitionsNode, path: string[]): VariableDefinitionsNavigator {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}

function createNavigator<N extends Node>(node: N, path: string[]): Navigator<N> {
  return {
    node,
    path,
    child(index = 0) {
      const childNode = node.children[index];
      if (childNode) {
        const childPath = [...path, `child(${index})`];
        return createNavigator(childNode, childPath);
      }
      return null;
    },
  };
}