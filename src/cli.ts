import "ts-node/register";
import * as fs from "fs";
import { Command, flags } from "@oclif/command";
import * as path from "path";
import { generateClient } from "./client-generator/client-generator";

class GenerateClient extends Command {
  static flags = {
    version: flags.version(),
    help: flags.help(),
    config: flags.string({
      char: "c",
      default: "mongo-schema.ts"
    }),
    output: flags.string({
      char: "o",
      default: "src/generated/mongo-client.ts"
    })
  };

  async run() {
    const { flags } = this.parse(GenerateClient);
    let configPath = path.join(process.cwd(), flags.config);

    if(!fs.existsSync(configPath)){
      throw new Error("Config file doesn't exist");
    }

    let config = require(configPath);
    let clientCode = generateClient(config.default);
    fs.writeFileSync(path.join(process.cwd(), flags.output), clientCode, {
      encoding: "utf-8"
    });
  }
}

// @ts-ignore
GenerateClient.run().catch(require("@oclif/errors/handle"));
