import { Schema } from 'effect';

const Field = Schema.Struct({
  multiple: Schema.Boolean,
  required: Schema.Boolean,
  types: Schema.Array(
    Schema.Struct({
      type: Schema.String,
      named: Schema.Boolean,
    }),
  ),
});

export const NodeType = Schema.Struct({
  type: Schema.String,
  named: Schema.Boolean,
  fields: Schema.optional(Schema.Record({ key: Schema.String, value: Field })),
  children: Schema.optional(
    Schema.Struct({
      multiple: Schema.Boolean,
      required: Schema.Boolean,
      types: Schema.Array(
        Schema.Struct({
          type: Schema.String,
          named: Schema.Boolean,
        }),
      ),
    }),
  ),
  subtypes: Schema.optional(
    Schema.Array(
      Schema.Struct({
        type: Schema.String,
        named: Schema.Boolean,
      }),
    ),
  ),
});
export type NodeType = Schema.Schema.Type<typeof NodeType>;
