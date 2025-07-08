import { Logger, Logging } from "@decaf-ts/logging";
import { OrdererCommand } from "../../fabric/constants/fabric-orderer";
import { FabricOrdererCommandBuilder } from "../../fabric/orderer/fabric-orderer-command-builder";
import path from "path";
import fs from "fs";
import { FabricOrdererConfigBuilder } from "../../fabric/orderer/fabric-orderer-config-builder";
import {
  AdminConfig,
  BCCSPConfig,
  BootstrapConfig,
  ChannelParticipationConfig,
  ClusterConfig,
  ConsensusConfig,
  DebugConfig,
  KafkaConfig,
  KeepAliveConfig,
  MetricsConfig,
  MSGSizeConfig,
  MSPConfig,
  OperationsConfig,
  ProfileConfig,
  TLSConfig,
} from "../../fabric/interfaces/fabric/orderer-config";

export function issueOrderer(
  log: Logger,
  cpath?: string,
  consensus?: ConsensusConfig,
  channelParticipation?: ChannelParticipationConfig,
  adminCfg?: AdminConfig,
  tls?: TLSConfig,
  port?: number,
  address?: string,
  keepAlive?: KeepAliveConfig,
  msgSize?: MSGSizeConfig,
  cluster?: ClusterConfig,
  boot?: BootstrapConfig,
  msp?: MSPConfig,
  profile?: ProfileConfig,
  metrics?: MetricsConfig,
  operations?: OperationsConfig,
  Kafka?: KafkaConfig,
  fileLedgerLocation?: string,
  authWindow?: string,
  bccsp?: BCCSPConfig,
  debug?: DebugConfig
) {
  log.debug("Issuing Orderer");

  const builder = new FabricOrdererConfigBuilder(log);
  builder
    .setConsensus(consensus)
    .setKafka(Kafka)
    .setFileLedgerLocation(fileLedgerLocation)
    .setAuthWindow(authWindow)
    .setBCCSP(bccsp)
    .setDebug(debug)
    .setCluster(cluster)
    .setBootstrap(boot)
    .setLocalMSP(msp)
    .setProfile(profile)
    .setMetrics(metrics)
    .setOperations(operations)
    .setChannelParticipation(channelParticipation)
    .setAdmin(adminCfg)
    .setTLS(tls)
    .setPort(port)
    .setListenAddress(address)
    .setKeepAlive(keepAlive)
    .setMSGSize(msgSize)
    .save(cpath);
}

export async function startOrderer() {
  const log: Logger = Logging.for(startOrderer);
  log.debug(`Starting Orderer`);
  const builder = new FabricOrdererCommandBuilder(log);

  builder.setCommand(OrdererCommand.START).execute();
}

export async function bootOrderer(
  log: Logger,
  cpath?: string,
  consensus?: ConsensusConfig,
  channelParticipation?: ChannelParticipationConfig,
  adminCfg?: AdminConfig,
  tls?: TLSConfig,
  port?: number,
  address?: string,
  keepAlive?: KeepAliveConfig,
  msgSize?: MSGSizeConfig,
  cluster?: ClusterConfig,
  boot?: BootstrapConfig,
  msp?: MSPConfig,
  profile?: ProfileConfig,
  metrics?: MetricsConfig,
  operations?: OperationsConfig,
  Kafka?: KafkaConfig,
  fileLedgerLocation?: string,
  authWindow?: string,
  bccsp?: BCCSPConfig,
  debug?: DebugConfig
) {
  if (!hasOrdererInitialized())
    issueOrderer(
      log,
      cpath,
      consensus,
      channelParticipation,
      adminCfg,
      tls,
      port,
      address,
      keepAlive,
      msgSize,
      cluster,
      boot,
      msp,
      profile,
      metrics,
      operations,
      Kafka,
      fileLedgerLocation,
      authWindow,
      bccsp,
      debug
    );
  startOrderer();
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

// export function osnAdminJoin(
//   channelID?: string,
//   configBlock?: string,
//   adminAddress?: string,
//   caFile?: string,
//   clientCert?: string,
//   clientKey?: string,
//   noStatus?: boolean
// ) {
//   const log: Logger = Logging.for(osnAdminJoin);
//   log.debug(`Joining Orderer to the network`);

//   const builder = new OSNAdminCommandBuilder();

//   builder
//     .setChannelID(channelID)
//     .setConfigBlock(configBlock)
//     .setOrdererAdminAddress(adminAddress)
//     .setCAFile(caFile)
//     .setClientCert(clientCert)
//     .setClientKey(clientKey)
//     .setNoStatus(noStatus)
//     .execute();
// }
