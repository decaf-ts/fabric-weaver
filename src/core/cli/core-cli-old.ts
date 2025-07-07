// import { LogLevel } from "@decaf-ts/logging";
// import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";
// import { processEnrollmentRequest } from "../scripts/ca-client";
// import { BaseCLI } from "./base-cli";
// import { bootOrderer, issueOrderer, osnAdminJoin } from "../scripts/orderer";
// import { createGenesisBlock } from "../scripts/configtxgen";
// import { createNodeOU } from "../../fabric/general-utils/node-ou";
// import {
//   aproveChainCode,
//   bootPeer,
//   commitChainCode,
//   installChaincode,
//   packageChaincode,
//   peerFetchGenesisBlock,
//   peerJoinChannel,
// } from "../scripts/peer";
// import { safeParseInt } from "../../utils/parsers";

// export class CoreCLI extends BaseCLI {
//   constructor() {
//     super("weaver-core", "CLI for Core functionality");
//     this.setupCommands();
//   }

//   private setupCommands() {
//     this.dockerBootCA();
//     this.dockerIssueCA();
//     this.dockerClientRegister();
//     this.dockerClientEnroll();
//     this.dockerBootOrderer();
//     this.dockerIssueOrderer();
//     this.createGenesisBlock();
//     this.ordererChannelJoin();
//     this.dockerBootPeer();
//     this.dockerPeerJoinChannel();
//     this.dockerFetchConfigBlock();
//     this.createNodeOu();
//     this.dockerChaincodePackage();
//     this.dockerChaincodeInstall();
//     this.dockerAproveChaincode();
//     this.dockerCommitChaincode();
//   }

//   private dockerBootOrderer() {
//     this.program
//       .command("docker:boot-orderer")
//       .option("-d, --debug", "Enables debug mode")
//       .option(
//         "--config-location <string>",
//         "Path to the orderer configuration file"
//       )
//       .option(
//         "--listen-address <string>",
//         "Address for the orderer to listen on"
//       )
//       .option(
//         "--port <number>",
//         "Port for the orderer to listen on",
//         safeParseInt
//       )
//       .option("--local-mspdir <string>", "Local MSP directory")
//       .option("--local-mspid <string>", "Local MSP ID")
//       .option(
//         "--admin-listenaddress <string>",
//         "Address for the admin server to listen on"
//       )
//       .option(
//         "--consensus-snapdir <string>",
//         "Path to the consensus snapshot directory"
//       )
//       .option(
//         "--consensus-waldir <string>",
//         "Path to the consensus write-ahead log directory"
//       )
//       .option(
//         "--operations-address <string>",
//         "Address for the operations server to listen on"
//       )
//       .action(async (options) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Booting orderer...");

//         bootOrderer(options.configLocation, {
//           General: {
//             ListenAddress: options.listenAddress,
//             ListenPort: options.port,
//             LocalMSPDir: options.localMspdir,
//             LocalMSPID: options.localMspid,
//           },
//           Admin: {
//             ListenAddress: options.adminListenaddress,
//           },
//           Consensus: {
//             SnapDir: options.consensusSnapdir,
//             WALDir: options.consensusWaldir,
//           },
//           Operations: {
//             ListenAddress: options.operationsAddress,
//           },
//         });

//         this.log.info("Orderer booted successfully!");
//       });
//   }

//   private dockerIssueOrderer() {
//     this.program
//       .command("docker:issue-orderer")
//       .option("-d, --debug", "Enables debug mode")
//       .option(
//         "--config-location <string>",
//         "Path to the orderer configuration file"
//       )
//       .option(
//         "--listen-address <string>",
//         "Address for the orderer to listen on"
//       )
//       .option(
//         "--port <number>",
//         "Port for the orderer to listen on",
//         safeParseInt
//       )
//       .option("--local-mspdir <string>", "Local MSP directory")
//       .option("--local-mspid <string>", "Local MSP ID")
//       .option(
//         "--admin-listenaddress <string>",
//         "Address for the admin server to listen on"
//       )
//       .option(
//         "--consensus-snapdir <string>",
//         "Path to the consensus snapshot directory"
//       )
//       .option(
//         "--consensus-waldir <string>",
//         "Path to the consensus write-ahead log directory"
//       )
//       .option(
//         "--operations-address <string>",
//         "Address for the operations server to listen on"
//       )
//       .action((options) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Issueing orderer...");

//         issueOrderer(options.configLocation, {
//           General: {
//             ListenAddress: options.listenAddress,
//             ListenPort: options.port,
//             LocalMSPDir: options.localMspdir,
//             LocalMSPID: options.localMspid,
//           },
//           Admin: {
//             ListenAddress: options.adminListenaddress,
//           },
//           Consensus: {
//             SnapDir: options.consensusSnapdir,
//             WALDir: options.consensusWaldir,
//           },
//           Operations: {
//             ListenAddress: options.operationsAddress,
//           },
//         });
//         this.log.info("Orderer issued successfully!");
//       });
//   }

//   private createGenesisBlock() {
//     this.program
//       .command("docker:create-genesis-block")
//       .option("--config-path <string>", "Path to configtx file")
//       .option("--channel-id <string>", "Channel ID")
//       .option("--output-block <string>", "Path to output block file")
//       .option("--profile <string>", "Profile name")
//       .action(async (options: any) => {
//         await createGenesisBlock(
//           options.configPath,
//           options.profile,
//           options.channelId,
//           options.outputBlock
//         );
//       });
//   }

//   private createNodeOu() {
//     this.program
//       .command("docker:create-node-ou")
//       .option("--enable", "Enable node organizational unit")
//       .option("--path <string>", "Path to output directory", "cacerts")
//       .option("--mspdir <string>", "mspdirlocation")
//       .option("--cert <string>", "Cert file name", undefined)
//       .action(async (options: any) => {
//         createNodeOU(
//           options.enable,
//           options.path,
//           options.mspdir,
//           options.cert
//         );
//       });
//   }

//   private ordererChannelJoin() {
//     this.program
//       .command("docker:osn-admin-join")
//       .option("--channel-id <string>", "Channel id")
//       .option("--config-block <string>", "Path to config block file")
//       .option("--admin-address <string>", "Address of the OSN admin")
//       .option("--tls-ca <string>", "Path to TLS CA certificate")
//       .option("--tls-cert <string>", "Path to TLS certificate")
//       .option("--tls-key <string>", "Path to TLS key")
//       .option("--no-status", "Do not print status messages")
//       .action(async (options: any) => {
//         osnAdminJoin(
//           options.channelId,
//           options.configBlock,
//           options.adminAddress,
//           options.tlsCa,
//           options.tlsCert,
//           options.tlsKey,
//           options.noStatus
//         );
//       });
//   }

//   private dockerBootPeer() {
//     this.program
//       .command("docker:boot-peer")
//       .option("-d, --debug", "Enables debug mode")
//       .option(
//         "--config-location <string>",
//         "Path to the orderer configuration file"
//       )
//       .option("--database <string>", "Database type for the ledger")
//       .option(
//         "--peer-address <DOMAIN:PORT>",
//         "Address for the peer to listen on"
//       )
//       .option("--couchdb-address <string>", "Address for CouchDB")
//       .option("--couchdb-username <string>", "Username for CouchDB")
//       .option("--couchdb-password <string>", "Password for CouchDB")
//       .option(
//         "--operations-address <string>",
//         "Address for the operations server to listen on"
//       )
//       .option("--local-mspid <string>", "Local MSP ID")
//       .option("--local-mspdir <string>", "Local MSP DIR")
//       .option("--network-id <string>", "Network ID")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Issueing Peer...");
//         await bootPeer(options.configLocation, {
//           peer: {
//             address: options.peerAddress,
//             localMspId: options.localMspid,
//             networkId: options.networkId,
//             mspConfigPath: options.localMspdir,
//           },
//           ledger: {
//             state: {
//               stateDatabase: options.database,
//               couchDBConfig: {
//                 couchDBAddress: options.couchdbAddress,
//                 username: options.couchdbUsername,
//                 password: options.couchdbPassword,
//               },
//             },
//           },
//           operations: {
//             listenAddress: options.operationsAddress,
//           },
//         });
//         this.log.info("Peer issued successfully!");
//       });
//   }

//   private dockerFetchConfigBlock() {
//     this.program
//       .command("docker:fetch-block")
//       .option("-d, --debug", "Enables debug mode")
//       .option("--output-file <string>", "Path to output file for fetched block")
//       .option("--channel-id <string>", "Channel ID")
//       .option("--orderer-address <string>", "Address of the orderer")
//       .option("--block-number <number>", "Block number")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Fetching Config Block...");
//         peerFetchGenesisBlock(
//           options.channelId,
//           options.ordererAddress,
//           options.blockNumber,
//           options.outputFile
//         );
//         this.log.info("Config Block fetched successfully!");
//       });
//   }
//   private dockerPeerJoinChannel() {
//     this.program
//       .command("docker:peer-join-channel")
//       .option("-d, --debug", "Enables debug mode")
//       .option("--block-path <string>", "Path to the block file")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Joining Channel...");
//         peerJoinChannel(options.blockPath);
//         this.log.info("Channel joined successfully!");
//       });
//   }

//   private dockerChaincodePackage() {
//     this.program
//       .command("docker:chaincode-package")
//       .option("-d, --debug", "Enables debug mode")
//       .option("--chaincode-path <string>", "Path to the chaincode directory")
//       .option("--lang <string>", "Language of the chaincode")
//       .option("--chaincode-output <string>", "output location of the chaincode")
//       .option("--chaincode-name <string>", "Name of the chaincode")
//       .option("--chaincode-version <string>", "Version of the chaincode")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Packaging Chaincode...");
//         packageChaincode(
//           options.chaincodeOutput,
//           options.chaincodePath,
//           options.lang,
//           options.chaincodeName,
//           options.chaincodeVersion
//         );
//         this.log.info("Chaincode packaged successfully!");
//       });
//   }

//   private dockerChaincodeInstall() {
//     this.program
//       .command("docker:chaincode-install")
//       .option("-d, --debug", "Enables debug mode")
//       .option("--chaincode-path <string>", "Path to the chaincode directory")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Installing Chaincode...");
//         installChaincode(options.chaincodePath);
//         this.log.info("Installing chaincode successfully!");
//       });
//   }

//   private dockerAproveChaincode() {
//     this.program
//       .command("docker:aprove-chaincode")
//       .option("-d, --debug", "Enables debug mode")
//       .option("--orderer <string>", "Address of the orderer")
//       .option("--channel-id <string>", "Channel ID")
//       .option("--chaincode-name <string>", "Name of the chaincode")
//       .option("--chaincode-version <string>", "Version of the chaincode")
//       .option("--sequence <string>", "Sequence of the chaincode")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Approving Chaincode...");
//         aproveChainCode(
//           options.orderer,
//           options.channelId,
//           options.chaincodeName,
//           options.chaincodeVersion,
//           options.sequence
//         );
//         this.log.info("Chaincode approved successfully!");
//       });
//   }

//   private dockerCommitChaincode() {
//     this.program
//       .command("docker:commit-chaincode")
//       .option("-d, --debug", "Enables debug mode")
//       .option("--orderer <string>", "Address of the orderer")
//       .option("--channel-id <string>", "Channel ID")
//       .option("--chaincode-name <string>", "Name of the chaincode")
//       .option("--chaincode-version <string>", "Version of the chaincode")
//       .option("--sequence <string>", "Sequence of the chaincode")
//       .option("--peer-addresses <string>", "Addresses of the peers")
//       .action(async (options: any) => {
//         this.log.setConfig({
//           level: options.debug ? LogLevel.debug : LogLevel.info,
//         });
//         this.log.info("Commiting Chaincode...");
//         commitChainCode(
//           options.orderer,
//           options.channelId,
//           options.chaincodeName,
//           options.chaincodeVersion,
//           options.sequence,
//           options.peerAddresses
//         );
//         this.log.info("Chaincode commited successfully!");
//       });
//   }
// }
