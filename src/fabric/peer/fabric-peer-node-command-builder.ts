import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { mapParser } from "../../utils/parsers";
import { PeerCommands, PeerNodeCommands } from "../constants/fabric-peer";
import { runCommand } from "../../utils/child-process";

export class FabricPeerNodeCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.PEER;
  private baseCommand = PeerCommands.NODE;
  private command = PeerNodeCommands.START;

  private args: Map<string, string | boolean | number | string[]> = new Map();

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricPeerNodeCommandBuilder);
    else this.log = logger.for(FabricPeerNodeCommandBuilder.name);
  }

  setCommand(command?: PeerNodeCommands): this {
    if (command !== undefined) {
      this.log.debug(`Setting command to ${command}`);
      this.command = command;
    }
    return this;
  }

  setPeerDevelopmentMode(enable?: boolean): this {
    if (enable !== undefined) {
      this.log.debug(`Setting peer development mode to ${enable}`);
      this.args.set("--peer-chaincodedev", enable);
    }
    return this;
  }

  setBlockNumber(blockNumber?: number): this {
    if (blockNumber !== undefined) {
      this.log.debug(`Setting block number to ${blockNumber}`);
      this.args.set("--blockNumber", blockNumber.toString());
    }
    return this;
  }

  setChannelID(channelID?: string): this {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.set("--channelID", channelID);
    }
    return this;
  }

  setHelp(show?: boolean): this {
    if (show !== undefined) {
      this.log.debug(`Setting help flag: ${show}`);
      this.args.set("--help", show);
    }
    return this;
  }

  build(): string {
    const command: string = [
      this.getBinary(),
      this.getBaseCommand(),
      this.getCommand(),
      this.getCommand(),
      ...mapParser(this.args),
    ].join(" ");

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
    return mapParser(this.args);
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [this.getBaseCommand(), this.getCommand(), ...this.getArgs()];

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
