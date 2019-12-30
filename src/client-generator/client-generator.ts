import {
  IField,
  IObjectSchema,
  isObjectSchema,
  JModelCollection,
  JSchema,
  ModelCollection,
  Schema
} from "../model/modelCollection";
import { compile } from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { pascalCase } from "change-case";
import { assert, object, array, string } from "@hapi/joi";

type Schemas = Record<string, Schema>;

export function generateClient(opts: GenerateClientOptions) {
  validateGenerateOptions(opts);
  const { collections, schemas } = opts;
  return compile(
    fs.readFileSync("templates/client.ts.handlebars", {
      encoding: "utf-8"
    })
  )(makeTemplateContext(collections, schemas));
}

function makeTemplateContext(
  collections: ModelCollection[],
  schemas: Schemas
): TemplateContext {
  function createModelInterfaceName(name: string): string {
    return `I${pascalCase(name)}`;
  }

  return {
    collections: collections.map(model => {
      return {
        name: model.name,
        pascalName: pascalCase(model.schema),
        modelName: createModelInterfaceName(model.schema)
      };
    }),
    interfaces: Object.keys(schemas).map(schemaName => {
      let schema = schemas[schemaName] as IObjectSchema;
      if (!isObjectSchema(schema)) {
        throw Error("Collection can have only object schema");
      }
      return {
        name: createModelInterfaceName(schemaName),
        fields: Object.keys(schema.fields).map(fieldName => {
          let field = schema.fields[fieldName];
          return {
            name: fieldName,
            type: getTypescriptType(field),
            optional: field.optional
          };
        })
      };
    })
  };
}

export interface GenerateClientOptions {
  collections: ModelCollection[];
  schemas: Schemas
}

function validateGenerateOptions(opts: GenerateClientOptions) {
  assert(
    opts,
    object({
      collections: array().items(JModelCollection),
      schemas: object()
        .pattern(string(), JSchema)
        .required()
    })
  );
}

export function getTypescriptType(field: IField): string {
  let baseType: string;
  switch (field.type) {
    case "array":
      baseType = `${getTypescriptType(field.itemType)}[]`;
    case "bool":
      baseType = "boolean";
    case "double":
      baseType = "number";
    case "objectid":
      baseType = "ObjectId";
    case "string":
      baseType = "string";
  }
  return baseType;
}

interface TemplateContext {
  collections: {
    name: string;
    pascalName: string;
    modelName: string;
  }[];

  interfaces: {
    name: string;
    fields: {
      name: string;
      type: string;
      optional: boolean;
    }[];
  }[];
}
