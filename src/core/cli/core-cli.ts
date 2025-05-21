import { LogLevel } from "@decaf-ts/logging";
import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";
import { CAConfig } from "../../fabric/fabric-ca-server/fabric-ca-server-config";
import { safeParseInt } from "../../utils/parsers";
import { processEnrollmentRequest } from "../scripts/ca-client";
import { bootCAServer, issueCA } from "../scripts/ca-server";
import { BaseCLI } from "./base-cli";

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

        bootCAServer(options.home, config, options.bootFile);
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

        issueCA(options.home, config);
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
      .option("--tls-certfiles <string>", "TLS Certfile location")
      .option("--mspdir <string>", "MSP directory")
      .option("-d, --debug", "Enable debug mode (default: false)")
      .action((options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info(`Registering client ${options.idName} ...`);
        this.log.info(`Debug: ${options.debug}`);
        this.log.info(`URL: ${options.url}`);
        if (options.debug) this.log.debug(`Secret: ${options.idSecret}`);
        this.log.info(`TLS Certfiles: ${options.tlsCertfiles}`);
        this.log.info(`MSP directory: ${options.mspdir}`);

        processEnrollmentRequest({
          type: FabricCAClientCommand.REGISTER,
          request: {
            url: options.url,
            idName: options.idName,
            idSecret: options.idSecret,
            tlsCertfiles: options.tlsCertfiles,
            mspdir: options.mspdir,
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
      .action((options) => {
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

        processEnrollmentRequest({
          type: FabricCAClientCommand.ENROLL,
          request: {
            url: options.url,
            tlsCertfiles: options.tlsCertfiles,
            mspdir: options.mspdir,
          },
        });

        this.log.info("Client enrolled successfully!");
      });
  }
}
