import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import {
  PeerCommands,
  PeerLifecycleChaincodeCommands,
} from "../constants/fabric-peer";
import { runCommand } from "../../utils/child-process";

export class FabricPeerLifecycleChaincodeCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.PEER;
  private baseCommand = PeerCommands.LIFECYCLE_CHAINCODE;

  private command = PeerLifecycleChaincodeCommands.PACKAGE;

  private destination?: string;

  private args: string[] = [];

  constructor(logger?: Logger) {
    if (!logger)
      this.log = Logging.for(FabricPeerLifecycleChaincodeCommandBuilder);
    else this.log = logger.for(FabricPeerLifecycleChaincodeCommandBuilder.name);
  }

  setCommand(command?: PeerLifecycleChaincodeCommands): this {
    if (command !== undefined) {
      this.log.debug(`Setting command to ${command}`);
      this.command = command;
    }
    return this;
  }

  setDestination(destination?: string): this {
    if (destination !== undefined) {
      this.log.debug(`Setting contract destination to ${destination}`);
      this.destination = destination;
    }
    return this;
  }

  setContractPath(contractPath?: string): this {
    if (contractPath !== undefined) {
      this.log.debug(`Setting contract path to ${contractPath}`);
      this.args.push(`--path ${contractPath}`);
    }
    return this;
  }

  setLang(lang?: string): this {
    if (lang !== undefined) {
      this.log.debug(`Setting contract language to ${lang}`);
      this.args.push(`--lang ${lang}`);
    }
    return this;
  }

  setLabel(label?: string): this {
    if (label !== undefined) {
      this.log.debug(`Setting contract label to ${label}`);
      this.args.push(`--label ${label}`);
    }
    return this;
  }
  build(): string {
    const command: string = [
      this.getBinary(),
      this.getBaseCommand(),
      this.getCommand(),
      this.destination,
      ...[...new Set(this.args)],
    ]
      .filter((item) => item !== undefined && item !== null && item !== "")
      .join(" ");

    this.log.debug(`Built command: ${command}`);
    return command;
  }

  getBaseCommand(): string {
    return this.baseCommand;
  }

  getCommand(): string {
    return this.command;
  }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    return [...new Set(this.args)];
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [
      this.getBaseCommand(),
      this.getCommand(),
      this.destination,
      ...this.getArgs(),
    ].filter(
      (item) => item !== undefined && item !== null && item !== ""
    ) as string[];

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
