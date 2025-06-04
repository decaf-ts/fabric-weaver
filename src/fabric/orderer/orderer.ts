import { Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../general/constants";
import { OrdererCommand } from "./constants";
import { OrdererConfig } from "./orderer-config";
import path from "path";
import fs from "fs";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import { runCommand } from "../../utils/child-process";

export class OrdererCommandBuilder {
  private log = Logging.for(OrdererCommandBuilder);

  private binName: FabricBinaries = FabricBinaries.ORDERER;

  private args: Map<string, string | boolean | number | string[]> = new Map();
  private command: OrdererCommand = OrdererCommand.START;

  private config: OrdererConfig = readFileYaml(
    path.join(__dirname, "../../../config/orderer.yaml")
  ) as OrdererConfig;

  /**
   * @description Sets the command for the Orderer.
   * @param {OrdererCommand} command - The command to set.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setCommand(command: OrdererCommand): OrdererCommandBuilder {
    if (command === undefined)
      this.log.info(
        `Command not provided, defaulting to ${OrdererCommand.START}`
      );
    this.log.debug(`Setting command to ${command}`);
    this.command = command;
    return this;
  }

  /**
   * @description Sets the listen address for the Orderer.
   * @param {string} address - The address to listen on, in the format "host:port".
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setListenAddress(address?: string): OrdererCommandBuilder {
    if (address !== undefined) {
      this.log.debug(`Setting listen address to ${address}`);
      this.config.General!.ListenAddress = address;
    }
    return this;
  }

  /**
   * @description Sets the listen port for the Orderer.
   * @param {number} port - The port number to listen on.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setListenPort(port?: number): OrdererCommandBuilder {
    if (port !== undefined) {
      this.log.debug(`Setting listen port to ${port}`);
      this.config.General!.ListenPort = port;
    }
    return this;
  }

  /**
   * @description Sets the local MSP directory for the Orderer.
   * @param {string} dir - The path to the local MSP directory.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setLocalMSPDir(dir?: string): OrdererCommandBuilder {
    if (dir !== undefined) {
      this.log.debug(`Setting local MSP directory to ${dir}`);
      this.config.General!.LocalMSPDir = dir;
    }
    return this;
  }

  /**
   * @description Sets the local MSP ID for the Orderer.
   * @param {string} mspID - The MSP ID to set.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setLocalMSPID(mspID?: string): OrdererCommandBuilder {
    if (mspID !== undefined) {
      this.log.debug(`Setting local MSP ID to ${mspID}`);
      this.config.General!.LocalMSPID = mspID;
    }
    return this;
  }

  /**
   * @description Sets the admin listen address for the Orderer.
   * @param {string} address - The address for admin operations to listen on, in the format "host:port".
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setAdminListenAddress(address?: string): OrdererCommandBuilder {
    if (address !== undefined) {
      this.log.debug(`Setting admin listen address to ${address}`);
      this.config.Admin!.ListenAddress = address;
    }
    return this;
  }

  /**
   * @description Sets the operations listen address for the Orderer.
   * @param {string} address - The address for operations to listen on, in the format "host:port".
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setOperationsListenAddress(address?: string): OrdererCommandBuilder {
    if (address !== undefined) {
      this.log.debug(`Setting operations listen address to ${address}`);
      this.config.Operations!.ListenAddress = address;
    }
    return this;
  }

  /**
   * @description Sets the Consensus WAL (Write-Ahead Log) directory for the Orderer.
   * @param {string} dir - The path to the Consensus WAL directory.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setConsensusWALDir(dir?: string): OrdererCommandBuilder {
    if (dir !== undefined) {
      this.log.debug(`Setting Consensus WAL directory to ${dir}`);
      this.config.Consensus!.WALDir = dir;
    }
    return this;
  }

  /**
   * @description Sets the Consensus Snapshot directory for the Orderer.
   * @param {string} dir - The path to the Consensus Snapshot directory.
   * @returns {OrdererCommandBuilder} The current instance for method chaining.
   */
  setConsensusSnapDir(dir?: string): OrdererCommandBuilder {
    if (dir !== undefined) {
      this.log.debug(`Setting Consensus Snapshot directory to ${dir}`);
      this.config.Consensus!.SnapDir = dir;
    }
    return this;
  }

  build(): string[] | Array<Array<string>> {
    const commandArray: string[] = [this.getBinary(), this.command];

    this.args.forEach((value, key) => {
      if (typeof value === "boolean") {
        if (value) commandArray.push(`--${key}`);
      } else if (Array.isArray(value)) {
        commandArray.push(`--${key}`, value.join(","));
      } else {
        commandArray.push(`--${key}`, value.toString());
      }
    });

    const commandStr = commandArray.join(" ");

    this.log.debug(`Built command: ${commandStr}`);
    return [commandStr];
  }

  saveConfig(cpath: string): this {
    if (cpath === undefined) return this;

    if (!fs.existsSync(path.join(cpath)))
      fs.mkdirSync(path.join(cpath), { recursive: true });

    if (!cpath.endsWith(".yaml")) cpath = path.join(cpath, "orderer.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.verbose(`Config file: ${JSON.stringify(this.config)}`, 3);
    writeFileYaml(cpath, this.config);

    return this;
  }

  getCommand(): string {
    return this.command;
  }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    const argsArray: string[] = [];

    this.args.forEach((value, key) => {
      if (typeof value === "boolean") {
        if (value) argsArray.push(`--${key}`);
      } else if (Array.isArray(value)) {
        argsArray.push(`--${key}`, value.join(","));
      } else {
        argsArray.push(`--${key}`, value.toString());
      }
    });

    return argsArray;
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [this.getCommand(), ...this.getArgs()];

    const regex = /\[\s*INFO\s*\] Listening on http/;

    await runCommand(bin, argz, {}, regex);
  }
}
