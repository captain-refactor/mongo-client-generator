export interface Model {
  name: string;
  schema: Schema;
}

type Schema = IObjectSchema;

type BsonType =
  | "object"
  | "string"
  | "objectid"
  | "bool"
  | "double"
  | "array"
  | "binData"
  | "date"
  | "regex"
  | "dbPointer"
  | "javascript"
  | "javascriptWithScope"
  | "int"
  | "timestamp"
  | "decimal"
  | "minKey"
  | "maxKey"
  | "long";

export interface IStringSchema {
  type: "string";
  min?: number;
  max?: number;
  enum?: string[];
}

export interface IObjectIdSchema {
  type: "objectid";
}

export interface IBoolSchema {
  type: "bool";
}

export interface IDoubleSchema {
  type: "double";
  min?: number;
  max?: number;
}

export interface IObjectSchema {
  type: "object";
}
