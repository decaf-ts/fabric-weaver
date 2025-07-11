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
