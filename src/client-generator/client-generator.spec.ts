import { expect } from "chai";
import { generateClient } from "./client-generator";

describe("client generator", function() {
  it("should generate client", function() {
    let result = generateClient({
      collections: [
        {
          name: "user",
          schema: "User"
        },
        {
          name: "productvariant",
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
            },
            deleted: {
              type: 'bool',
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
    expect(result).eq(`import {Db, Collection} from 'mongodb';

export interface IUser {
    email: string;
    name?: string;
    deleted?: boolean;
}
export interface IProductVariant {
    sku: string;
}

export type CollectionName = | 'user'
| 'productvariant';


export class UserCollection {
    get name(): CollectionName {
        return 'user';
    }

    get collection(): Collection<IUser> {
        return this.db.collection(this.name);
    }

    constructor(public db: Db) {
    }

}

export class ProductVariantCollection {
    get name(): CollectionName {
        return 'productvariant';
    }

    get collection(): Collection<IProductVariant> {
        return this.db.collection(this.name);
    }

    constructor(public db: Db) {
    }

}


export class MongoClient {

}
`);
  });
});
