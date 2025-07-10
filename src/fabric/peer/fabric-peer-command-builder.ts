import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { mapParser } from "../../utils/parsers";

export class FabricPeerCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.PEER;
  //   private command: OrdererCommand = OrdererCommand.START;

  private args: Map<string, string | boolean | number | string[]> = new Map();

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricPeerCommandBuilder);
    else this.log = logger.for(FabricPeerCommandBuilder.name);
  }

  build(): string {
    const command: string = [
      this.getBinary(),
      //   this.getCommand(),
      ...mapParser(this.args),
    ].join(" ");

    this.log.debug(`Built command: ${command}`);
    return command;
  }

  //   getCommand(): string {
  //     return this.command;
  //   }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    return mapParser(this.args);
  }

  //   async execute(): Promise<void> {
  //     const bin = this.getBinary();
  //     const argz = [this.getCommand(), ...this.getArgs()];

  //     try {
  //       // const regex = /\[\s*INFO\s*\] Listening on http/;
  //       // can be used as a promise but to lock the logs running as execsync
  //       await runCommand(bin, argz);
  //     } catch (error: unknown) {
  //       this.log.error(`Error: Failed to execute the command: ${error}`);
  //       process.exit(1);
  //     }
  //   }
}
