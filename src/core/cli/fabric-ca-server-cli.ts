import { LogLevel } from "@decaf-ts/logging";
import { BaseCLI } from "./base-cli";
import { issueCAServerConfig } from "../scripts/ca-server";
import { safeParseCSV, safeParseInt } from "../../utils/parsers";
import { COLON_SEPARATOR } from "../constants/constants";

export class FabricCAServerCLI extends BaseCLI {
  constructor() {
    super("weaver-fabric-ca-server", "CLI for Fabric CA Server functionality");

    this.setup();
  }

  private setup() {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    ).filter(
      (name) =>
        name !== "constructor" &&
        typeof this[name as keyof FabricCAServerCLI] === "function" &&
        name !== "setup"
    );

    for (const methodName of methodNames) {
      try {
        this[methodName as keyof FabricCAServerCLI]();
      } catch (error) {
        console.error(`Error calling method ${methodName}:`, error);
      }
    }
  }

  private issueFabricCAServerCommand() {
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
          issueCAServerConfig(
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
}
