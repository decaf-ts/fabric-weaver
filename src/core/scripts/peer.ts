import path from "path";
import fs from "fs";
import { Logger, Logging } from "@decaf-ts/logging";
import { FabricPeerConfigBuilder } from "../../fabric/peer/fabric-peer-config-builder";
import {
  BCCSPConfig,
  ChaincodeConfig,
  DeliveryClientConfig,
  DiscoveryConfig,
  GatewayConfig,
  GeneralConfig,
  GossipConfig,
  HandlersConfig,
  KeepAliveConfig,
  LedgerStateConfig,
  LimitsConfig,
  MSGSizeConfig,
  MSPConfig,
  PrivateDataStoreConfig,
  ProfileConfig,
  TLSConfig,
} from "../../fabric/interfaces/fabric/peer-config";
import {
  MetricsConfig,
  OperationsConfig,
} from "../../fabric/interfaces/fabric/general-configs";
import { FabricPeerNodeCommandBuilder } from "../../fabric/peer/fabric-peer-node-command-builder";
import {
  PeerChannelCommands,
  PeerLifecycleChaincodeCommands,
  PeerNodeCommands,
} from "../../fabric/constants/fabric-peer";
import { FabricPeerChannelCommandBuilder } from "../../fabric/peer/fabric-peer-channel-command-builder";
import { FabricPeerLifecycleChaincodeCommandBuilder } from "../../fabric/peer/fabric-peer-lifecycle-chaincode-command-builder";
import { execSync } from "child_process";

export function issuePeer(
  log: Logger,
  cpath: string,
  gossip?: GossipConfig,
  tls?: TLSConfig,
  authTimeWindow?: string,
  keepAlive?: KeepAliveConfig,
  gateway?: GatewayConfig,
  general?: GeneralConfig,
  bccsp?: BCCSPConfig,
  msp?: MSPConfig,
  clientConnectionTimeout?: string,
  delivery?: DeliveryClientConfig,
  profile?: ProfileConfig,
  handlers?: HandlersConfig,
  discovery?: DiscoveryConfig,
  limits?: LimitsConfig,
  msgSize?: MSGSizeConfig,
  chaincode?: ChaincodeConfig,
  state?: LedgerStateConfig,
  blockchain?: any,
  enableLedgerHistoryDatabase?: boolean,
  pvtData?: PrivateDataStoreConfig,
  ledgerSnapshosRootDir?: string,
  operation?: OperationsConfig,
  metrics?: MetricsConfig
) {
  const logger = Logging.for(issuePeer);
  log.debug(`Issuing Peer...`);
  log.debug(`Writing configuration to ${cpath}`);

  const builder = new FabricPeerConfigBuilder(logger);

  builder
    .setGossip(gossip)
    .setTLS(tls)
    .setLedgerSnapshotsRootDir(ledgerSnapshosRootDir)
    .setOperations(operation)
    .setMetrics(metrics)
    .enableLedgerHistoryDatabase(enableLedgerHistoryDatabase)
    .setLedgerPvtDataStore(pvtData)
    .setHandlers(handlers)
    .setDiscovery(discovery)
    .setLimits(limits)
    .setMessageSize(msgSize)
    .setChaincode(chaincode)
    .setLedgerState(state)
    .setLegerBlockchain(blockchain)
    .setAuthentication(authTimeWindow)
    .setKeepAlice(keepAlive)
    .setGateway(gateway)
    .setGeneral(general)
    .setBCCSP(bccsp)
    .setMspConfig(msp)
    .setConnTimeoutClient(clientConnectionTimeout)
    .setDeliveryClient(delivery)
    .setProfile(profile)
    .save(cpath);
}

export async function startPeer(logger: Logger) {
  const log: Logger = logger.for(startPeer);
  log.debug(`Starting Peer`);

  const builder = new FabricPeerNodeCommandBuilder(log);

  builder.setCommand(PeerNodeCommands.START).execute();
}

export async function bootPeer(
  log: Logger,
  cpath: string,
  gossip?: GossipConfig,
  tls?: TLSConfig,
  authTimeWindow?: string,
  keepAlive?: KeepAliveConfig,
  gateway?: GatewayConfig,
  general?: GeneralConfig,
  bccsp?: BCCSPConfig,
  msp?: MSPConfig,
  clientConnectionTimeout?: string,
  delivery?: DeliveryClientConfig,
  profile?: ProfileConfig,
  handlers?: HandlersConfig,
  discovery?: DiscoveryConfig,
  limits?: LimitsConfig,
  msgSize?: MSGSizeConfig,
  chaincode?: ChaincodeConfig,
  state?: LedgerStateConfig,
  blockchain?: any,
  enableLedgerHistoryDatabase?: boolean,
  pvtData?: PrivateDataStoreConfig,
  ledgerSnapshosRootDir?: string,
  operation?: OperationsConfig,
  metrics?: MetricsConfig
) {
  const logger = Logging.for(bootPeer);
  log.debug(`Booting Peer...`);

  if (!hasPeerInitialized(cpath))
    issuePeer(
      logger,
      cpath,
      gossip,
      tls,
      authTimeWindow,
      keepAlive,
      gateway,
      general,
      bccsp,
      msp,
      clientConnectionTimeout,
      delivery,
      profile,
      handlers,
      discovery,
      limits,
      msgSize,
      chaincode,
      state,
      blockchain,
      enableLedgerHistoryDatabase,
      pvtData,
      ledgerSnapshosRootDir,
      operation,
      metrics
    );

  startPeer(logger);
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

  log.debug(`Peer has been booted: ${booted}`);

  return booted;
}

export function peerFetchGenesisBlock(
  logger?: Logger,
  channelID?: string,
  ordererAddress?: string,
  blockNumber?: string,
  outputFile?: string,
  tlsEnabled?: boolean,
  tlsCACertFile?: string
) {
  const log: Logger = Logging.for(peerFetchGenesisBlock);
  log.debug(`Fetching Genesis Block`);

  const builder = new FabricPeerChannelCommandBuilder(logger);

  builder
    .enableTLS(tlsEnabled)
    .setCommand(PeerChannelCommands.FETCH)
    .setBlockReference(blockNumber)
    .setDestination(outputFile)
    .setOrderer(ordererAddress)
    .setChannelID(channelID)
    .setTLSCAFile(tlsCACertFile)
    .execute();
}

export async function peerJoinChannel(logger?: Logger, blockPath?: string) {
  const log: Logger = Logging.for(peerJoinChannel);
  log.debug(`Joining Channel`);

  const builder = new FabricPeerChannelCommandBuilder(logger);

  builder
    .setCommand(PeerChannelCommands.JOIN)
    .setBlockPath(blockPath)
    .execute();
}

export function packageChaincode(
  logger?: Logger,
  outputFile?: string,
  contractPath?: string,
  lang?: string,
  contractName?: string,
  contractVersion?: string
) {
  const log: Logger = Logging.for(packageChaincode);
  log.debug(`Packaging Chaincode`);

  const builder = new FabricPeerLifecycleChaincodeCommandBuilder(logger);

  builder
    .setCommand(PeerLifecycleChaincodeCommands.PACKAGE)
    .setDestination(outputFile)
    .setContractPath(contractPath)
    .setLang(lang)
    .setLabel(`${contractName}_${contractVersion}`)
    .execute();
}

export function installChaincode(logger: Logger, contractLocation?: string) {
  const log: Logger = Logging.for(installChaincode);
  log.debug(`Installing Chaincode`);

  const builder = new FabricPeerLifecycleChaincodeCommandBuilder(logger);

  builder
    .setCommand(PeerLifecycleChaincodeCommands.INSTALL)
    .setDestination(contractLocation)
    .execute();
}

export function approveChaincode(
  logger: Logger,
  ordererAddress?: string,
  channelID?: string,
  chaincodeName?: string,
  version?: string,
  sequence?: string,
  enableTLS?: boolean,
  tlsCACertFile?: string,
  collectionConfigPath?: string,
  ordererTLSHostnameOverride?: string
) {
  const log: Logger = Logging.for(installChaincode);
  log.debug(`Approve Chaincode`);

  const builder = new FabricPeerLifecycleChaincodeCommandBuilder(logger);

  const id = execSync(
    builder.setCommand(PeerLifecycleChaincodeCommands.QUERYINSTALLED).build()
  );

  log.debug(`Using id: ${id}`);

  builder
    .setCommand(PeerLifecycleChaincodeCommands.APPROVEFORMYORG)
    .setOrdererAddress(ordererAddress)
    .setChannelID(channelID)
    .setContractName(chaincodeName)
    .setVersion(version)
    .setSequence(sequence)
    .enableTLS(enableTLS)
    .setTLSCAFile(tlsCACertFile)
    .setOrdererTLSHostnameOverride(ordererTLSHostnameOverride)
    .setCollectionsConfigPath(collectionConfigPath)
    .setPackageID(
      id
        .toString()
        .split(",")[0]
        .split("\n")[1]
        .split(":")
        .slice(1)
        .map((s) => s.trim())
        .join(":")
    )
    .execute();
}

export async function commitChainCode(
  logger: Logger,
  ordererAddress?: string,
  channelID?: string,
  chaincodeName?: string,
  version?: string,
  sequence?: string,
  enableTLS?: boolean,
  tlsCACertFile?: string,
  collectionConfigPath?: string,
  ordererTLSHostnameOverride?: string,
  peerAddresses?: string[],
  peerTLSRoots?: string[]
) {
  const log: Logger = Logging.for(commitChainCode);
  log.info(`Commiting chaincode`);

  const checkChaincodeReadiness = function (
    logger: Logger,
    channelID?: string,
    chaincodeName?: string,
    version?: string,
    sequence?: string,
    enableTLS?: boolean,
    tlsCACertFile?: string
  ) {
    const verificationBuilder = new FabricPeerLifecycleChaincodeCommandBuilder(
      logger
    );

    const approvalData = execSync(
      verificationBuilder
        .setCommand(PeerLifecycleChaincodeCommands.CHECKCOMMITREADINESS)
        .setChannelID(channelID)
        .setContractName(chaincodeName)
        .setVersion(version)
        .setSequence(sequence)
        .enableTLS(enableTLS)
        .setTLSCAFile(tlsCACertFile)
        .setOutput("json")
        .build()
    ).toString();

    const approvalJSON = JSON.parse(approvalData);

    log.info(JSON.stringify(approvalJSON, null, 2));

    return (
      Object.keys(approvalJSON.approvals).filter(
        (key) => approvalJSON.approvals[key] == true
      ).length >
      Object.keys(approvalJSON.approvals).length / 2
    );
  };

  const commitWhenReady = function (
    logger: Logger,
    ordererAddress?: string,
    channelID?: string,
    chaincodeName?: string,
    version?: string,
    sequence?: string,
    enableTLS?: boolean,
    tlsCACertFile?: string,
    collectionConfigPath?: string,
    ordererTLSHostnameOverride?: string,
    peerAddresses?: string[],
    peerTLSRoots?: string[]
  ) {
    if (
      !checkChaincodeReadiness(
        logger,
        channelID,
        chaincodeName,
        version,
        sequence,
        enableTLS,
        tlsCACertFile
      )
    ) {
      log.info("Chaincode not ready, waiting...");
      return setTimeout(() => {
        commitWhenReady(
          logger,
          ordererAddress,
          channelID,
          chaincodeName,
          version,
          sequence,
          enableTLS,
          tlsCACertFile,
          collectionConfigPath,
          ordererTLSHostnameOverride,
          peerAddresses,
          peerTLSRoots
        );
      }, 30000);
    }

    new FabricPeerLifecycleChaincodeCommandBuilder(logger)
      .setCommand(PeerLifecycleChaincodeCommands.COMMIT)
      .setOrdererAddress(ordererAddress)
      .setChannelID(channelID)
      .setContractName(chaincodeName)
      .setVersion(version)
      .setSequence(sequence)
      .enableTLS(enableTLS)
      .setTLSCAFile(tlsCACertFile)
      .setCollectionsConfigPath(collectionConfigPath)
      .setOrdererTLSHostnameOverride(ordererTLSHostnameOverride)
      .setPeerAddresses(peerAddresses)
      .setPeerTLSRoots(peerTLSRoots)
      .execute();
  };

  commitWhenReady(
    logger,
    ordererAddress,
    channelID,
    chaincodeName,
    version,
    sequence,
    enableTLS,
    tlsCACertFile,
    collectionConfigPath,
    ordererTLSHostnameOverride,
    peerAddresses,
    peerTLSRoots
  );
}
