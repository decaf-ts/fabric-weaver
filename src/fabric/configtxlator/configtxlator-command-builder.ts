import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { mapParser } from "../../utils/parsers";
import { runCommand } from "../../utils/child-process";

export enum ConfigtxlatorCommand {
  START = "start",
  PROTO_ENCODE = "proto_encode",
  PROTO_DECODE = "proto_decode",
  PROTO_COMPARE = "proto_compare",
  COMPUTE_UPDATE = "compute_update",
  VERSION = "version",
  HELP = "help",
}

export enum ConfigtxlatorProtoMessage {
  BLOCK = "common.Block",
  BLOCK_DATA = "common.BlockData",
  BLOCK_METADATA = "common.BlockMetadata",
  CONFIG = "common.Config",
  CONFIG_ENVELOPE = "common.ConfigEnvelope",
  CONFIG_UPDATE = "common.ConfigUpdate",
  CONFIG_UPDATE_ENVELOPE = "common.ConfigUpdateEnvelope",
  ENVELOPE = "common.Envelope",
  SIGNED_ENVELOPE = "common.SignedEnvelope",
  CHAINCODE_DEFINITION = "peer.ChaincodeDefinition",
}

export interface ConfigtxlatorStartOptions {
  address?: string;
  port?: number;
  tls?: boolean;
  cafile?: string;
  certfile?: string;
  keyfile?: string;
}

export interface ConfigtxlatorProtoOptions {
  input?: string;
  output?: string;
  type?: ConfigtxlatorProtoMessage | string;
}

export interface ConfigtxlatorProtoCompareOptions {
  original?: string;
  updated?: string;
  output?: string;
}

export interface ConfigtxlatorComputeUpdateOptions {
  channelId?: string;
  original?: string;
  updated?: string;
  output?: string;
}

type ConfigtxlatorArgValue = string | number | boolean | string[];

export class ConfigtxlatorCommandBuilder {
  private readonly log: Logger;
  private readonly binName: FabricBinaries = FabricBinaries.CONFIGTXLATOR;
  private command: ConfigtxlatorCommand = ConfigtxlatorCommand.HELP;
  private readonly args: Map<
    ConfigtxlatorCommand,
    Map<string, ConfigtxlatorArgValue>
  > = new Map();

  constructor(logger?: Logger) {
    this.log = logger
      ? logger.for(ConfigtxlatorCommandBuilder.name)
      : Logging.for(ConfigtxlatorCommandBuilder);
  }

  setCommand(command: ConfigtxlatorCommand): this {
    this.log.debug(`Setting command: ${command}`);
    this.command = command;
    return this;
  }

  setStartOptions(options?: ConfigtxlatorStartOptions): this {
    if (!options) return this;
    this.assertCommand(ConfigtxlatorCommand.START);

    const { address, port, tls, cafile, certfile, keyfile } = options;
    this.setCommandArg(ConfigtxlatorCommand.START, "address", address);
    this.setCommandArg(ConfigtxlatorCommand.START, "port", port);
    this.setCommandArg(ConfigtxlatorCommand.START, "tls", tls);
    this.setCommandArg(ConfigtxlatorCommand.START, "cafile", cafile);
    this.setCommandArg(ConfigtxlatorCommand.START, "certfile", certfile);
    this.setCommandArg(ConfigtxlatorCommand.START, "keyfile", keyfile);

    return this;
  }

  setProtoOptions(options?: ConfigtxlatorProtoOptions): this {
    if (!options) return this;
    this.assertCommand(
      ConfigtxlatorCommand.PROTO_ENCODE,
      ConfigtxlatorCommand.PROTO_DECODE
    );

    const targetCommand = this.command;
    const { input, output, type } = options;

    this.setCommandArg(targetCommand, "input", input);
    this.setCommandArg(targetCommand, "output", output);
    if (type !== undefined) {
      this.setCommandArg(targetCommand, "type", String(type));
    }

    return this;
  }

  setProtoCompareOptions(options?: ConfigtxlatorProtoCompareOptions): this {
    if (!options) return this;
    this.assertCommand(ConfigtxlatorCommand.PROTO_COMPARE);

    const { original, updated, output } = options;
    this.setCommandArg(ConfigtxlatorCommand.PROTO_COMPARE, "original", original);
    this.setCommandArg(ConfigtxlatorCommand.PROTO_COMPARE, "updated", updated);
    this.setCommandArg(ConfigtxlatorCommand.PROTO_COMPARE, "output", output);

    return this;
  }

  setComputeUpdateOptions(options?: ConfigtxlatorComputeUpdateOptions): this {
    if (!options) return this;
    this.assertCommand(ConfigtxlatorCommand.COMPUTE_UPDATE);

    const { channelId, original, updated, output } = options;
    this.setCommandArg(
      ConfigtxlatorCommand.COMPUTE_UPDATE,
      "channel_id",
      channelId
    );
    this.setCommandArg(ConfigtxlatorCommand.COMPUTE_UPDATE, "original", original);
    this.setCommandArg(ConfigtxlatorCommand.COMPUTE_UPDATE, "updated", updated);
    this.setCommandArg(ConfigtxlatorCommand.COMPUTE_UPDATE, "output", output);

    return this;
  }

  build(): string {
    const commandLine = [this.getBinary(), ...this.getArgs()].join(" ");
    this.log.debug(`Built command: ${commandLine}`);
    return commandLine;
  }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    const argsMap =
      this.args.get(this.command) ??
      new Map<string, ConfigtxlatorArgValue>();
    return [this.command, ...mapParser(argsMap)];
  }

  async execute(): Promise<void> {
    try {
      await runCommand(this.getBinary(), this.getArgs());
    } catch (error: unknown) {
      this.log.error(`Error: Failed to execute the command: ${error}`);
      process.exit(1);
    }
  }

  private setCommandArg(
    command: ConfigtxlatorCommand,
    key: string,
    value?: ConfigtxlatorArgValue
  ): void {
    if (value === undefined) return;
    const argsMap = this.args.get(command) ?? new Map<string, ConfigtxlatorArgValue>();
    argsMap.set(key, value);
    this.args.set(command, argsMap);
  }

  private assertCommand(
    ...allowed: ConfigtxlatorCommand[]
  ): asserts this is this {
    if (!allowed.includes(this.command)) {
      throw new Error(
        `Invalid command "${this.command}" for the requested operation. Allowed: ${allowed.join(
          ", "
        )}`
      );
    }
  }
}
