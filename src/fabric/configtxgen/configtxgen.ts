import { Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../general-utils/constants";
import { runCommand } from "../../utils/child-process";

export class ConfigtxgenCommandBuilder {
  private log = Logging.for(ConfigtxgenCommandBuilder);

  private binName: FabricBinaries = FabricBinaries.CONFIGTXGEN;

  private args: Map<string, string | boolean | number | string[]> = new Map();

  /**
   * @description Sets the organization for config generation.
   * @param {string} org - The organization name.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setAsOrg(org?: string): ConfigtxgenCommandBuilder {
    if (org !== undefined) {
      this.log.debug(`Setting organization to ${org}`);
      this.args.set("asOrg", org);
    }
    return this;
  }

  /**
   * @description Sets the base profile for channel creation tx generation.
   * @param {string} profile - The profile name.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setChannelCreateTxBaseProfile(profile?: string): ConfigtxgenCommandBuilder {
    if (profile !== undefined) {
      this.log.debug(`Setting channel create tx base profile to ${profile}`);
      this.args.set("channelCreateTxBaseProfile", profile);
    }
    return this;
  }

  /**
   * @description Sets the channel ID for the configtx.
   * @param {string} channelID - The channel ID.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setChannelID(channelID?: string): ConfigtxgenCommandBuilder {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.set("channelID", channelID);
    }
    return this;
  }

  /**
   * @description Sets the configuration path.
   * @param {string} path - The configuration path.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setConfigPath(path?: string): ConfigtxgenCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting config path to ${path}`);
      this.args.set("configPath", path);
    }
    return this;
  }

  /**
   * @description Sets the path for block inspection.
   * @param {string} path - The path to the block.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setInspectBlock(path?: string): ConfigtxgenCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting inspect block path to ${path}`);
      this.args.set("inspectBlock", path);
    }
    return this;
  }

  /**
   * @description Sets the path for channel create tx inspection.
   * @param {string} path - The path to the channel create tx.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setInspectChannelCreateTx(path?: string): ConfigtxgenCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting inspect channel create tx path to ${path}`);
      this.args.set("inspectChannelCreateTx", path);
    }
    return this;
  }

  /**
   * @description Sets the output path for anchor peers update.
   * @param {string} path - The output path.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setOutputAnchorPeersUpdate(path?: string): ConfigtxgenCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting output anchor peers update path to ${path}`);
      this.args.set("outputAnchorPeersUpdate", path);
    }
    return this;
  }

  /**
   * @description Sets the output path for the genesis block.
   * @param {string} path - The output path.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setOutputBlock(path?: string): ConfigtxgenCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting output block path to ${path}`);
      this.args.set("outputBlock", path);
    }
    return this;
  }

  /**
   * @description Sets the output path for channel creation configtx.
   * @param {string} path - The output path.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setOutputCreateChannelTx(path?: string): ConfigtxgenCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting output create channel tx path to ${path}`);
      this.args.set("outputCreateChannelTx", path);
    }
    return this;
  }

  /**
   * @description Sets the organization to print.
   * @param {string} org - The organization name.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setPrintOrg(org?: string): ConfigtxgenCommandBuilder {
    if (org !== undefined) {
      this.log.debug(`Setting print org to ${org}`);
      this.args.set("printOrg", org);
    }
    return this;
  }

  /**
   * @description Sets the profile to use for generation.
   * @param {string} profile - The profile name.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setProfile(profile?: string): ConfigtxgenCommandBuilder {
    if (profile !== undefined) {
      this.log.debug(`Setting profile to ${profile}`);
      this.args.set("profile", profile);
    }
    return this;
  }

  /**
   * @description Sets whether to show version information.
   * @param {boolean} show - Whether to show version information.
   * @returns {ConfigtxgenCommandBuilder} The current instance for method chaining.
   */
  setVersion(show: boolean = false): ConfigtxgenCommandBuilder {
    this.log.debug(`Setting version flag to ${show}`);
    this.args.set("version", show);
    return this;
  }

  build(): string[] {
    const commandArray: string[] = [this.getBinary()];

    this.args.forEach((value, key) => {
      if (typeof value === "boolean") {
        if (value) commandArray.push(`--${key}`);
      } else if (Array.isArray(value)) {
        commandArray.push(`-${key}`, value.join(","));
      } else {
        commandArray.push(`-${key}`, value.toString());
      }
    });

    const commandStr = commandArray.join(" ");

    this.log.debug(`Built command: ${commandStr}`);
    return commandArray;
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
    const argz = this.getArgs();

    await runCommand(bin, argz);
  }
}
