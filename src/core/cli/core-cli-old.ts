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
