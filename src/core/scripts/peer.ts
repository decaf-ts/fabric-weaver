import { Logger, Logging } from "@decaf-ts/logging";
import { PeerConfig } from "../../fabric/peer/peer-config";
import { PeerCommandBuilder } from "../../fabric/peer";
import { setPeerEnvironment } from "../../utils-old/environment";
import {
  PeerChannelCommands,
  PeerCommands,
  PeerLifecycleChaincodeCommands,
  PeerNodeCommands,
} from "../../fabric/peer/constants";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export function issuePeer(cpath: string, peerConfig: Partial<PeerConfig>) {
  const log: Logger = Logging.for(issuePeer);
  log.debug(`Issuing Peer with config: ${JSON.stringify(peerConfig)}`);
  log.debug(`Writing configuration to ${cpath}`);

  const builder = new PeerCommandBuilder();

  builder
    // .setBasicConfig()
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

export async function peerFetchGenesisBlock(
  channelID?: string,
  ordererAddress?: string,
  blockNumber?: string,
  outputFile?: string
) {
  const log: Logger = Logging.for(peerFetchGenesisBlock);
  log.debug(`Fetching Genesis Block`);

  const builder = new PeerCommandBuilder();

  const command = builder
    .setCommand(PeerCommands.CHANNEL)
    .setSubCommand(
      `${PeerChannelCommands.FETCH} ${blockNumber || "--help"} ${outputFile || ""}`
    )
    .setChannelID(channelID)
    .setOrderer(ordererAddress)
    .build();

  log.info(`Executing command: ${command.join(" ")}`);

  execSync(command.join(" "), { stdio: "inherit" });
  //  `peer channel fetch ${isExternal ? '0' : 'config'} ./genesis.block \
  //         --tls \
  //         --cafile ${cfg.channel.ordererCaFile}`],
}

export async function peerJoinChannel(blockLocation?: string) {
  const log: Logger = Logging.for(peerJoinChannel);
  log.debug(`Joining Channel`);
  const builder = new PeerCommandBuilder();

  builder
    .setCommand(PeerCommands.CHANNEL)
    .setSubCommand(PeerChannelCommands.JOIN)
    .setBlockPath(blockLocation)
    .execute();
}

export async function packageChaincode(
  outputFile?: string,
  contractPath?: string,
  lang?: string,
  contractName?: string,
  contractVersion?: string
) {
  const log: Logger = Logging.for(packageChaincode);
  log.debug(`Packaging Chaincode`);

  const builder = new PeerCommandBuilder();

  const cmd = builder
    .setCommand(PeerCommands.LIFECYCLE_CHAINCODE)
    .setSubCommand(
      `${PeerLifecycleChaincodeCommands.PACKAGE} ${outputFile || ""}`
    )
    .setPath(contractPath)
    .setLang(lang)
    .setLabel(`${contractName}_${contractVersion}`)
    .build();

  execSync(cmd.join(" "), { stdio: "inherit" });
}

export async function installChaincode(chaincodePath?: string) {
  const log: Logger = Logging.for(installChaincode);
  log.debug(`Installing Chaincode`);

  const builder = new PeerCommandBuilder();

  const cmd = builder
    .setCommand(PeerCommands.LIFECYCLE_CHAINCODE)
    .setSubCommand(`${PeerLifecycleChaincodeCommands.INSTALL} ${chaincodePath}`)
    .build();

  execSync(cmd.join(" "), { stdio: "inherit" });
}

export async function aproveChainCode(
  orderer?: string,
  channelID?: string,
  chaincodeName?: string,
  version?: string,
  sequence?: string
) {
  const log: Logger = Logging.for(aproveChainCode);
  log.info(`Approving Chaincode`);

  const idBuilder = new PeerCommandBuilder();
  const builder = new PeerCommandBuilder();

  const id = execSync(
    idBuilder
      .setCommand(PeerCommands.LIFECYCLE_CHAINCODE)
      .setSubCommand(PeerLifecycleChaincodeCommands.QUERYINSTALLED)
      .build()
      .join(" ")
  )
    .toString()
    .split(",")[0]
    .split("\n")[1]
    .split(":")
    .slice(1)
    .map((s) => s.trim())
    .join(":");

  log.info(`Chaincode ID: ${id}`);

  const cmd = builder
    .setCommand(PeerCommands.LIFECYCLE_CHAINCODE)
    .setSubCommand(`${PeerLifecycleChaincodeCommands.APPROVEFORMYORG}`)
    .setOrderer(orderer)
    .setChannelID(channelID)
    .setChaincodeName(chaincodeName)
    .setCustom("version", version)
    .setPackageID(id)
    .setSequence(sequence)
    .build();

  execSync(cmd.join(" "), { stdio: "inherit" });
}

export async function commitChainCode(
  orderer?: string,
  channelID?: string,
  chaincodeName?: string,
  version?: string,
  sequence?: string,
  peerAddress?: string
) {
  const log: Logger = Logging.for(commitChainCode);

  const readinessCheck = function () {
    log.info(`Checking Chaincode Readiness`);
    const builder = new PeerCommandBuilder();
    const cmd = builder
      .setCommand(PeerCommands.LIFECYCLE_CHAINCODE)
      .setSubCommand(PeerLifecycleChaincodeCommands.CHECKCOMMITREADINESS)
      .setChannelID(channelID)
      .setChaincodeName(chaincodeName)
      .setCustom("version", version)
      .setSequence(sequence)
      .setOutput("json")
      .build();

    const approvalData = execSync(cmd.join(" ")).toString();

    const approvalJSON = JSON.parse(approvalData);
    const isReady =
      Object.keys(approvalJSON.approvals).filter(
        (key) => approvalJSON.approvals[key] == true
      ).length >
      Object.keys(approvalJSON.approvals).length / 2;

    log.info(
      `Chaincode Readiness: ${isReady} with ${
        Object.keys(approvalJSON.approvals).filter(
          (key) => approvalJSON.approvals[key] == true
        ).length
      }/${Object.keys(approvalJSON.approvals).length}`
    );

    return isReady;
  };

  const commitCode = function () {
    log.info(`Committing Chaincode`);
    const builder = new PeerCommandBuilder();

    const cmd = builder
      .setCommand(PeerCommands.LIFECYCLE_CHAINCODE)
      .setSubCommand(`${PeerLifecycleChaincodeCommands.COMMIT}`)
      .setOrderer(orderer)
      .setChannelID(channelID)
      .setChaincodeName(chaincodeName)
      .setCustom("version", version)
      .setSequence(sequence)
      // .setCustom("peer-addresses", peerAddresses)
      .build();

    peerAddress
      ?.split(",")
      .map((address) => cmd.push(`--peerAddresses ${address}`));

    execSync(cmd.join(" "), { stdio: "inherit" });
  };

  if (readinessCheck()) {
    commitCode();
  } else {
    log.info("Chaincode not ready, waiting for approval...");
    await new Promise((resolve) => setTimeout(resolve, 15000));
    commitChainCode(
      orderer,
      channelID,
      chaincodeName,
      version,
      sequence,
      peerAddress
    );
  }
}

// export function commitChainCode(contract: ChainCodeRequest, channel: Pick<peerBootConfig, 'channel' | 'port' | 'peerName'>, skipReadyCheck: boolean, skipCommit: boolean, collectionPath: string){

//         runCommand(`peer lifecycle chaincode commit \

//
//                 --tls \
//                 --cafile ${channel.channel.ordererCaFile} \
//                 --peerAddresses ${channel.peerName}:${channel.port} \
//                 --tlsRootCertFiles ${channel.channel.ordererCaFile} \
//                 --collections-config ${collectionPath}`)
//     }

//     if(skipCommit) return;

//     verifyAndCommit(contract, channel, skipReadyCheck);
// }
