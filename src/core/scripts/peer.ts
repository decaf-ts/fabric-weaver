import { Logger, Logging } from "@decaf-ts/logging";
import { PeerConfig } from "../../fabric/peer/peer-config";
import { PeerCommandBuilder } from "../../fabric/peer";
import { setPeerEnvironment } from "../../utils/environment";
import { PeerCommands, PeerNodeCommands } from "../../fabric/peer/constants";
import path from "path";
import fs from "fs";

export function issuePeer(cpath: string, peerConfig: Partial<PeerConfig>) {
  const log: Logger = Logging.for(issuePeer);
  log.debug(`Issuing Peer with config: ${JSON.stringify(peerConfig)}`);
  log.debug(`Writing configuration to ${cpath}`);

  const builder = new PeerCommandBuilder();

  builder
    .setPeerAddress(peerConfig?.peer?.address)
    .setDatabase(peerConfig.ledger?.state?.stateDatabase, {
      uri: peerConfig.ledger?.state?.couchDBConfig?.couchDBAddress,
      user: peerConfig.ledger?.state?.couchDBConfig?.username,
      pass: peerConfig.ledger?.state?.couchDBConfig?.password,
    })
    .setLocalMSPDir(peerConfig.peer?.mspConfigPath)
    .setOperationsAddress(peerConfig.operations?.listenAddress)
    .setNetworkID(peerConfig.peer?.networkId)
    .setLocalMSPID(peerConfig.peer?.localMspId)
    .saveConfig(cpath);
}

export async function startPeer(cpath: string) {
  const log: Logger = Logging.for(startPeer);
  log.debug(`Starting Peer`);
  setPeerEnvironment(cpath);

  const builder = new PeerCommandBuilder();

  await builder
    .setCommand(PeerCommands.NODE)
    .setSubCommand(PeerNodeCommands.START)
    .execute();
}

export async function bootPeer(cpath: string, config: Partial<PeerConfig>) {
  const log: Logger = Logging.for(bootPeer);
  log.debug(`Booting Peer with config: ${JSON.stringify(config)}`);

  issuePeer(cpath, config);
  await startPeer(cpath);
}

export function hasPeerInitialized(fileLocation?: string): boolean {
  const log: Logger = Logging.for(hasPeerInitialized);

  const defaultFileLocation = path.join(__dirname, "../../../peer/core.yaml");

  if (!fileLocation) {
    log.debug(
      `No file location provided, using default file location: ${defaultFileLocation}`
    );
    fileLocation = defaultFileLocation;
  } else {
    if (!fileLocation.endsWith(".yaml"))
      fileLocation = path.join(fileLocation, "core.yaml");
    log.debug(`Using provided file location: ${fileLocation}`);
  }

  const booted = fs.existsSync(fileLocation);

  log.debug(`Orderer has been booted: ${booted}`);

  return booted;
}
