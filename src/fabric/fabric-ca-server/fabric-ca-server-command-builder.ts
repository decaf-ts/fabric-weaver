import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { FabricCAServerCommand } from "../constants/fabric-ca-server";
import {
  CAConfig,
  ServerTLSConfig,
} from "../interfaces/fabric/fabric-ca-server-config";
import { COMMA_SEPARATOR } from "../../core/constants/constants";

export class FabricCAServerCommandBuilder {
  private log: Logger;

  private binName: FabricBinaries = FabricBinaries.SERVER;
  private command: FabricCAServerCommand = FabricCAServerCommand.HELP;

  private args: Map<string, string | boolean | number | string[]> = new Map();

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricCAServerCommandBuilder);
    else this.log = logger.for(FabricCAServerCommandBuilder.name);
  }

  /**
   * @description Sets the command for the Fabric CA Server.
   * @summary Configures the primary action for the Fabric CA Server, such as starting the server or generating certificates.
   * @param {FabricCAServerCommand} [command] - The command to be executed by the Fabric CA Server.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCommand(command?: FabricCAServerCommand): this {
    if (command !== undefined) {
      this.log.debug(`Setting command: ${command}`);
      this.command = command;
    }
    return this;
  }

  /**
   * @description Sets the port for the Fabric CA Server.
   * @summary Configures the network port on which the Fabric CA Server will listen for incoming connections.
   * @param {number} [port] - The port number for the Fabric CA Server to listen on.
   * @return {this} The current instance of the builder for method chaining.
   */
  setPort(port?: number): this {
    if (port !== undefined) {
      this.log.debug(`Setting port: ${port}`);
      this.args.set("port", port);
    }
    return this;
  }

  /**
   * @description Enables or disables debug mode for the Fabric CA Server.
   * @summary Configures whether the Fabric CA Server should run in debug mode, providing more detailed logging and output.
   * @param {boolean} [enable] - Whether to enable debug mode.
   * @return {this} The current instance of the builder for method chaining.
   */
  enableDebug(enable?: boolean): this {
    if (enable !== undefined) {
      this.log.debug(`Setting debug: ${enable}`);
      this.args.set("debug", enable);
    }
    return this;
  }

  setServerTLS(tlsConfig?: ServerTLSConfig): this {
    if (!tlsConfig) return this;

    if (tlsConfig.enabled !== undefined) {
      this.log.debug("Setting TLS enabled");
      this.args.set("tls.enabled", tlsConfig.enabled);
    }

    if (tlsConfig.certfile !== undefined) {
      this.log.debug(`Setting TLS cert file: ${tlsConfig.certfile}`);
      this.args.set("tls.certfile", tlsConfig.certfile);
    }

    if (tlsConfig.keyfile !== undefined) {
      this.log.debug(`Setting TLS key file: ${tlsConfig.keyfile}`);
      this.args.set("tls.keyfile", tlsConfig.keyfile);
    }

    if (tlsConfig.clientauth === undefined) return this;

    if (tlsConfig.clientauth.certfiles !== undefined) {
      this.log.debug(
        `Setting TLS client certfiles: ${tlsConfig.clientauth.certfiles}`
      );
      this.args.set(
        "tls.clientauth.certfiles",
        tlsConfig.clientauth.certfiles.join(COMMA_SEPARATOR)
      );
    }

    if (tlsConfig.clientauth.type !== undefined) {
      this.log.debug(
        `Setting TLS client auth type: ${tlsConfig.clientauth.type}`
      );
      this.args.set("tls.clientauth.type", tlsConfig.clientauth.type);
    }

    return this;
  }

  setCA(config: CAConfig): this {
    if (!config) return this;

    if (config.name !== undefined) {
      this.log.debug(`Setting CA name: ${config.name}`);
      this.args.set("ca.name", config.name);
    }

    if (config.keyfile !== undefined) {
      this.log.debug(`Setting CA key file: ${config.keyfile}`);
      this.args.set("ca.keyfile", config.keyfile);
    }

    if (config.certfile !== undefined) {
      this.log.debug(`Setting CA cert file: ${config.certfile}`);
      this.args.set("ca.certfile", config.certfile);
    }

    if (config.chainfile !== undefined) {
      this.log.debug(`Setting CA chain file: ${config.chainfile}`);
      this.args.set("ca.chainfile", config.chainfile);
    }

    if (config.reenrollIgnoreCertExpiry !== undefined) {
      this.log.debug(
        `Setting reenrollIgnoreCertExpiry: ${config.reenrollIgnoreCertExpiry}`
      );
      this.args.set(
        "ca.reenrollignorecertexpiry",
        config.reenrollIgnoreCertExpiry
      );
    }

    return this;
  }
}

// Flags:
//       --address string                            Listening address of fabric-ca-server (default "0.0.0.0")
//   -b, --boot string                               The user:pass for bootstrap admin which is required to build default config file

//       --cacount int                               Number of non-default CA instances
//       --cafiles strings                           A list of comma-separated CA configuration files
//       --cfg.affiliations.allowremove              Enables removal of affiliations dynamically
//       --cfg.identities.allowremove                Enables removal of identities dynamically
//       --cfg.identities.passwordattempts int       Number of incorrect password attempts allowed (default 10)
//       --cors.enabled                              Enable CORS for the fabric-ca-server
//       --cors.origins strings                      Comma-separated list of Access-Control-Allow-Origin domains
//       --crl.expiry duration                       Expiration for the CRL generated by the gencrl request (default 24h0m0s)
//       --crlsizelimit int                          Size limit of an acceptable CRL in bytes (default 512000)
//       --csr.cn string                             The common name field of the certificate signing request to a parent fabric-ca-server
//       --csr.hosts strings                         A list of comma-separated host names in a certificate signing request to a parent fabric-ca-server
//       --csr.keyrequest.algo string                Specify key algorithm
//       --csr.keyrequest.reusekey                   Reuse existing key during reenrollment
//       --csr.keyrequest.size int                   Specify key size
//       --csr.serialnumber string                   The serial number in a certificate signing request to a parent fabric-ca-server
//       --db.datasource string                      Data source which is database specific (default "fabric-ca-server.db")
//       --db.tls.certfiles strings                  A list of comma-separated PEM-encoded trusted certificate files (e.g. root1.pem,root2.pem)
//       --db.tls.client.certfile string             PEM-encoded certificate file when mutual authenticate is enabled
//       --db.tls.client.keyfile string              PEM-encoded key file when mutual authentication is enabled
//       --db.type string                            Type of database; one of: sqlite3, postgres, mysql (default "sqlite3")
//   -h, --help                                      help for fabric-ca-server
//   -H, --home string                               Server's home directory (default "/etc/hyperledger/fabric-ca")
//       --idemix.curve string                       Name of the curve among {'amcl.Fp256bn', 'gurvy.Bn254', 'amcl.Fp256Miraclbn'}, defaults to 'amcl.Fp256bn' (default "amcl.Fp256bn")
//       --idemix.nonceexpiration string             Duration after which a nonce expires (default "15s")
//       --idemix.noncesweepinterval string          Interval at which expired nonces are deleted (default "15m")
//       --idemix.rhpoolsize int                     Specifies revocation handle pool size (default 100)
//       --intermediate.enrollment.label string      Label to use in HSM operations
//       --intermediate.enrollment.profile string    Name of the signing profile to use in issuing the certificate
//       --intermediate.enrollment.type string       The type of enrollment request: 'x509' or 'idemix' (default "x509")
//       --intermediate.parentserver.caname string   Name of the CA to connect to on fabric-ca-server
//   -u, --intermediate.parentserver.url string      URL of the parent fabric-ca-server (e.g. http://<username>:<password>@<address>:<port)
//       --intermediate.tls.certfiles strings        A list of comma-separated PEM-encoded trusted certificate files (e.g. root1.pem,root2.pem)
//       --intermediate.tls.client.certfile string   PEM-encoded certificate file when mutual authenticate is enabled
//       --intermediate.tls.client.keyfile string    PEM-encoded key file when mutual authentication is enabled
//       --ldap.attribute.names strings              The names of LDAP attributes to request on an LDAP search
//       --ldap.enabled                              Enable the LDAP client for authentication and attributes
//       --ldap.groupfilter string                   The LDAP group filter for a single affiliation group (default "(memberUid=%s)")
//       --ldap.tls.certfiles strings                A list of comma-separated PEM-encoded trusted certificate files (e.g. root1.pem,root2.pem)
//       --ldap.tls.client.certfile string           PEM-encoded certificate file when mutual authenticate is enabled
//       --ldap.tls.client.keyfile string            PEM-encoded key file when mutual authentication is enabled
//       --ldap.url string                           LDAP client URL of form ldap://adminDN:adminPassword@host[:port]/base
//       --ldap.userfilter string                    The LDAP user filter to use when searching for users (default "(uid=%s)")
//       --loglevel string                           Set logging level (info, warning, debug, error, fatal, critical)
//       --registry.maxenrollments int               Maximum number of enrollments; valid if LDAP not enabled (default -1)
