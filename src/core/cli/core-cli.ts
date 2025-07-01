import { LogLevel } from "@decaf-ts/logging";
import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";
import { CAConfig } from "../../fabric/fabric-ca-server-old/fabric-ca-server-config";
import { safeParseInt } from "../../utils-old/parsers";
import { processEnrollmentRequest } from "../scripts/ca-client";
import { bootCAServer, issueCA } from "../scripts/ca-server";
import { BaseCLI } from "./base-cli";
import { bootOrderer, issueOrderer, osnAdminJoin } from "../scripts/orderer";
import { createGenesisBlock } from "../scripts/configtxgen";
import { createNodeOU } from "../../fabric/general-utils/node-ou";
import {
  aproveChainCode,
  bootPeer,
  commitChainCode,
  installChaincode,
  packageChaincode,
  peerFetchGenesisBlock,
  peerJoinChannel,
} from "../scripts/peer";

export class CoreCLI extends BaseCLI {
  constructor() {
    super("weaver-core", "CLI for Core functionality");
    this.setupCommands();
  }

  private setupCommands() {
    this.dockerBootCA();
    this.dockerIssueCA();
    this.dockerClientRegister();
    this.dockerClientEnroll();
    this.dockerBootOrderer();
    this.dockerIssueOrderer();
    this.createGenesisBlock();
    this.ordererChannelJoin();
    this.dockerBootPeer();
    this.dockerPeerJoinChannel();
    this.dockerFetchConfigBlock();
    this.createNodeOu();
    this.dockerChaincodePackage();
    this.dockerChaincodeInstall();
    this.dockerAproveChaincode();
    this.dockerCommitChaincode();
  }

  private dockerBootCA() {
    this.program
      .command("docker:boot-ca")
      .description("Boot the CA server")
      .option(
        "-h, --home <directory>",
        "Home directory for the CA server",
        "/weaver/server/"
      )
      .option(
        "--boot-file <file>",
        "Boot file location (optional). Defaults to <rootDir>/server/ca-cert.pem",
        undefined
      )
      .option(
        "-p, --port <number>",
        "Port for the CA server (default: 7054)",
        safeParseInt,
        7054
      )
      .option("-d, --debug", "Enable debug mode (default: false)")
      .option(
        "-b, --bootstrap-user <USER:SECRET>",
        "Bootstrap Identity for the the CA server. If no other authenticators are configured, the bootstrap identity is mandatory.",
        undefined
      )
      .option("-l, --log-level <level>", "Log level (default: info)")
      .option(
        "--ca-name <string>",
        "CA name in lower case migth be word separated with -",
        undefined
      )
      .option("--operations-address <string>", "Operations address", undefined)
      .option("--metrics-address <string>", "Metrics address", undefined)
      .option("--no-tls", "Disable TLS profile (default: false)")
      .option("--no-ca", "Disable CA profile (default: false)")
      .action((options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info(`Booting CA with home directory: ${options.home}`);
        this.log.info(`CA server port: ${options.port}`);
        this.log.info(
          `Boot file location: ${options.bootFile ? options.bootFile : "{workdir}/server/ca-cert.pem"}`
        );

        const config: CAConfig = {
          port: options.port,
          debug: options.debug,
          bootstrapUser: options.bootstrapUser,
          logLevel: options.logLevel,
          noCA: options.noCa,
          noTLS: options.noTls,
          ca: {
            name: options.caName,
          },
          operations: {
            listenAddress: options.operationsAddress,
          },
          metrics: {
            statsd: {
              address: options.metricsAddress,
            },
          },
        };

        bootCAServer(this.log, options.home, config, options.bootFile);
      });

    // .option('--working-dir <string>', 'Working directory inside docker container. Defaults to "aeon"', 'aeon')
    // .option('--ca-name <string>', 'CA name in lower case migth be word separated with -. Defaults to "fabric-ca"', 'fabric-ca')
    // .option('-d, --debug', 'Enable debug mode defaults to "false"', false)
    // .option('--tls-enabled', 'Enable tls communication. Defaults to "false"', false)
    // .option('--tls-certfile <string>', 'TLS Certfile location', undefined)
    // .option('--tls-keyfile <string>', 'TLS Keyfile location', undefined)
    // .option("--max-enrollments <string>", "maximum enrollments", safeParseInt, -1)
    // .option('--user <string>', 'Identity Username to start the server', 'admin')
    // .option('--user-secret <string>', 'Identity Secret to start the server', 'admin-password')
    // .option('--domain <string>', 'Server domain', '0.0.0.0')
    // .option('--operations-address <string>', 'address for operations endpoint as <domain>:<port>', '127.0.0.1:8001')
    // .option('--enrollment-requests <EnrollmentRequestArray>', 'Array of enrollment requests passed as a JSON stringified', safeParseJSON, [])
    // .option('--tls-enrollment-requests <EnrollmentRequestArray>', 'Array of enrollment requests passed as a JSON stringified', safeParseJSON, [])
    // .option('--is-tls', 'Signals this is a TLS CA', false)
    // .option("--maxpathlen <string>", "CA max path length", safeParseInt, 0)
    // .option("--pathlength <string>", "CA pathlenght", safeParseInt, 1)
    // .option('--is-ica', 'Signals this is a TLS CA', false)
    // .option('--parent-url <string>', 'Parent Server URL with credentials')
    // .option('--parent-name <string>', 'Parent CA Server Name')
    // .option('--parent-tls <string>', 'Parent tls certfile location')
    // .option('--orderer-name <string>', 'Orderer USER')
    // .option('--orderer-folder <string>', 'Orderer folder')
    // .option('--orderer-enrollment-requests <EnrollmentRequestArray>', 'Array of enrollment requests passed as a JSON stringified', safeParseJSON, [])
    // .option('--nodeou-cert-name <string>', 'TLS Certfile location', undefined)
    // .option('--peer-name <string>', 'Peer USER')
    // .option('--peer-folder <string>', 'peer folder')
    // .option('--peer-enrollment-requests <EnrollmentRequestArray>', 'Array of enrollment requests passed as a JSON stringified', safeParseJSON, [])
    // .option('--orderer-tls <string>', 'Orderer Tls file name')
    // .option('--peer-tls <string>', 'Peer Tls file name')
    // .option('--backend-url <string>', 'Backend url')
    // .option('--is-external', 'Signals booting process for ca external to aeon private infrastructure', false)
  }
  private dockerIssueCA() {
    this.program
      .command("docker:issue-ca")
      .description("Boot the CA server")
      .option(
        "-h, --home <directory>",
        "Home directory for the CA server",
        "/weaver/server/"
      )
      .option(
        "--boot-file <file>",
        "Boot file location (optional). Defaults to <rootDir>/server/ca-cert.pem",
        undefined
      )
      .option(
        "-p, --port <number>",
        "Port for the CA server (default: 7054)",
        safeParseInt,
        7054
      )
      .option("-d, --debug", "Enable debug mode (default: false)")
      .option(
        "-b, --bootstrap-user <USER:SECRET>",
        "Bootstrap Identity for the the CA server. If no other authenticators are configured, the bootstrap identity is mandatory.",
        undefined
      )
      .option("-l, --log-level <level>", "Log level (default: info)")
      .option(
        "--ca-name <string>",
        "CA name in lower case migth be word separated with -",
        undefined
      )
      .option("--operations-address <string>", "Operations address", undefined)
      .option("--metrics-address <string>", "Metrics address", undefined)
      .option("--no-tls", "Disable TLS profile (default: false)")
      .option("--no-ca", "Disable CA profile (default: false)")
      .action((options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info(`Booting CA with home directory: ${options.home}`);
        this.log.info(`CA server port: ${options.port}`);
        this.log.info(
          `Boot file location: ${options.bootFile ? options.bootFile : "{workdir}/server/ca-cert.pem"}`
        );

        const config: CAConfig = {
          port: options.port,
          debug: options.debug,
          bootstrapUser: options.bootstrapUser,
          logLevel: options.logLevel,
          noCA: options.noCa,
          noTLS: options.noTls,
          ca: {
            name: options.caName,
          },
          operations: {
            listenAddress: options.operationsAddress,
          },
          metrics: {
            statsd: {
              address: options.metricsAddress,
            },
          },
        };

        issueCA(this.log, options.home, config);
        this.log.info("CA server issued successfully!");
      });
  }
  private dockerClientRegister() {
    this.program
      .command("docker:client-register")
      .description("Register a Client")
      .option("--url <PROTOCOl://DOMAIN:PORT>", "URL of the CA server")
      .option("--id-name <string>", "Client ID")
      .option("--id-secret <string>", "Client Secret")
      .option("--id-type <string>", "Client Type")
      .option("--id-attrs <string>", "Client Attributes")
      .option("--tls-certfiles <string>", "TLS Certfile location")
      .option("--mspdir <string>", "MSP directory")
      .option("-d, --debug", "Enable debug mode (default: false)")
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info(`Registering client ${options.idName} ...`);
        this.log.info(`Debug: ${options.debug}`);
        this.log.info(`URL: ${options.url}`);
        if (options.debug) this.log.debug(`Secret: ${options.idSecret}`);
        this.log.info(`TLS Certfiles: ${options.tlsCertfiles}`);
        this.log.info(`MSP directory: ${options.mspdir}`);
        this.log.info(`ID Attributes: ${options.idAttrs}`);

        await processEnrollmentRequest({
          type: FabricCAClientCommand.REGISTER,
          request: {
            url: options.url,
            idName: options.idName,
            idSecret: options.idSecret,
            tlsCertfiles: options.tlsCertfiles,
            mspdir: options.mspdir,
            idType: options.idType,
            idAttrs: options.idAttrs,
          },
        });

        this.log.info("Client registered successfully!");
      });
  }
  private dockerClientEnroll() {
    this.program
      .command("docker:client-enroll")
      .description("Enroll a Client")
      .option(
        "--url <PROTOCOl://USER:PASSWORD@DOMAIN:PORT>",
        "URL of the CA server containing the user and password"
      )
      .option("--mspdir <string>", "MSP directory")
      .option("--tls-certfiles <CSV>", "TLS Certfile location")
      .option("-d, --debug", "Enable debug mode (default: false)")
      .option("--home <string>", "Home directory for the client")
      .option("--csr-hosts <CSV>", "Comma-separated list of CSR hostnames")
      .option(
        "-c, --change-keyname",
        "Change the keyname of the enrolled client"
      )
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info(`Enrolling client...`);
        this.log.info(`Debug: ${options.debug}`);

        if (options.url) {
          try {
            const url = new URL(options.url);

            const protocol = url.protocol.slice(0, -1); // Remove the trailing ':'
            const username = url.username;
            const password = url.password;
            const domain = url.hostname;
            const port = url.port;

            this.log.info(`Protocol: ${protocol}`);
            this.log.info(`Username: ${username}`);
            if (options.debug) {
              this.log.debug(`Password: ${password}`);
            } else {
              this.log.info(`Password: ********`);
            }
            this.log.info(`Domain: ${domain}`);
            this.log.info(`Port: ${port}`);
          } catch (error) {
            this.log.error("Invalid URL format: " + error);
          }
        } else {
          this.log.error("URL is required for enrollment");
          return;
        }

        this.log.info(`TLS Certfiles: ${options.tlsCertfiles}`);
        this.log.info(`MSP directory: ${options.mspdir}`);

        await processEnrollmentRequest({
          type: FabricCAClientCommand.ENROLL,
          request: {
            url: options.url,
            tlsCertfiles: options.tlsCertfiles,
            mspdir: options.mspdir,
            home: options.home,
            csrHosts: options.csrHosts?.split(",") || undefined,
          },
          changeKeyName: options.changeKeyname,
        });

        this.log.info("Client enrolled successfully!");
      });
  }

  private dockerBootOrderer() {
    this.program
      .command("docker:boot-orderer")
      .option("-d, --debug", "Enables debug mode")
      .option(
        "--config-location <string>",
        "Path to the orderer configuration file"
      )
      .option(
        "--listen-address <string>",
        "Address for the orderer to listen on"
      )
      .option(
        "--port <number>",
        "Port for the orderer to listen on",
        safeParseInt
      )
      .option("--local-mspdir <string>", "Local MSP directory")
      .option("--local-mspid <string>", "Local MSP ID")
      .option(
        "--admin-listenaddress <string>",
        "Address for the admin server to listen on"
      )
      .option(
        "--consensus-snapdir <string>",
        "Path to the consensus snapshot directory"
      )
      .option(
        "--consensus-waldir <string>",
        "Path to the consensus write-ahead log directory"
      )
      .option(
        "--operations-address <string>",
        "Address for the operations server to listen on"
      )
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Booting orderer...");

        bootOrderer(options.configLocation, {
          General: {
            ListenAddress: options.listenAddress,
            ListenPort: options.port,
            LocalMSPDir: options.localMspdir,
            LocalMSPID: options.localMspid,
          },
          Admin: {
            ListenAddress: options.adminListenaddress,
          },
          Consensus: {
            SnapDir: options.consensusSnapdir,
            WALDir: options.consensusWaldir,
          },
          Operations: {
            ListenAddress: options.operationsAddress,
          },
        });

        this.log.info("Orderer booted successfully!");
      });
  }

  private dockerIssueOrderer() {
    this.program
      .command("docker:issue-orderer")
      .option("-d, --debug", "Enables debug mode")
      .option(
        "--config-location <string>",
        "Path to the orderer configuration file"
      )
      .option(
        "--listen-address <string>",
        "Address for the orderer to listen on"
      )
      .option(
        "--port <number>",
        "Port for the orderer to listen on",
        safeParseInt
      )
      .option("--local-mspdir <string>", "Local MSP directory")
      .option("--local-mspid <string>", "Local MSP ID")
      .option(
        "--admin-listenaddress <string>",
        "Address for the admin server to listen on"
      )
      .option(
        "--consensus-snapdir <string>",
        "Path to the consensus snapshot directory"
      )
      .option(
        "--consensus-waldir <string>",
        "Path to the consensus write-ahead log directory"
      )
      .option(
        "--operations-address <string>",
        "Address for the operations server to listen on"
      )
      .action((options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Issueing orderer...");

        issueOrderer(options.configLocation, {
          General: {
            ListenAddress: options.listenAddress,
            ListenPort: options.port,
            LocalMSPDir: options.localMspdir,
            LocalMSPID: options.localMspid,
          },
          Admin: {
            ListenAddress: options.adminListenaddress,
          },
          Consensus: {
            SnapDir: options.consensusSnapdir,
            WALDir: options.consensusWaldir,
          },
          Operations: {
            ListenAddress: options.operationsAddress,
          },
        });
        this.log.info("Orderer issued successfully!");
      });
  }

  private createGenesisBlock() {
    this.program
      .command("docker:create-genesis-block")
      .option("--config-path <string>", "Path to configtx file")
      .option("--channel-id <string>", "Channel ID")
      .option("--output-block <string>", "Path to output block file")
      .option("--profile <string>", "Profile name")
      .action(async (options: any) => {
        await createGenesisBlock(
          options.configPath,
          options.profile,
          options.channelId,
          options.outputBlock
        );
      });
  }

  private createNodeOu() {
    this.program
      .command("docker:create-node-ou")
      .option("--enable", "Enable node organizational unit")
      .option("--path <string>", "Path to output directory", "cacerts")
      .option("--mspdir <string>", "mspdirlocation")
      .option("--cert <string>", "Cert file name", undefined)
      .action(async (options: any) => {
        createNodeOU(
          options.enable,
          options.path,
          options.mspdir,
          options.cert
        );
      });
  }

  private ordererChannelJoin() {
    this.program
      .command("docker:osn-admin-join")
      .option("--channel-id <string>", "Channel id")
      .option("--config-block <string>", "Path to config block file")
      .option("--admin-address <string>", "Address of the OSN admin")
      .option("--tls-ca <string>", "Path to TLS CA certificate")
      .option("--tls-cert <string>", "Path to TLS certificate")
      .option("--tls-key <string>", "Path to TLS key")
      .option("--no-status", "Do not print status messages")
      .action(async (options: any) => {
        osnAdminJoin(
          options.channelId,
          options.configBlock,
          options.adminAddress,
          options.tlsCa,
          options.tlsCert,
          options.tlsKey,
          options.noStatus
        );
      });
  }

  private dockerBootPeer() {
    this.program
      .command("docker:boot-peer")
      .option("-d, --debug", "Enables debug mode")
      .option(
        "--config-location <string>",
        "Path to the orderer configuration file"
      )
      .option("--database <string>", "Database type for the ledger")
      .option(
        "--peer-address <DOMAIN:PORT>",
        "Address for the peer to listen on"
      )
      .option("--couchdb-address <string>", "Address for CouchDB")
      .option("--couchdb-username <string>", "Username for CouchDB")
      .option("--couchdb-password <string>", "Password for CouchDB")
      .option(
        "--operations-address <string>",
        "Address for the operations server to listen on"
      )
      .option("--local-mspid <string>", "Local MSP ID")
      .option("--local-mspdir <string>", "Local MSP DIR")
      .option("--network-id <string>", "Network ID")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Issueing Peer...");
        await bootPeer(options.configLocation, {
          peer: {
            address: options.peerAddress,
            localMspId: options.localMspid,
            networkId: options.networkId,
            mspConfigPath: options.localMspdir,
          },
          ledger: {
            state: {
              stateDatabase: options.database,
              couchDBConfig: {
                couchDBAddress: options.couchdbAddress,
                username: options.couchdbUsername,
                password: options.couchdbPassword,
              },
            },
          },
          operations: {
            listenAddress: options.operationsAddress,
          },
        });
        this.log.info("Peer issued successfully!");
      });
  }

  private dockerFetchConfigBlock() {
    this.program
      .command("docker:fetch-block")
      .option("-d, --debug", "Enables debug mode")
      .option("--output-file <string>", "Path to output file for fetched block")
      .option("--channel-id <string>", "Channel ID")
      .option("--orderer-address <string>", "Address of the orderer")
      .option("--block-number <number>", "Block number")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Fetching Config Block...");
        peerFetchGenesisBlock(
          options.channelId,
          options.ordererAddress,
          options.blockNumber,
          options.outputFile
        );
        this.log.info("Config Block fetched successfully!");
      });
  }
  private dockerPeerJoinChannel() {
    this.program
      .command("docker:peer-join-channel")
      .option("-d, --debug", "Enables debug mode")
      .option("--block-path <string>", "Path to the block file")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Joining Channel...");
        peerJoinChannel(options.blockPath);
        this.log.info("Channel joined successfully!");
      });
  }

  private dockerChaincodePackage() {
    this.program
      .command("docker:chaincode-package")
      .option("-d, --debug", "Enables debug mode")
      .option("--chaincode-path <string>", "Path to the chaincode directory")
      .option("--lang <string>", "Language of the chaincode")
      .option("--chaincode-output <string>", "output location of the chaincode")
      .option("--chaincode-name <string>", "Name of the chaincode")
      .option("--chaincode-version <string>", "Version of the chaincode")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Packaging Chaincode...");
        packageChaincode(
          options.chaincodeOutput,
          options.chaincodePath,
          options.lang,
          options.chaincodeName,
          options.chaincodeVersion
        );
        this.log.info("Chaincode packaged successfully!");
      });
  }

  private dockerChaincodeInstall() {
    this.program
      .command("docker:chaincode-install")
      .option("-d, --debug", "Enables debug mode")
      .option("--chaincode-path <string>", "Path to the chaincode directory")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Installing Chaincode...");
        installChaincode(options.chaincodePath);
        this.log.info("Installing chaincode successfully!");
      });
  }

  private dockerAproveChaincode() {
    this.program
      .command("docker:aprove-chaincode")
      .option("-d, --debug", "Enables debug mode")
      .option("--orderer <string>", "Address of the orderer")
      .option("--channel-id <string>", "Channel ID")
      .option("--chaincode-name <string>", "Name of the chaincode")
      .option("--chaincode-version <string>", "Version of the chaincode")
      .option("--sequence <string>", "Sequence of the chaincode")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Approving Chaincode...");
        aproveChainCode(
          options.orderer,
          options.channelId,
          options.chaincodeName,
          options.chaincodeVersion,
          options.sequence
        );
        this.log.info("Chaincode approved successfully!");
      });
  }

  private dockerCommitChaincode() {
    this.program
      .command("docker:commit-chaincode")
      .option("-d, --debug", "Enables debug mode")
      .option("--orderer <string>", "Address of the orderer")
      .option("--channel-id <string>", "Channel ID")
      .option("--chaincode-name <string>", "Name of the chaincode")
      .option("--chaincode-version <string>", "Version of the chaincode")
      .option("--sequence <string>", "Sequence of the chaincode")
      .option("--peer-addresses <string>", "Addresses of the peers")
      .action(async (options: any) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Commiting Chaincode...");
        commitChainCode(
          options.orderer,
          options.channelId,
          options.chaincodeName,
          options.chaincodeVersion,
          options.sequence,
          options.peerAddresses
        );
        this.log.info("Chaincode commited successfully!");
      });
  }
}
