import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { OrdererCommand } from "../constants/fabric-orderer";
import { runCommand } from "../../utils/child-process";
import { mapParser } from "../../utils/parsers";

export class FabricCAServerCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.ORDERER;
  private command: OrdererCommand = OrdererCommand.START;

  private args: Map<string, string | boolean | number | string[]> = new Map();

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricCAServerCommandBuilder);
    else this.log = logger.for(FabricCAServerCommandBuilder.name);
  }

  /**
   * @description Sets the command for the Orderer.
   * @param {OrdererCommand} command - The command to set.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setCommand(command: OrdererCommand): FabricCAServerCommandBuilder {
    if (command === undefined)
      this.log.info(
        `Command not provided, defaulting to ${OrdererCommand.START}`
      );
    this.log.debug(`Setting command to ${command}`);
    this.command = command;
    return this;
  }

  build(): string {
    const command: string = [
      this.getBinary(),
      this.getCommand(),
      ...mapParser(this.args),
    ].join(" ");

    this.log.debug(`Built command: ${command}`);
    return command;
  }

  getCommand(): string {
    return this.command;
  }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    return mapParser(this.args);
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [this.getCommand(), ...this.getArgs()];

    try {
      // const regex = /\[\s*INFO\s*\] Listening on http/;
      // can be used as a promise but to lock the logs running as execsync
      await runCommand(bin, argz);
    } catch (error: unknown) {
      this.log.error(`Error: Failed to execute the command: ${error}`);
      process.exit(1);
    }
  }
}
