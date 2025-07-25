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

  private peerDetails: { peerAddresses?: string[]; peerTLSRoots?: string[] } =
    {};

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

  setOrdererAddress(ordererAddress?: string): this {
    if (ordererAddress !== undefined) {
      this.log.debug(`Setting orderer address to ${ordererAddress}`);
      this.args.push(`--orderer ${ordererAddress}`);
    }
    return this;
  }

  setChannelID(channelID?: string): this {
    if (channelID !== undefined) {
      this.log.debug(`Setting channel ID to ${channelID}`);
      this.args.push(`--channelID ${channelID}`);
    }
    return this;
  }

  setContractName(contractName?: string): this {
    if (contractName !== undefined) {
      this.log.debug(`Setting contract name to ${contractName}`);
      this.args.push(`--name ${contractName}`);
    }
    return this;
  }

  setVersion(version?: string): this {
    if (version !== undefined) {
      this.log.debug(`Setting contract version to ${version}`);
      this.args.push(`--version ${version}`);
    }
    return this;
  }

  setPackageID(packageID?: string): this {
    if (packageID !== undefined) {
      this.log.debug(`Setting contract package ID to ${packageID}`);
      this.args.push(`--package-id ${packageID}`);
    }
    return this;
  }

  setSequence(sequence?: string): this {
    if (sequence !== undefined) {
      this.log.debug(`Setting contract sequence to ${sequence}`);
      this.args.push(`--sequence ${sequence}`);
    }
    return this;
  }

  enableTLS(enable?: boolean): this {
    if (enable !== undefined && enable === true) {
      this.log.debug(`Setting TLS enabled: ${enable}`);
      this.args.push("--tls");
    }
    return this;
  }

  setTLSCAFile(caFile?: string): this {
    if (caFile !== undefined) {
      this.log.debug(`Setting TLS CA file: ${caFile}`);
      this.args.push(`--cafile ${caFile}`);
    }
    return this;
  }

  setOrdererTLSHostnameOverride(ordererTLSHostnameOverride?: string): this {
    if (ordererTLSHostnameOverride !== undefined) {
      this.log.debug(
        `Setting orderer TLS hostname override to ${ordererTLSHostnameOverride}`
      );
      this.args.push(
        `--ordererTLSHostnameOverride ${ordererTLSHostnameOverride}`
      );
    }
    return this;
  }

  setCollectionsConfigPath(collectionsConfigPath?: string): this {
    if (collectionsConfigPath !== undefined) {
      this.log.debug(
        `Setting collection configuration path to ${collectionsConfigPath}`
      );
      this.args.push(`--collections-config ${collectionsConfigPath}`);
    }
    return this;
  }

  setPeerAddresses(peerAddresses?: string[]): this {
    if (
      peerAddresses !== undefined &&
      Array.isArray(peerAddresses) &&
      peerAddresses.length > 0
    ) {
      this.log.debug(`Setting peer addresses: ${peerAddresses.join(", ")}`);
      this.peerDetails.peerAddresses = peerAddresses;
    }
    return this;
  }

  setPeerTLSRoots(peerTLSRoots?: string[]): this {
    if (
      peerTLSRoots !== undefined &&
      Array.isArray(peerTLSRoots) &&
      peerTLSRoots.length > 0
    ) {
      this.log.debug(`Setting peer TLS roots: ${peerTLSRoots.join(", ")}`);
      this.peerDetails.peerTLSRoots = peerTLSRoots;
    }
    return this;
  }

  setOutput(output?: string): this {
    if (output !== undefined) {
      this.log.debug(`Setting output to ${output}`);
      this.args.push(`--output ${output}`);
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
      ...(this.generatePeerDetails() || []),
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

  private generatePeerDetails(): string[] | undefined {
    const peerAddresses = this.peerDetails.peerAddresses || undefined;
    const peerTLSRoots = this.peerDetails.peerTLSRoots || undefined;

    this.log.info(
      `Generating peer details: ${peerAddresses}, ${peerTLSRoots}...`
    );
    if (
      peerAddresses !== undefined &&
      Array.isArray(peerAddresses) &&
      peerAddresses.length > 0
    ) {
      const peerCommands = peerAddresses.map((address, i) => {
        let str = `--peerAddresses ${address}`;

        if (peerTLSRoots !== undefined && Array.isArray(peerTLSRoots)) {
          str += ` --tlsRootCertFiles ${peerTLSRoots[i]}`;
        }

        return str;
      });

      this.log.info(`Generated peer details: ${peerCommands}`);

      return peerCommands;
    }

    return undefined;
  }

  async execute(options?: { [indexer: string]: string }): Promise<void> {
    const bin = this.getBinary();
    const argz = [
      this.getBaseCommand(),
      this.getCommand(),
      this.destination,
      ...this.getArgs(),
      ...(this.generatePeerDetails() || []),
    ].filter(
      (item) => item !== undefined && item !== null && item !== ""
    ) as string[];

    try {
      // const regex = /\[\s*INFO\s*\] Listening on http/;
      // can be used as a promise but to lock the logs running as execsync
      return (await runCommand(bin, argz, options)) as unknown as Promise<void>;
    } catch (error: unknown) {
      this.log.error(`Error: Failed to execute the command: ${error}`);
      process.exit(1);
    }
  }
}
