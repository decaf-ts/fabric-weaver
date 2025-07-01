import { Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../general/constants";
import { runCommand } from "../../utils/child-process";
import { PeerCommands, PeerSubcommands } from "./constants";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import path from "path";
import { PeerConfig } from "./peer-config";
import fs from "fs";
export class PeerCommandBuilder {
  private log = Logging.for(PeerCommandBuilder);
  private binName: FabricBinaries = FabricBinaries.PEER;
  private command: PeerCommands = PeerCommands.VERSION;
  private subcommand: PeerSubcommands | string = undefined;
  private args: Map<string, string | boolean | number | string[]> = new Map();
  private config: PeerConfig = readFileYaml(
    path.join(__dirname, "../../../config/core.yaml")
  ) as PeerConfig;

  setBasicConfig(): PeerCommandBuilder {
    if (this.config.chaincode) delete this.config.chaincode;

    this.config.chaincode = {};
    this.config.chaincode = {
      externalBuilders: [],
      mode: "net",
      keepalive: 0,
    };
    return this;
  }

  setCommand(command?: PeerCommands): PeerCommandBuilder {
    if (command !== undefined) {
      this.command = command;
      this.log.debug(`Setting command to ${command}`);
    }
    return this;
  }

  setSubCommand(subcommand?: PeerSubcommands | string): PeerCommandBuilder {
    if (subcommand !== undefined) {
      this.subcommand = subcommand;
      this.log.debug(`Setting subcommand to ${subcommand}`);
    }
    return this;
  }

  getCommand(): string {
    return this.command;
  }

  getSubCommand(): string | undefined {
    return this.subcommand;
  }

  setHelp(help?: boolean): PeerCommandBuilder {
    if (help !== undefined) {
      this.log.debug(`Setting help flag to ${help}`);
      this.args.set("help", true);
    }

    return this;
  }

  setConnectionProfile(profilePath?: string): PeerCommandBuilder {
    if (profilePath !== undefined) {
      this.log.debug(`Setting connection profile to ${profilePath}`);
      this.args.set("connectionProfile", profilePath);
    }
    return this;
  }

  setCtor(ctor?: string): PeerCommandBuilder {
    if (ctor !== undefined) {
      this.log.debug(`Setting constructor string to ${ctor}`);
      this.args.set("ctor", ctor);
    }
    return this;
  }
  setLang(lang?: string): PeerCommandBuilder {
    if (lang !== undefined) {
      this.log.debug(`Setting language to ${lang}`);
      this.args.set("lang", lang);
    }
    return this;
  }

  setChaincodeName(name?: string): PeerCommandBuilder {
    if (name !== undefined) {
      this.log.debug(`Setting name to ${name}`);
      this.args.set("name", name);
    }
    return this;
  }

  setPath(path?: string): PeerCommandBuilder {
    if (path !== undefined) {
      this.log.debug(`Setting path to ${path}`);
      this.args.set("path", path);
    }
    return this;
  }

  setBlockPath(blockPath?: string): PeerCommandBuilder {
    if (blockPath !== undefined) {
      this.log.debug(`Setting block path to ${blockPath}`);
      this.args.set("blockpath", blockPath);
    }
    return this;
  }

  setPackageID(packageID?: string): PeerCommandBuilder {
    if (packageID !== undefined) {
      this.log.debug(`Setting package ID to ${packageID}`);
      this.args.set("package-id", packageID);
    }
    return this;
  }

  setLabel(label?: string): PeerCommandBuilder {
    if (label !== undefined) {
      this.log.debug(`Setting label to ${label}`);
      this.args.set("label", label);
    }
    return this;
  }

  setPeerAddresses(addresses?: string[]): PeerCommandBuilder {
    if (addresses !== undefined && addresses.length > 0) {
      this.log.debug(`Setting peer addresses to ${addresses.join(", ")}`);
      this.args.set("peerAddresses", addresses);
    }
    return this;
  }

  setTLSRootCertFiles(certFiles?: string[]): PeerCommandBuilder {
    if (certFiles !== undefined && certFiles.length > 0) {
      this.log.debug(`Setting TLS root cert files to ${certFiles.join(", ")}`);
      this.args.set("tlsRootCertFiles", certFiles);
    }
    return this;
  }

  setVersion(show?: boolean): PeerCommandBuilder {
    if (show !== undefined) {
      this.log.debug(`Setting version flag to ${show}`);
      this.args.set("version", show);
    }
    return this;
  }

  setCustom(key?: string, value?: string): PeerCommandBuilder {
    if (key !== undefined && value !== undefined) {
      this.log.debug(`Setting custom flag ${key} to ${value}`);
      this.args.set(key, value);
    }
    return this;
  }

  setBlockNumber(blockNumber?: number): PeerCommandBuilder {
    if (blockNumber !== undefined) {
      this.log.debug(`Setting block number to ${blockNumber}`);
      this.args.set("blockNumber", blockNumber);
    }
    return this;
  }

  setCAFile(caFile?: string): PeerCommandBuilder {
    if (caFile !== undefined) {
      this.log.debug(`Setting CA file to ${caFile}`);
      this.args.set("cafile", caFile);
    }
    return this;
  }

  setChannelConfigPolicy(policy?: string): PeerCommandBuilder {
    if (policy !== undefined) {
      this.log.debug(`Setting channel config policy to ${policy}`);
      this.args.set("channel-config-policy", policy);
    }
    return this;
  }

  setChannelID(channelID?: string): PeerCommandBuilder {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.set("channelID", channelID);
    }
    return this;
  }

  setCertFile(certFile?: string): PeerCommandBuilder {
    if (certFile !== undefined) {
      this.log.debug(`Setting cert file to ${certFile}`);
      this.args.set("certfile", certFile);
    }
    return this;
  }

  setClientAuth(clientAuth?: boolean): PeerCommandBuilder {
    if (clientAuth !== undefined) {
      this.log.debug(`Setting client authentication to ${clientAuth}`);
      this.args.set("clientauth", clientAuth);
    }
    return this;
  }

  setCollectionsConfig(collectionsConfig?: string): PeerCommandBuilder {
    if (collectionsConfig !== undefined) {
      this.log.debug(`Setting collections config to ${collectionsConfig}`);
      this.args.set("collections-config", collectionsConfig);
    }
    return this;
  }

  setConnTimeout(timeout?: string): PeerCommandBuilder {
    if (timeout !== undefined) {
      this.log.debug(`Setting connection timeout to ${timeout}`);
      this.args.set("connTimeout", timeout);
    }
    return this;
  }

  setFile(file?: string): PeerCommandBuilder {
    if (file !== undefined) {
      this.log.debug(`Setting file to ${file}`);
      this.args.set("file", file);
    }
    return this;
  }

  setKeyFile(keyfile?: string): PeerCommandBuilder {
    if (keyfile !== undefined) {
      this.log.debug(`Setting key file to ${keyfile}`);
      this.args.set("keyfile", keyfile);
    }
    return this;
  }

  setOutput(output?: string): PeerCommandBuilder {
    if (output !== undefined) {
      this.log.debug(`Setting output to ${output}`);
      this.args.set("output", output);
    }
    return this;
  }

  setOutputBlock(outputBlock?: string): PeerCommandBuilder {
    if (outputBlock !== undefined) {
      this.log.debug(`Setting output block to ${outputBlock}`);
      this.args.set("outputBlock", outputBlock);
    }
    return this;
  }

  setInitRequired(initRequired?: boolean): PeerCommandBuilder {
    if (initRequired !== undefined) {
      this.log.debug(`Setting init-required flag to ${initRequired}`);
      this.args.set("init-required", initRequired);
    }
    return this;
  }
  setOrderer(orderer?: string): PeerCommandBuilder {
    if (orderer !== undefined) {
      this.log.debug(`Setting orderer to ${orderer}`);
      this.args.set("orderer", orderer);
    }

    return this;
  }

  setSequence(sequence?: string): PeerCommandBuilder {
    if (sequence !== undefined) {
      this.log.debug(`Setting sequence to ${sequence}`);
      this.args.set("sequence", sequence);
    }
    return this;
  }

  setTls(tls?: boolean): PeerCommandBuilder {
    if (tls !== undefined) {
      this.log.debug(`Setting TLS flag to ${tls}`);
      this.args.set("tls", tls);
    }
    return this;
  }

  setTLSRootCertFile(certFile?: string): PeerCommandBuilder {
    if (certFile !== undefined) {
      this.log.debug(`Setting TLS root cert file to ${certFile}`);
      this.args.set("tlsRootCertFile", certFile);
    }
    return this;
  }

  setTlsHandshakeTimeShift(duration?: string): PeerCommandBuilder {
    if (duration !== undefined) {
      this.log.debug(`Setting TLS handshake time shift to ${duration}`);
      this.args.set("tlsHandshakeTimeShift", duration);
    }
    return this;
  }

  setSnapshotPath(snapshotPath?: string): PeerCommandBuilder {
    if (snapshotPath !== undefined) {
      this.log.debug(`Setting snapshot path to ${snapshotPath}`);
      this.args.set("snapshotPath", snapshotPath);
    }
    return this;
  }

  setSignaturePolicy(policy?: string): PeerCommandBuilder {
    if (policy !== undefined) {
      this.log.debug(`Setting signature policy to ${policy}`);
      this.args.set("signature-policy", policy);
    }
    return this;
  }

  setPeerAddress(address?: string): PeerCommandBuilder {
    if (address !== undefined) {
      this.log.debug(`Setting peer address to ${address}`);
      this.args.set("peerAddress", address);

      const [domain, port] = address.split(":");
      this.log.debug(`Extracted domain: ${domain}, port: ${port}`);

      this.config.peer!.id = domain;
      this.config.peer!.address = address;
      this.config.peer!.listenAddress = `0.0.0.0:${port}`;
      // For now it is set here but needs to be changed later in the implementation.
      this.config.peer!.gossip!.bootstrap = `127.0.0.1:${port}`;
      this.config.peer!.gossip!.externalEndpoint = address;
    }
    return this;
  }

  setDatabase(
    database?: string,
    config?: { uri?: string; user?: string; pass?: string }
  ): PeerCommandBuilder {
    if (database !== undefined) {
      this.log.debug(`Setting database to ${database}`);
      this.config.ledger!.state!.stateDatabase = database;

      if (database === "CouchDB") {
        if (config !== undefined && config.uri !== undefined) {
          this.log.debug(`Setting CouchDB URI to ${config.uri}`);
          this.config.ledger!.state!.couchDBConfig!.couchDBAddress = config.uri;
        }
        if (config !== undefined && config.user !== undefined) {
          this.log.debug(`Setting CouchDB user to ${config.user}`);
          this.config.ledger!.state!.couchDBConfig!.username = config.user;
        }
        if (config !== undefined && config.pass !== undefined) {
          this.log.debug(`Setting CouchDB password to ${config.pass}`);
          this.config.ledger!.state!.couchDBConfig!.password = config.pass;
        }
      }
    }

    return this;
  }

  setLocalMSPDir(dir?: string): PeerCommandBuilder {
    if (dir !== undefined) {
      this.log.debug(`Setting local MSP directory to ${dir}`);
      this.config.peer!.mspConfigPath = dir;
    }
    return this;
  }

  setOperationsAddress(address?: string): PeerCommandBuilder {
    if (address !== undefined) {
      this.log.debug(`Setting operations address to ${address}`);
      this.config.operations!.listenAddress = address;
    }
    return this;
  }

  setNetworkID(networkID?: string): PeerCommandBuilder {
    if (networkID !== undefined) {
      this.log.debug(`Setting network ID to ${networkID}`);
      this.config.peer!.networkId = networkID;
    }
    return this;
  }
  setLocalMSPID(mspID?: string): PeerCommandBuilder {
    if (mspID !== undefined) {
      this.log.debug(`Setting local MSP ID to ${mspID}`);
      this.config.peer!.localMspId = mspID;
    }
    return this;
  }

  setValidationPlugin(plugin?: string): PeerCommandBuilder {
    if (plugin !== undefined) {
      this.log.debug(`Setting validation plugin to ${plugin}`);
      this.args.set("validation-plugin", plugin);
    }
    return this;
  }

  setWaitForEvent(waitForEvent?: boolean): PeerCommandBuilder {
    if (waitForEvent !== undefined) {
      this.log.debug(`Setting wait for event flag to ${waitForEvent}`);
      this.args.set("waitForEvent", waitForEvent);
    }
    return this;
  }

  setWaitForEventTimeout(duration?: string): PeerCommandBuilder {
    if (duration !== undefined) {
      this.log.debug(`Setting wait for event timeout to ${duration}`);
      this.args.set("waitForEventTimeout", duration);
    }
    return this;
  }

  setBestEffort(bestEffort?: boolean): PeerCommandBuilder {
    if (bestEffort !== undefined) {
      this.log.debug(`Setting BestEffort flag to ${bestEffort}`);
      this.args.set("bestEffort", bestEffort);
    }
    return this;
  }

  setTrustRootCertFiles(certFile?: string[]): PeerCommandBuilder {
    if (certFile !== undefined) {
      this.log.debug(`Setting trust root cert files to ${certFile}`);
      this.args.set("trustRootCertFiles", certFile);
    }
    return this;
  }

  setTimeout(timeout?: string): PeerCommandBuilder {
    if (timeout !== undefined) {
      this.log.debug(`Setting timeout to ${timeout}`);
      this.args.set("timeout", timeout);
    }
    return this;
  }

  setOrdererTLSHostnameOverride(hostname?: string): PeerCommandBuilder {
    if (hostname !== undefined) {
      this.log.debug(`Setting OrdererTLSHostnameOverride to ${hostname}`);
      this.args.set("ordererTLSHostnameOverride", hostname);
    }
    return this;
  }

  setEndowmentPlugin(plugin?: string): PeerCommandBuilder {
    if (plugin !== undefined) {
      this.log.debug(`Setting endowment plugin to ${plugin}`);
      this.args.set("endowment-plugin", plugin);
    }
    return this;
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

  build(): string[] {
    const commandArray: string[] = [
      this.getBinary(),
      this.getCommand(),
      this.getSubCommand(),
    ].filter((el) => el !== undefined);

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

    if (!cpath.endsWith(".yaml")) cpath = path.join(cpath, "core.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.verbose(`Config file: ${JSON.stringify(this.config)}`, 3);
    writeFileYaml(cpath, this.config);

    return this;
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [
      this.getCommand(),
      this.getSubCommand(),
      ...this.getArgs(),
    ].filter((el) => el !== undefined);

    await runCommand(bin, argz);
  }
}
