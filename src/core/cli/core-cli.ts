import { FabricLogLevel } from "../../fabric/general/constants";
import { CAConfig } from "../../fabric/fabric-ca-server/fabric-ca-server-config";
import { safeParseInt } from "../../utils/parsers";
import { bootCAServer } from "../scripts/ca";
import { BaseCLI } from "./base-cli";

export class CoreCLI extends BaseCLI {
  constructor() {
    super("weaver-core", "CLI for Core functionality");
    this.setupCommands();
  }

  private setupCommands() {
    // Add docker-specific commands here
    this.program
      .command("hello")
      .description("A base command")
      .action(() => {
        this.log.info("Hello world");
      });

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
      .option(
        "-l, --log-level <level>",
        "Log level (default: info)",
        FabricLogLevel.INFO
      )
      .option(
        "--ca-name <string>",
        "CA name in lower case migth be word separated with -",
        undefined
      )
      .option("--operations-address <string>", "Operations address", undefined)
      .option("--metrics-address <string>", "Metrics address", undefined)
      .action((options) => {
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

        bootCAServer(options.home, config, options.bootFile);
      });
  }
}

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
