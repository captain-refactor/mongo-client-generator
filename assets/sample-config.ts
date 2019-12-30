import { GenerateClientOptions } from "../src";

const CONFIG: GenerateClientOptions = {
  collections: [
    {
      name: "users",
      schema: "User"
    }
  ],
  schemas: {
    User: {
      type: "object",
      fields: {
        name: {
          type: "string"
        },
        deleted: {
          type: "bool"
        }
      }
    }
  }
};
export default CONFIG;
