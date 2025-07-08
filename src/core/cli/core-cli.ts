import { LogLevel } from "@decaf-ts/logging";
import { BaseCLI } from "./base-cli";
import { bootCA, issueCA, startCA } from "../scripts/ca-server";
import { safeParseCSV, safeParseInt } from "../../utils/parsers";
import { COLON_SEPARATOR } from "../constants/constants";
import { clientEnrollment } from "../scripts/ca-client";
import { configtxgen } from "../scripts/configtxgen";
import { createNodeOU } from "../../fabric/node-ou/node-ou";
import { bootOrderer } from "../scripts/orderer";

export class CoreCLI extends BaseCLI {
  constructor() {
    super("weaver-core", "CLI for core fabric functionality");

    this.setup();
  }

  private setup() {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    ).filter(
      (name) =>
        name !== "constructor" &&
        typeof this[name as keyof CoreCLI] === "function" &&
        name !== "setup"
    );

    for (const methodName of methodNames) {
      try {
        this[methodName as keyof CoreCLI]();
      } catch (error) {
        console.error(`Error calling method ${methodName}:`, error);
      }
    }
  }

  private issueFabricCAServer() {
    this.program
      .command("issue-ca")
      .description("Generates a Fabric CA Server config file")
      .option("-d, --debug", "Enables debug mode")
      .option("--config-version <string>", "Fabric CA Server Config version")
      .option(
        "--port <number>",
        "Port number for the Fabric CA Server",
        safeParseInt
      )
      .option("--cors-enabled", "Enable CORS")
      .option(
        "--cors-origins <CommaSeparatedValues>",
        "Comma Separated List of allowed CORS origins",
        safeParseCSV
      )
      .option("--crl-size <number>", "CRL Size Limit", safeParseInt)
      .option("--tls-enabled", "Enable TLS")
      .option("--tls-certfile <string>", "TLS Certificate File")
      .option("--tls-keyfile <string>", "TLS Key File")
      .option(
        "--tls-client-certfiles <CSV>",
        "TLS Client Certificate Files",
        safeParseCSV
      )
      .option("--tls-client-type <string>", "TLS Client Type")
      .option("--ca-name <string>", "CA Name")
      .option("--ca-keyfile <string>", "CA Key File")
      .option("--ca-certfile <string>", "CA Certificate File")
      .option("--ca-chainfile <string>", "CA Chain File")
      .option(
        "--ca-reenroll-ignore-cert-expiry",
        "Reenroll Ignore Cert Expiry Flag"
      )
      //TODO: Change so it can handle multiple identities
      .option("--bootstrap-users <USER:PASSWORD>", "Bootstrap user:password")
      .option("--no-tls-profile", "Remove tls profile")
      .option("--no-ca-profile", "Remove ca profile")
      .option("--csr-cn <string>", "CSR Common Name")
      .option("--csr-hosts <CSV>", "CSR Hosts", safeParseCSV)
      .option("--csr-keyrequest-algo <string>", "CSR Key Request Algo")
      .option(
        "--csr-keyrequest-size <number>",
        "CSR Key Request Size",
        safeParseInt
      )
      .option("--csr-ca-expiry <string>", "CSR CA Expiry")
      .option("--csr-ca-pathlength <number>", "CSR CA Pathlength", safeParseInt)
      //TODO: Missing a way to deal with names in CSR
      //TODO: Map setMaxEnrollments
      //TODO: Map setDatabase
      //TODO: Map setLDAP
      //TODO: Map setAffiliations
      //TODO: Map setSigning
      //TODO: Map setIdemix
      //TODO: Map setBCCSP
      //TODO: Map setCACount
      //TODO: Map setCAFiles
      //TODO: Map setIntermediate
      //TODO: Map setPasswordAttempts
      .option(
        "--operations-listen-address <string>",
        "Operations Listen Address"
      )
      .option("--operations-tls-enabled", "Operations TLS Enabled")
      .option(
        "--operations-tls-certfile <string>",
        "Operations TLS Certificate File"
      )
      .option("--operations-tls-keyfile <string>", "Operations TLS Key File")
      .option(
        "--operations-tls-clientauth-required",
        "Operations TLS Client Auth Required"
      )
      .option(
        "--operations-tls-clientauth-rootcas <CSV>",
        "List of client root ca files",
        safeParseCSV
      )
      .option("--home <string>", "Home directory for the Fabric CA Server")
      .option("--metrics-provider <string>", "Metrics Provider")
      .option("--metrics-statsd-network", "Metrics StatsD Network")
      .option("--metrics-statsd-address", "Metrics StatsD Address")
      .option("--metrics-statsd-prefix", "Metrics StatsD Prefix")
      .option("--metris-statsd-write-interval", "Metrics StatsD Write Interval")
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Issuing Fabric CA Server config...");
        this.log.debug(`Options: ${JSON.stringify(options, null, 2)}`);

        let user, password;

        if (options.bootstrapUsers !== undefined) {
          [user, password] = options.bootstrapUsers.split(COLON_SEPARATOR);
        }

        this.log.info(`Bootstrap users: ${user}:${password}`);

        try {
          issueCA(
            this.log,
            options.home,
            options.configVersion,
            options.port,
            {
              enabled: options.corsEnabled,
              origins: options.corsOrigins,
            },
            options.debug,
            options.crlSize,
            {
              enabled: options.tlsEnabled,
              certfile: options.tlsCertfile,
              keyfile: options.tlsKeyfile,
              clientauth: {
                type: options.tlsClientType,
                certfiles: options.tlsClientCertfiles,
              },
            },
            {
              name: options.caName,
              keyfile: options.caKeyfile,
              certfile: options.caCertfile,
              chainfile: options.caChainfile,
              reenrollIgnoreCertExpiry: options.caReenrollIgnoreCertExpiry,
            },
            [
              {
                name: user,
                pass: password,
              },
            ],
            options.noTlsProfile,
            options.noCaProfile,
            {
              cn: options.csrCn,
              hosts: options.csrHosts,
              keyrequest: {
                algo: options.csrKeyrequestAlgo,
                size: options.csrKeyrequestSize,
              },
              ca: {
                expiry: options.csrCaExpiry,
                pathlength: options.csrCaPathlength,
              },
              names: undefined, // TODO: Implement names in CSR
            },
            {
              listenAddress: options.operationsListenAddress,
              tls: {
                enabled: options.operationsTlsEnabled,
                cert: {
                  file: options.operationsTlsCertfile,
                },

                key: {
                  file: options.operationsTlsKeyfile,
                },

                clientAuthRequired: options.operationsTlsClientauthRequired,
                clientRootCAs: {
                  files: options.operationsTlsClientauthRootcas,
                },
              },
            },
            {
              provider: options.metricsProvider,
              statsd: {
                network: options.metricsStatsdNetwork,
                address: options.metricsStatsdAddress,
                prefix: options.metricsStatsdPrefix,
                writeInterval: options.metricsStatsdWriteInterval,
              },
            }
          );
        } catch (error) {
          this.log.error(`"Error issuing Fabric CA Server config: ${error}"`);
          return;
        }

        this.log.info("Fabric CA Server config issued successfully!");
      });
  }

  private startFabricCAServer() {
    this.program
      .command("start")
      .description("Starts the Fabric CA Server")
      .option("-d, --debug", "Enables debug mode")
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Starting Fabric CA Server...");
        try {
          await startCA(this.log);
        } catch (error) {
          this.log.error(`Error starting Fabric CA Server: ${error}`);
          return;
        }

        this.log.info("Fabric CA Server started successfully!");
      });
  }

  private bootCAServer() {
    this.program
      .command("boot-ca")
      .description("Generates a Fabric CA Server config file")
      .option("-d, --debug", "Enables debug mode")
      .option("--config-version <string>", "Fabric CA Server Config version")
      .option(
        "--port <number>",
        "Port number for the Fabric CA Server",
        safeParseInt
      )
      .option("--cors-enabled", "Enable CORS")
      .option(
        "--cors-origins <CommaSeparatedValues>",
        "Comma Separated List of allowed CORS origins",
        safeParseCSV
      )
      .option("--crl-size <number>", "CRL Size Limit", safeParseInt)
      .option("--tls-enabled", "Enable TLS")
      .option("--tls-certfile <string>", "TLS Certificate File")
      .option("--tls-keyfile <string>", "TLS Key File")
      .option(
        "--tls-client-certfiles <CSV>",
        "TLS Client Certificate Files",
        safeParseCSV
      )
      .option("--tls-client-type <string>", "TLS Client Type")
      .option("--ca-name <string>", "CA Name")
      .option("--ca-keyfile <string>", "CA Key File")
      .option("--ca-certfile <string>", "CA Certificate File")
      .option("--ca-chainfile <string>", "CA Chain File")
      .option(
        "--ca-reenroll-ignore-cert-expiry",
        "Reenroll Ignore Cert Expiry Flag"
      )
      //TODO: Change so it can handle multiple identities
      .option("--bootstrap-users <USER:PASSWORD>", "Bootstrap user:password")
      .option("--no-tls-profile", "Remove tls profile")
      .option("--no-ca-profile", "Remove ca profile")
      .option("--csr-cn <string>", "CSR Common Name")
      .option("--csr-hosts <CSV>", "CSR Hosts", safeParseCSV)
      .option("--csr-keyrequest-algo <string>", "CSR Key Request Algo")
      .option(
        "--csr-keyrequest-size <number>",
        "CSR Key Request Size",
        safeParseInt
      )
      .option("--csr-ca-expiry <string>", "CSR CA Expiry")
      .option("--csr-ca-pathlength <number>", "CSR CA Pathlength", safeParseInt)
      //TODO: Missing a way to deal with names in CSR
      //TODO: Map setMaxEnrollments
      //TODO: Map setDatabase
      //TODO: Map setLDAP
      //TODO: Map setAffiliations
      //TODO: Map setSigning
      //TODO: Map setIdemix
      //TODO: Map setBCCSP
      //TODO: Map setCACount
      //TODO: Map setCAFiles
      //TODO: Map setIntermediate
      //TODO: Map setPasswordAttempts
      .option(
        "--operations-listen-address <string>",
        "Operations Listen Address"
      )
      .option("--operations-tls-enabled", "Operations TLS Enabled")
      .option(
        "--operations-tls-certfile <string>",
        "Operations TLS Certificate File"
      )
      .option("--operations-tls-keyfile <string>", "Operations TLS Key File")
      .option(
        "--operations-tls-clientauth-required",
        "Operations TLS Client Auth Required"
      )
      .option(
        "--operations-tls-clientauth-rootcas <CSV>",
        "List of client root ca files",
        safeParseCSV
      )
      .option("--home <string>", "Home directory for the Fabric CA Server")
      .option("--metrics-provider <string>", "Metrics Provider")
      .option("--metrics-statsd-network", "Metrics StatsD Network")
      .option("--metrics-statsd-address", "Metrics StatsD Address")
      .option("--metrics-statsd-prefix", "Metrics StatsD Prefix")
      .option("--metris-statsd-write-interval", "Metrics StatsD Write Interval")
      .option("--boot-file <string>", "Fabric CA Server Config File Path")
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Booting fabric CA Server...");
        this.log.debug(`Options: ${JSON.stringify(options, null, 2)}`);

        let user, password;

        if (options.bootstrapUsers !== undefined) {
          [user, password] = options.bootstrapUsers.split(COLON_SEPARATOR);
        }

        this.log.info(`Bootstrap users: ${user}:${password}`);

        try {
          await bootCA(
            this.log,
            options.home,
            options.configVersion,
            options.port,
            {
              enabled: options.corsEnabled,
              origins: options.corsOrigins,
            },
            options.debug,
            options.crlSize,
            {
              enabled: options.tlsEnabled,
              certfile: options.tlsCertfile,
              keyfile: options.tlsKeyfile,
              clientauth: {
                type: options.tlsClientType,
                certfiles: options.tlsClientCertfiles,
              },
            },
            {
              name: options.caName,
              keyfile: options.caKeyfile,
              certfile: options.caCertfile,
              chainfile: options.caChainfile,
              reenrollIgnoreCertExpiry: options.caReenrollIgnoreCertExpiry,
            },
            [
              {
                name: user,
                pass: password,
              },
            ],
            options.noTlsProfile,
            options.noCaProfile,
            {
              cn: options.csrCn,
              hosts: options.csrHosts,
              keyrequest: {
                algo: options.csrKeyrequestAlgo,
                size: options.csrKeyrequestSize,
              },
              ca: {
                expiry: options.csrCaExpiry,
                pathlength: options.csrCaPathlength,
              },
              names: undefined, // TODO: Implement names in CSR
            },
            {
              listenAddress: options.operationsListenAddress,
              tls: {
                enabled: options.operationsTlsEnabled,
                cert: {
                  file: options.operationsTlsCertfile,
                },

                key: {
                  file: options.operationsTlsKeyfile,
                },

                clientAuthRequired: options.operationsTlsClientauthRequired,
                clientRootCAs: {
                  files: options.operationsTlsClientauthRootcas,
                },
              },
            },
            {
              provider: options.metricsProvider,
              statsd: {
                network: options.metricsStatsdNetwork,
                address: options.metricsStatsdAddress,
                prefix: options.metricsStatsdPrefix,
                writeInterval: options.metricsStatsdWriteInterval,
              },
            },
            options.bootFile
          );
        } catch (error) {
          this.log.error(`"Error issuing Fabric CA Server config: ${error}"`);
          return;
        }

        this.log.info("Fabric CA Server config issued successfully!");
      });
  }

  private clientEnrollment() {
    this.program
      .command("client-enrollment")
      .description("Command to handle identities register and enroll")
      .option("-d, --debug", "Enables debug mode")
      .option("--command <string>", "Command to execute (enroll or register)")
      .option("--csr-cn <string>", "CSR Common Name")
      .option("--csr-hosts <CSV>", "CSR Hosts", safeParseCSV)
      .option("--csr-keyrequest-algo <string>", "CSR Key Request Algo")
      .option(
        "--csr-keyrequest-size <number>",
        "CSR Key Request Size",
        safeParseInt
      )
      .option("--csr-keyrequest-reusekey", "CSR Key Request Reuse Key")
      .option("--csr-names <CSV>", "CSR Names", safeParseCSV)
      .option("--csr-serialnumber <string>", "CSR Serial Number")
      .option("--home <string>", "Home directory for the client")
      .option("--ca-name <string>", "CA Name")
      .option("--url <string>", "URL for the Fabric CA Server")
      .option("--enrollment-attrs <CSV>", "Enrollment Attributes", safeParseCSV)
      .option("--enrollment-profile <string>", "Enrollment Profile")
      .option("--enrollment-label <string>", "Enrollment Label")
      .option("--enrollment-type <string>", "Enrollment Type")
      .option("--id-affiliation <string>", "ID Affiliation")
      .option("--id-maxenrollments <number>", "ID Maximum Enrollments")
      .option("--id-name <string>", "ID Name")
      .option("--id-secret <string>", "ID Secret")
      .option("--id-type <string>", "ID Type")
      //TODO: This should be a list of csv strings but those strings might be csv strings need to find a way to handle that
      .option("--id-attrs <string>", "ID Attributes")
      .option("--mspdir <string>", "MSP Directory")
      .option("--my-host <string>", "My Host")
      .option("--tls-certfiles <CSV>", "TLS Certfile location", safeParseCSV)
      .option("--tls-client-certfile <string>", "TLS Client Certfile")
      .option("--tls-client-keyfile <string>", "TLS Client Keyfile")
      .option("--idemix-curve <string>", "IDMix Curve")
      .option(
        "--key-destination-dir <string>",
        "Copy Key to the server MSP Directory"
      )
      .option("--rename-key", "Rename Key in MSP Directory")

      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });

        this.log.info("Running fabric CA client enrollment command...");
        this.log.debug(`Options: ${JSON.stringify(options, null, 2)}`);

        clientEnrollment(
          this.log,
          options.command,
          {
            cn: options.csrCn,
            hosts: options.csrHosts,
            keyrequest: {
              algo: options.csrKeyrequestAlgo,
              size: options.csrKeyrequestSize,
              reusekey: options.csrKeyrequestReusekey,
            },
            serialnumber: options.csrSerialnumber,
            names: options.csrNames,
          },
          options.home,
          options.caName,
          options.url,
          {
            attrs: options.enrollmentAttrs,
            profile: options.enrollmentProfile,
            label: options.enrollmentLabel,
            type: options.enrollmentType,
          },
          {
            affiliation: options.idAffiliation,
            maxenrollments: options.idMaxenrollments,
            name: options.idName,
            secret: options.idSecret,
            type: options.idType,
            attrs: options.idAttrs,
          },
          options.idemixCurve,
          options.mspdir,
          options.myHost,
          {
            certfiles: options.tlsCertfiles,
            client: {
              certfile: options.tlsClientCertfile,
              keyfile: options.tlsClientKeyfile,
            },
          },
          options.keyDestinationDir,
          options.renameKey
        );

        this.log.info("Command completed successfully!");
      });
  }

  private configtxgen() {
    this.program
      .command("configtxgen")
      .description("Command to generate configuration transactions")
      .option("-d, --debug", "Enables debug mode")
      .option("--as-org <string>", "Organization")
      .option(
        "--channel-create-txbase-profile <string>",
        "Channel Create Tx Base Profile"
      )
      .option("--channel-id <string>", "Channel ID")
      .option("--config-path <string>", "Config Path")
      .option("--inspect-block <string>", "Inspect Block")
      .option("--inspect-channel-create-tx <string>", "Channel Create Tx")
      .option(
        "--output-anchor-peers-update <string>",
        "Inspect Anchor Peers Updated"
      )
      .option("--output-block <string>", "Output block")
      .option("--output-create-channel-tx <string>", "Output Channel Tx")
      .option("--print-org <string>", "Print Org")
      .option("--profile <string>", "Profile")
      .option("--configtxgen-version", "Configtxgen Version")
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });

        this.log.info("Running configtxgen command...");
        this.log.debug(`Options: ${JSON.stringify(options, null, 2)}`);

        configtxgen(
          options.asOrg,
          options.channelCreateTxbaseProfile,
          options.channelId,
          options.configPath,
          options.inspectBlock,
          options.inspectChannelCreateTx,
          options.outputAnchorPeersUpdate,
          options.outputBlock,
          options.outputCreateChannelTx,
          options.printOrg,
          options.profile,
          options.configtxgenVersion
        );

        this.log.info("Command completed successfully!");
      });
  }

  private nodeOu() {
    this.program
      .command("node-ou")
      .description("Command to manage node organizations")
      .option("-d, --debug", "Enables debug mode")
      .option("--enable", "Enable node organizational unit")
      .option("--path <string>", "Path to output directory", "cacerts")
      .option("--mspdir <string>", "mspdirlocation")
      .option("--cert <string>", "Cert file name")
      .action(async (options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });

        this.log.info("Running node-ou command...");
        this.log.debug(`Options: ${JSON.stringify(options, null, 2)}`);

        try {
          createNodeOU(
            options.enable,
            options.path,
            options.mspdir,
            options.cert
          );
        } catch (error) {
          this.log.error(`Error: ${(error as Error).message}`);
          process.exit(1);
        }

        this.log.info("Command completed successfully!");
      });
  }

  private bootOrderer() {
    this.program
      .command("boot-orderer")
      .description("Command to manage boot orderers")
      .option("-d, --debug", "Enables debug mode")
      .option("--listen-address <string>", "Listen Address")
      .option("--port <number>", "Port", safeParseInt)
      .option("--msp-dir <string>", "MSP Directory")
      .option("--msp-id <string>", "MSP ID")
      .option("--admin-listen-address <string>", "Admin Listen Address")
      .option("--consensus-snapdir <string>", "Consensus Snapshot Directory")
      .option(
        "--consensus-waldir <string>",
        "Consensus Write-Ahead Log Directory"
      )
      .option("--operations-address <string>", "Operations Address")
      .option("--config-path <string>", "Config Path")
      .option("--tls-enabled", "Enable TLS")
      .option(
        "--tls-rootcas <CSV>",
        "Root CA Certificate location",
        safeParseCSV
      )
      .option("--tls-cert <string>", "TLS Certificate")
      .option("--tls-key <string>", "TLS Key")
      .option("--tls-client-authrequired", "Enable TLS client authentication")
      .option(
        "--tls-client-rootcas <CSV>",
        "Client Root CA Certificate location",
        safeParseCSV
      )
      //TODO: Implement all functionality in this command
      .action((options) => {
        this.log.setConfig({
          level: options.debug ? LogLevel.debug : LogLevel.info,
        });
        this.log.info("Running boot-orderer command...");
        this.log.debug(`Options: ${JSON.stringify(options, null, 2)}`);

        bootOrderer(
          this.log,
          options.configPath,
          {
            WALDir: options.consensusWaldir,
            SnapDir: options.consensusSnapdir,
          },
          {},
          { ListenAddress: options.adminListenAddress },
          {
            Enabled: options.tlsEnabled,
            RootCAs: options.tlsRootcas,
            Certificate: options.tlsCert,
            PrivateKey: options.tlsKey,
            ClientAuthRequired: options.tlsClientAuthrequired,
            ClientRootCAs: options.tlsClientRootcas,
          },
          options.port,
          options.listenAddress,
          {},
          {},
          {},
          {},
          { LocalMSPDir: options.mspDir, LocalMSPID: options.mspId },
          {},
          {},
          { ListenAddress: options.operationsAddress },
          {},
          undefined,
          undefined,
          {},
          {}
        );

        this.log.info("Command completed successfully!");
      });
  }
}
