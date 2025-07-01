import { Logger, Logging } from "@decaf-ts/logging";
import {
  OrdererCommand,
  OrdererCommandBuilder,
  OrdererConfig,
  OSNAdminCommandBuilder,
} from "../../fabric/orderer/";
import path from "path";
import fs from "fs";
import { setOrdererEnvironment } from "../../utils-old/environment";

export function issueOrderer(
  cpath: string,
  ordererConfig: Partial<OrdererConfig>
) {
  const log: Logger = Logging.for(issueOrderer);
  log.debug(`Issuing Orderer with config: ${JSON.stringify(ordererConfig)}`);
  log.debug(`Writing configuration to ${cpath}`);

  const builder = new OrdererCommandBuilder();

  builder
    .setListenAddress(ordererConfig.General?.ListenAddress)
    .setListenPort(ordererConfig.General?.ListenPort)
    .setLocalMSPDir(ordererConfig.General?.LocalMSPDir)
    .setLocalMSPID(ordererConfig.General?.LocalMSPID)
    .setAdminListenAddress(ordererConfig.Admin?.ListenAddress)
    .setConsensusSnapDir(ordererConfig.Consensus?.SnapDir)
    .setConsensusWALDir(ordererConfig.Consensus?.WALDir)
    .setOperationsListenAddress(ordererConfig.Operations?.ListenAddress)
    .saveConfig(cpath);
}

export async function startOrderer(cpath: string) {
  const log: Logger = Logging.for(startOrderer);
  log.debug(`Starting Orderer`);
  setOrdererEnvironment(cpath);

  const builder = new OrdererCommandBuilder();

  await builder.setCommand(OrdererCommand.START).execute();
}

export async function bootOrderer(
  cpath: string,
  config: Partial<OrdererConfig>
) {
  const log: Logger = Logging.for(bootOrderer);
  log.debug(`Booting Orderer with config: ${JSON.stringify(config)}`);

  issueOrderer(cpath, config);
  await startOrderer(cpath);
}

export function hasOrdererInitialized(fileLocation?: string): boolean {
  const log: Logger = Logging.for(hasOrdererInitialized);

  const defaultFileLocation = path.join(
    __dirname,
    "../../../orderer/orderer.yaml"
  );

  if (!fileLocation) {
    log.debug(
      `No file location provided, using default file location: ${defaultFileLocation}`
    );
    fileLocation = defaultFileLocation;
  } else {
    if (!fileLocation.endsWith(".yaml"))
      fileLocation = path.join(fileLocation, "orderer.yaml");
    log.debug(`Using provided file location: ${fileLocation}`);
  }

  const booted = fs.existsSync(fileLocation);

  log.debug(`Orderer has been booted: ${booted}`);

  return booted;
}

export function osnAdminJoin(
  channelID?: string,
  configBlock?: string,
  adminAddress?: string,
  caFile?: string,
  clientCert?: string,
  clientKey?: string,
  noStatus?: boolean
) {
  const log: Logger = Logging.for(osnAdminJoin);
  log.debug(`Joining Orderer to the network`);

  const builder = new OSNAdminCommandBuilder();

  builder
    .setChannelID(channelID)
    .setConfigBlock(configBlock)
    .setOrdererAdminAddress(adminAddress)
    .setCAFile(caFile)
    .setClientCert(clientCert)
    .setClientKey(clientKey)
    .setNoStatus(noStatus)
    .execute();
}
