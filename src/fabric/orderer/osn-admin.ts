import { Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../general/constants";
import { OSN_ADMIN_SUBCOMMANDS, OSN_ADMIN_BASE_COMMAND } from "./constants";
import { runCommand } from "../../utils/child-process";

export class OSNAdminCommandBuilder {
  private log = Logging.for(OSNAdminCommandBuilder);
  private binName: FabricBinaries = FabricBinaries.OSNADMIN;
  private command: string = OSN_ADMIN_BASE_COMMAND;
  private subcommand: OSN_ADMIN_SUBCOMMANDS = OSN_ADMIN_SUBCOMMANDS.JOIN;
  private args: Map<string, string | boolean | number | string[]> = new Map();

  setSubCommand(subcommand?: OSN_ADMIN_SUBCOMMANDS): OSNAdminCommandBuilder {
    if (subcommand !== undefined) {
      this.log.debug(`Setting command to ${subcommand}`);
      this.subcommand = subcommand;
    }
    return this;
  }

  setOrdererAdminAddress(address?: string): OSNAdminCommandBuilder {
    if (address !== undefined) {
      this.log.debug(`Setting orderer address to ${address}`);
      this.args.set("orderer-address", address);
    }

    return this;
  }

  setCAFile(caFile?: string): OSNAdminCommandBuilder {
    if (caFile !== undefined) {
      this.log.debug(`Setting CA file to ${caFile}`);
      this.args.set("ca-file", caFile);
    }

    return this;
  }

  setClientCert(clientCert?: string): OSNAdminCommandBuilder {
    if (clientCert !== undefined) {
      this.log.debug(`Setting client cert to ${clientCert}`);
      this.args.set("client-cert", clientCert);
    }

    return this;
  }

  setClientKey(clientKey?: string): OSNAdminCommandBuilder {
    if (clientKey !== undefined) {
      this.log.debug(`Setting client key to ${clientKey}`);
      this.args.set("client-key", clientKey);
    }

    return this;
  }

  setNoStatus(noStatus?: boolean): OSNAdminCommandBuilder {
    if (noStatus !== undefined) {
      this.log.debug(`Setting no-status to ${noStatus}`);
      this.args.set("no-status", noStatus);
    }

    return this;
  }

  setChannelID(channelID?: string): OSNAdminCommandBuilder {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.set("channelID", channelID);
    }

    return this;
  }

  setConfigBlock(configBlock?: string): OSNAdminCommandBuilder {
    if (configBlock !== undefined) {
      this.log.debug(`Setting config block to ${configBlock}`);
      this.args.set("config-block", configBlock);
    }

    return this;
  }

  getCommand(): string {
    return this.command;
  }

  getSubCommand(): string {
    return this.subcommand;
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

  build(): string[] | Array<Array<string>> {
    const commandArray: string[] = [
      this.getBinary(),
      this.getCommand(),
      this.getSubCommand(),
    ];

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

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [this.getCommand(), this.getSubCommand(), ...this.getArgs()];

    await runCommand(bin, argz);
  }
}
