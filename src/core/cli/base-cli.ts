import { Command } from "commander";
import { VERSION } from "../../index";
import { Logger, Logging } from "@decaf-ts/logging";
import { addFabricToPath } from "../../utils/path";
import { EnvVars } from "../constants/env-vars";
import { printBanner } from "../../utils/banner";
import { safeParseInt } from "../../utils/parsers";

/**
 * @class BaseCLI
 * @description Base class for creating command-line interfaces using Commander
 * @summary This class provides a foundation for building CLIs in the Fabric Weaver project.
 * It sets up a Commander program with basic configuration and logging.
 *
 * @example
 * class MyCLI extends BaseCLI {
 *   constructor() {
 *     super("my-cli", "My CLI description");
 *     this.setupCommands();
 *   }
 *
 *   private setupCommands() {
 *     this.program
 *       .command("hello")
 *       .description("Say hello")
 *       .action(() => console.log("Hello, world!"));
 *   }
 * }
 *
 * const cli = new MyCLI();
 * cli.run();
 */
export abstract class BaseCLI {
  protected program: Command;
  protected log: Logger;

  /**
   * @constructor
   * @param {string} name - The name of the CLI program
   * @param {string} description - A brief description of the CLI program
   */
  constructor(name: string, description: string) {
    this.program = new Command();
    this.log = Logging.for(this.constructor.name);

    this.program
      .name(name)
      .description(description)
      .version(VERSION)
      .hook("preAction", () => {
        printBanner();
        this.log.debug(`Starting ${this.program.name()} v${VERSION}`);
        addFabricToPath(process.env[EnvVars.FABRIC_BIN_FOLDER]);
      });

    this.sleep();
  }

  private sleep() {
    this.program
      .command("sleep")
      .option("--time <number>", "sleep time in seconds", safeParseInt)
      .action(async () => {
        const time = this.program.opts().time || 120;
        const ms = time * 1000;

        await new Promise((resolve) => setTimeout(resolve, ms));
      });
  }

  /**
   * @method run
   * @description Parses the command-line arguments and executes the appropriate command
   */
  public run(): void {
    this.program.parse(process.argv);
  }
}
