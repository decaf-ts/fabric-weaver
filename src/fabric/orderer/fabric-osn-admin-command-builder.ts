import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import {
  OSN_ADMIN_BASE_COMMAND,
  OSN_ADMIN_SUBCOMMANDS,
} from "../constants/fabric-orderer";
import { runCommand } from "../../utils/child-process";

export class FabricOSNAdminCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.OSNADMIN;
  private baseCommand = OSN_ADMIN_BASE_COMMAND;
  private command: OSN_ADMIN_SUBCOMMANDS = OSN_ADMIN_SUBCOMMANDS.JOIN;

  private args: string[] = [];

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricOSNAdminCommandBuilder);
    else this.log = logger.for(FabricOSNAdminCommandBuilder.name);
  }

  setCommand(command?: OSN_ADMIN_SUBCOMMANDS): this {
    if (command !== undefined) {
      this.log.debug(`Setting command to ${command}`);
      this.command = command;
    }

    return this;
  }

  setHelp(show?: boolean): this {
    if (show !== undefined && show === true) {
      this.log.debug(`Setting help flag: ${show}`);
      this.args.push("--help");
    }
    return this;
  }

  setOrdererAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting orderer address: ${address}`);
      this.args.push(`--orderer-address=${address}`);
    }
    return this;
  }

  setCAFile(caFile?: string): this {
    if (caFile !== undefined) {
      this.log.debug(`Setting CA file: ${caFile}`);
      this.args.push(`--ca-file=${caFile}`);
    }
    return this;
  }

  setClientCert(clientCert?: string): this {
    if (clientCert !== undefined) {
      this.log.debug(`Setting client cert: ${clientCert}`);
      this.args.push(`--client-cert=${clientCert}`);
    }
    return this;
  }

  setClientKey(clientKey?: string): this {
    if (clientKey !== undefined) {
      this.log.debug(`Setting client key: ${clientKey}`);
      this.args.push(`--client-key=${clientKey}`);
    }
    return this;
  }

  setNoStatus(noStatus?: boolean): this {
    if (noStatus !== undefined && noStatus === true) {
      this.log.debug(`Setting no-status to ${noStatus}`);
      this.args.push("--no-status");
    }
    return this;
  }

  setChannelID(channelID?: string): this {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.push(`--channelID=${channelID}`);
    }
    return this;
  }

  setConfigBlock(configBlock?: string): this {
    if (configBlock !== undefined) {
      this.log.debug(`Setting config block to ${configBlock}`);
      this.args.push(`--config-block=${configBlock}`);
    }
    return this;
  }

  build(): string {
    const command: string = [
      this.getBinary(),
      this.getBaseCommand(),
      this.getCommand(),
      ...[...new Set(this.args)],
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
    return [...new Set(this.args)];
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
