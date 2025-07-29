import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { PeerChaincodeCommands, PeerCommands } from "../constants/fabric-peer";
import { runCommand } from "../../utils/child-process";

export class FabricPeerChaincodeCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.PEER;
  private baseCommand = PeerCommands.CHAINCODE;

  private command = PeerChaincodeCommands.PACKAGE;

  private location?: string;

  private args: string[] = [];

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricPeerChaincodeCommandBuilder);
    else this.log = logger.for(FabricPeerChaincodeCommandBuilder.name);
  }

  setCommand(command?: PeerChaincodeCommands): this {
    if (command !== undefined) {
      this.log.debug(`Setting command to ${command}`);
      this.command = command;
    }
    return this;
  }

  //   setBlockPath(blockPath?: string): this {
  //     if (blockPath !== undefined) {
  //       this.log.debug(`Setting blockpath to ${blockPath}`);
  //       this.args.push(`--blockpath ${blockPath}`);
  //     }
  //     return this;
  //   }

  //   setBlockReference(blockRef?: string): this {
  //     if (blockRef !== undefined) {
  //       this.log.debug(`Setting block reference to ${blockRef}`);
  //       this.blockReference = blockRef;
  //     }
  //     return this;
  //   }

  setlocation(location?: string): this {
    if (location !== undefined) {
      this.log.debug(`Setting contract location to ${location}`);
      this.location = location;
    }
    return this;
  }

  //   setChannelID(channelID?: string): this {
  //     if (channelID !== undefined) {
  //       this.log.debug(`Setting channel ID to ${channelID}`);
  //       this.args.push(`--channelID ${channelID}`);
  //     }
  //     return this;
  //   }

  //   setOrderer(orderer?: string): this {
  //     if (orderer !== undefined) {
  //       this.log.debug(`Setting orderer to ${orderer}`);
  //       this.args.push(`--orderer ${orderer}`);
  //     }
  //     return this;
  //   }

  //   enableTLS(enable?: boolean): this {
  //     if (enable !== undefined && enable === true) {
  //       this.log.debug(`Setting TLS enabled: ${enable}`);
  //       this.args.push(`--tls`);
  //     }
  //     return this;
  //   }

  //   setTLSCAFile(caFile?: string): this {
  //     if (caFile !== undefined) {
  //       this.log.debug(`Setting TLS CA file: ${caFile}`);
  //       this.args.push(`--cafile ${caFile}`);
  //     }

  //     return this;
  //   }

  build(): string {
    const command: string = [
      this.getBinary(),
      this.getBaseCommand(),
      this.getCommand(),
      this.location,
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
      this.location,
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
