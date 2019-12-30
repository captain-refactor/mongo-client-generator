import "reflect-metadata";
import { injector } from "../providers";
import { ClientGenerator } from "./client-generator";
import { expect } from "chai";

describe("client generator", function() {
  let generator = injector().get(ClientGenerator);
  it("should generate client", function() {
    let result = generator.generate({
      collections: [
        {
          name: "user",
          schema: "User"
        },
        {
          name: "product variant",
          schema: "ProductVariant"
        }
      ],
      schemas: {
        User: {
          type: "object",
          fields: {
            email: {
              type: "string"
            },
            name: {
              type: "string",
              optional: true
            }
          }
        },
        ProductVariant: {
          type: "object",
          fields: {
            sku: {
              type: "string"
            }
          }
        }
      }
    });
    console.log(result);
    expect(result).to.eq("");
  });
});
