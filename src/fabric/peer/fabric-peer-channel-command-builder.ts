import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { PeerChannelCommands, PeerCommands } from "../constants/fabric-peer";
import { runCommand } from "../../utils/child-process";
import { mapParser } from "../../utils/parsers";

export class FabricPeerChannelCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.PEER;
  private baseCommand = PeerCommands.CHANNEL;

  private command = PeerChannelCommands.JOIN;

  private blockReference?: string;
  private destination?: string;

  private args: Map<string, string | boolean | number | string[]> = new Map();

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricPeerChannelCommandBuilder);
    else this.log = logger.for(FabricPeerChannelCommandBuilder.name);
  }

  setCommand(command?: PeerChannelCommands): this {
    if (command !== undefined) {
      this.log.debug(`Setting command to ${command}`);
      this.command = command;
    }
    return this;
  }

  setBlockPath(blockPath?: string): this {
    if (blockPath !== undefined) {
      this.log.debug(`Setting blockpath to ${blockPath}`);
      this.args.set("blockpath", blockPath);
    }
    return this;
  }

  setBlockReference(blockRef?: string): this {
    if (blockRef !== undefined) {
      this.log.debug(`Setting block reference to ${blockRef}`);
      this.blockReference = blockRef;
    }
    return this;
  }

  setDestination(destination?: string): this {
    if (destination !== undefined) {
      this.log.debug(`Setting destination to ${destination}`);
      this.destination = destination;
    }
    return this;
  }

  setChannelID(channelID?: string): this {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.set("channelID", channelID);
    }
    return this;
  }

  setOrderer(orderer?: string): this {
    if (orderer !== undefined) {
      this.log.debug(`Setting orderer to ${orderer}`);
      this.args.set("orderer", orderer);
    }
    return this;
  }

  enableTLS(enable?: boolean): this {
    if (enable !== undefined && enable === true) {
      this.log.debug(`Setting TLS enabled: ${enable}`);
      this.args.set(`tls`, enable);
    }
    return this;
  }

  setTLSCAFile(caFile?: string): this {
    if (caFile !== undefined) {
      this.log.debug(`Setting TLS CA file: ${caFile}`);
      this.args.set("cafile", caFile);
    }

    return this;
  }

  setFile(file?: string): this {
    if (file !== undefined) {
      this.log.debug(`Setting file: ${file}`);
      this.args.set("file", file);
    }

    return this;
  }

  build(): string {
    const command: string = [
      this.getBinary(),
      this.getBaseCommand(),
      this.getCommand(),
      this.blockReference,
      this.destination,
      ...mapParser(this.args),
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
    return mapParser(this.args);
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [
      this.getBaseCommand(),
      this.getCommand(),
      this.blockReference,
      this.destination,
      ...mapParser(this.args),
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

// Flags:
//       --cafile string                       Path to file containing PEM-encoded trusted certificate(s) for the ordering endpoint
//       --certfile string                     Path to file containing PEM-encoded X509 public key to use for mutual TLS communication with the orderer endpoint
//       --clientauth                          Use mutual TLS when communicating with the orderer endpoint
//       --connTimeout duration                Timeout for client to connect (default 3s)
//   -h, --help                                help for channel
//       --keyfile string                      Path to file containing PEM-encoded private key to use for mutual TLS communication with the orderer endpoint
//   -o, --orderer string                      Ordering service endpoint
//       --ordererTLSHostnameOverride string   The hostname override to use when validating the TLS connection to the orderer
//       --tls                                 Use TLS when communicating with the orderer endpoint
//       --tlsHandshakeTimeShift duration      The amount of time to shift backwards for certificate expiration checks during TLS handshakes with the orderer endpoint
//   -f, --file string          Configuration transaction file generated by a tool such as configtxgen for submitting to orderer
//   -h, --help                 help for create
//       --outputBlock string   The path to write the genesis block for the channel. (default ./<channelID>.block)
//   -t, --timeout duration     Channel creation timeout (default 10s)
//       --bestEffort         Whether fetch requests should ignore errors and return blocks on a best effort basis
//       --snapshotpath string   Path to the snapshot directory
//   -f, --file string   Configuration transaction file generated by a tool such as configtxgen for submitting to orderer
