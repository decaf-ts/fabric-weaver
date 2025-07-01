import { LogLevel } from "@decaf-ts/logging";
import { BaseCLI } from "./base-cli";
import { issueCAServerConfig } from "../scripts/ca-server";
import { safeParseInt } from "../../utils/parsers";

export class FabricCAServerCLI extends BaseCLI {
  constructor() {
    super("weaver-fabric-ca-server", "CLI for Fabric CA Server functionality");

    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    ).filter(
      (name) =>
        name !== "constructor" &&
        typeof this[name as keyof FabricCAServerCLI] === "function"
    );

    for (const methodName of methodNames) {
      try {
        this[methodName as keyof FabricCAServerCLI]();
      } catch (error) {
        console.error(`Error calling method ${methodName}:`, error);
      }
    }
  }

  private issueFabricCAServerCommand() {
    this.program
      .command("issue-ca")
      .description("Generates a Fabric CA Server config file")
      .option("-d, --debug", "Enables debug mode")
      .option("--config-version <string>", "Fabric CA Server Config version")
      .option(
        "--port <number>",
        "Port number for the Fabric CA Server",
        safeParseInt
      )
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Issuing Fabric CA Server config...");
        this.log.debug(`Options: ${options}`);

        try {
          issueCAServerConfig(this.log, options.configVersion, options.port);
        } catch (error) {
          this.log.error(`"Error issuing Fabric CA Server config: ${error}"`);
          return;
        }

        this.log.info("Fabric CA Server config issued successfully!");
      });
  }
}
