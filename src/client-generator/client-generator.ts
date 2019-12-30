import { Injectable } from "injection-js";
import {
  BsonType,
  IField,
  IObjectSchema,
  isObjectSchema, JSchema,
  ModelCollection,
  Schema
} from "../model/modelCollection";
import { compile } from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { pascalCase } from "change-case";
import { assert, object, array, string } from "@hapi/joi";

type Schemas = Record<string, Schema>;

@Injectable()
export class ClientGenerator {
  generate(opts: GenerateOptions) {
    validateGenerateOptions(opts);
    const { collections, schemas } = opts;
    return compile(
      fs.readFileSync(path.join(__dirname, "client.ts.handlebars"), {
        encoding: "utf-8"
      })
    )(this.makeTemplateContext(collections, schemas));
  }

  private makeTemplateContext(
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
          pascalName: pascalCase(model.name),
          modelName: createModelInterfaceName(model.name)
        };
      }),
      interfaces: collections.map(model => {
        let schema = schemas[model.schema] as IObjectSchema;
        if (!isObjectSchema(schema)) {
          throw Error("Collection can have only object schema");
        }
        return {
          name: createModelInterfaceName(model.name),
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
}

type GenerateOptions = { collections: ModelCollection[]; schemas: Schemas };

function validateGenerateOptions(opts: GenerateOptions) {
  assert(
    opts,
    object({
      collections: array().items(
        object({
          name: string().required(),
          schema: string().required()
        })
      ),
      schemas: object().pattern(string(),JSchema).required()
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
