import { Command } from "commander";
import { VERSION } from "../../index";
import { Logger, Logging } from "@decaf-ts/logging";
import { addFabricToPath } from "../../utils-old/path";
import { EnvVars } from "../constants/env-vars";
import { printBanner, printBorder } from "../../utils-old/banner";
import { safeParseInt } from "../../utils-old/parsers";
import fs from "fs";
import path from "path";

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
      .option("-s, --skip-banner", "Suppress the Fabric Weaver banner")
      .option("-l, --limiter", "Supress the line after the command output")
      .hook("preAction", (cmd) => {
        const skipBanner = cmd.opts().skipBanner === true;
        printBanner(skipBanner);
        this.log.debug(`Skip banner: ${skipBanner}`);
        this.log.debug(`Starting ${this.program.name()} v${VERSION}`);
        addFabricToPath(process.env[EnvVars.FABRIC_BIN_FOLDER]);
      })
      .hook("postAction", (cmd) => {
        const skipLimiter = cmd.opts().limiter === true;
        printBorder(skipLimiter);
        this.log.debug(`Skip Limiter: ${skipLimiter}`);
      });

    this.sleep();
    this.copy();
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

  private copy() {
    this.program
      .command("copy")
      .description("Copy a file from origin to destination")
      .requiredOption("--origin <string>", "Origin file path")
      .requiredOption("--dest <string>", "Destination file path")
      .action(async (options) => {
        try {
          const { origin, dest } = options;

          // Check if the origin file exists
          if (!fs.existsSync(origin)) {
            this.log.error(`Origin file does not exist: ${origin}`);
            return;
          }

          // Ensure the destination directory exists
          const destDir = path.dirname(dest);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          // Copy the file
          fs.copyFileSync(origin, dest);

          this.log.info(`File copied successfully from ${origin} to ${dest}`);
        } catch (error: unknown) {
          this.log.error(`Error copying file: ${(error as Error).message}`);
        }
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
