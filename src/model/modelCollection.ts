import {object, array, string, link, alternatives, bool, ObjectSchema} from "@hapi/joi";

export interface ModelCollection {
  name: string;
  schema: string;
}

export type BsonType =
  | "object"
  | "string"
  | "objectid"
  | "bool"
  | "double"
  | "number"
  | "array"
  | "date"
  | "int"
  | "timestamp"
  | "decimal"
  | "long";

export interface IStringSchema {
  type: "string";
  enum?: string[];
}
export const JStringSchema = object({
  type: string().valid("string"),
  enum: array().items(string())
}).id("JStringSchema");

export interface IObjectIdSchema {
  type: "objectid";
}

export interface IBoolSchema {
  type: "bool";
}

export interface IDoubleSchema {
  type: "double" | "number";
  min?: number;
  max?: number;
}

interface BaseField {
  optional?: boolean;
}

function toFieldSchema(schema: ObjectSchema){
  schema.keys({
    optional: bool()
  })
}

export type IField = Schema & BaseField;

export interface IObjectSchema {
  type: "object";
  fields: Record<string, IField>;
}
export const JObjectSchema = object({
  type: string().valid("object"),
  fields: object().pattern(string(), JFieldSchema)
});

export function isObjectSchema(schema: Schema): schema is IObjectSchema {
  return schema.type === "object";
}

export interface IArraySchema {
  type: "array";
  itemType: Schema;
}

export type Schema =
  | IObjectSchema
  | IStringSchema
  | IObjectIdSchema
  | IBoolSchema
  | IArraySchema
  | IDoubleSchema;

export const JSchema = alternatives()
  .id("JSchema")
  .match("one")
  .try(JStringSchema, JObjectSchema);
