import * as joi from "@hapi/joi";
import {object} from "@hapi/joi";
import {string} from "@hapi/joi";

export interface ModelCollection {
  name: string;
  schema: string;
}

export const JModelCollection = object({
  name: string().regex(/^[a-z]+$/).required(),
  schema: string().required()
});

export type BsonType =
  | "object"
  | "string"
  | "objectid"
  | "bool"
  | "double"
  | "number"
  | "array"
  | "date";

export interface IStringSchema {
  type: "string";
  enum?: string[];
}

export const JStringSchema = joi.object({
  type: joi.string().valid("string"),
  enum: joi.array().items(joi.string())
});

export interface IObjectIdSchema {
  type: "objectid";
}

export const JObjectIdSchema = joi.object({
  type: joi.string().valid("objectid")
});

export interface IBoolSchema {
  type: "bool";
}

export const JBoolSchema = joi.object({
  type: joi.string().valid("bool")
});

export interface IDateSchema {
  type: "date";
}

export const JArraySchema = joi.object({
  type: joi.string().valid("array"),
  itemType: joi.link("JSchema")
});

export interface IArraySchema {
  type: "array";
  itemType: Schema;
}

export const JDateSchema = joi.object({
  type: joi.string().valid("date")
});

export interface IDoubleSchema {
  type: "double" | "number";
  min?: number;
  max?: number;
}

export const JDoubleSchema = joi.object({
  type: joi.string().valid("number", "double")
});

interface BaseField {
  optional?: boolean;
}

function toFieldSchema(schema: joi.ObjectSchema) {
  return schema.keys({
    optional: joi.bool()
  });
}

export type IField = Schema & BaseField;

export interface IObjectSchema {
  type: "object";
  fields: Record<string, IField>;
}

export const JObjectSchema = joi.object({
  type: joi.string().valid("object"),
  fields: joi.object().pattern(joi.string(), joi.link("JFieldSchema"))
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
  | IDateSchema
  | IDoubleSchema;

const schemasMap: Record<BsonType, joi.ObjectSchema> = {
  array: JArraySchema,
  bool: JBoolSchema,
  date: JDateSchema,
  double: JDoubleSchema,
  number: JDoubleSchema,
  objectid: JObjectIdSchema,
  string: JStringSchema,
  object: JObjectSchema
};

function makeSchemasUnion(
  extender?: (x: joi.ObjectSchema) => joi.ObjectSchema
): joi.Schema {
  let result = joi.object();

  for (let key of Object.keys(schemasMap)) {
    let schema = schemasMap[key];
    if (extender) schema = extender(schema);
    result.when("type", {
      is: key,
      then: schema
    });
  }
  return result;
}

export const JSchema = makeSchemasUnion().id("JSchema");
const JFieldSchema = makeSchemasUnion(toFieldSchema).id("JFieldSchema");
