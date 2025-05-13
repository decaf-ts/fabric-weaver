import { Logging } from "@decaf-ts/logging";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import { FabricBinaries, FabricLogLevel } from "../general/constants";
import {
  FabricCAServerCommand,
  FabricCAServerCurveName,
  FabricCAServerDBType,
  FabricCAServerEnrollmentType,
} from "./constants";
import { FabricCAServerConfig } from "./fabric-ca-server-config";
import path from "path";
import fs from "fs";
import { runCommand } from "../../utils/child-process";

/**
 * @class FabricCAServerCommandBuilder
 * @description A builder class for constructing Fabric CA Server commands and configurations.
 * @summary This class provides a fluent interface for building Fabric CA Server commands and configurations.
 * It allows for easy setup of various CA server parameters, including basic configuration, CA configuration,
 * TLS settings, LDAP integration, database configuration, CSR settings, intermediate CA setup, registry configuration,
 * idemix settings, and CORS configuration.
 *
 * @param {FabricCAServerConfig} config - The initial configuration object for the Fabric CA Server.
 *
 * @example
 * const builder = new FabricCAServerCommandBuilder();
 * const command = builder
 *   .setCommand(FabricCAServerCommand.START)
 *   .setPort(7054)
 *   .enableDebug(true)
 *   .setCAName("org1-ca")
 *   .enableTLS(true)
 *   .build();
 *
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Builder as FabricCAServerCommandBuilder
 *   participant Config as FabricCAServerConfig
 *   Client->>Builder: new FabricCAServerCommandBuilder()
 *   Builder->>Config: Initialize config
 *   Client->>Builder: setCommand(START)
 *   Client->>Builder: setPort(7054)
 *   Client->>Builder: enableDebug(true)
 *   Client->>Builder: setCAName("org1-ca")
 *   Client->>Builder: enableTLS(true)
 *   Client->>Builder: build()
 *   Builder-->>Client: Fabric CA Server command string
 */
export class FabricCAServerCommandBuilder {
  private log = Logging.for(FabricCAServerCommandBuilder);

  private binName: FabricBinaries = FabricBinaries.SERVER;

  private args: Map<string, string | boolean | number | string[]> = new Map();
  private command: FabricCAServerCommand = FabricCAServerCommand.HELP;

  private config: FabricCAServerConfig = readFileYaml(
    path.join(__dirname, "../../../config/fabric-ca-server-config.yaml")
  ) as FabricCAServerConfig;

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

  // Basic configuration ---------------------------------------------------------------------

  /**
   * @description Sets the address for the Fabric CA Server.
   * @summary Configures the network address on which the Fabric CA Server will listen for incoming connections.
   * @param {string} [address] - The network address for the Fabric CA Server to listen on.
   * @return {this} The current instance of the builder for method chaining.
   */
  setAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting address: ${address}`);
      this.args.set("address", address);
      // Note: Not present in the FabricCAServerConfig interface.
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
      this.config.port = port;
    }
    return this;
  }

  /**
   * @description Sets the home directory for the Fabric CA Server.
   * @summary Configures the home directory where the Fabric CA Server will store its files and configurations.
   * @param {string} [home] - The path to the home directory for the Fabric CA Server.
   * @return {this} The current instance of the builder for method chaining.
   */
  setHomeDirectory(home?: string): this {
    if (home !== undefined) {
      this.log.debug(`Setting home directory: ${home}`);
      this.args.set("home", home);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  /**
   * @description Sets the log level for the Fabric CA Server.
   * @summary Configures the verbosity of logging for the Fabric CA Server.
   * @param {FabricLogLevel} [level] - The log level to set for the Fabric CA Server.
   * @return {this} The current instance of the builder for method chaining.
   */
  setLogLevel(level?: FabricLogLevel): this {
    if (level !== undefined) {
      this.args.set("loglevel", level);
      // Note: Not present in the FabricCAServerConfig interface.
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
      this.config.debug = enable;
    }
    return this;
  }

  /**
   * @description Sets the bootstrap admin user for the Fabric CA Server.
   * @summary Configures the initial admin user with full privileges for the Fabric CA Server.
   * @param {string} [bootUser] - The bootstrap admin user in the format "username:password".
   * @return {this} The current instance of the builder for method chaining.
   */
  setBootstrapAdmin(bootUser?: string): this {
    if (bootUser !== undefined) {
      const [user, password] = bootUser.split(":");
      this.log.debug(`Setting bootstrap admin: ${user}:${password}`);
      this.args.set("boot", bootUser);

      this.config.registry!.identities = [
        {
          name: user,
          pass: password,
          type: "client",
          affiliation: "",
          attrs: {
            "hf.Registrar.Roles": "*",
            "hf.Registrar.DelegateRoles": "*",
            "hf.Revoker": true,
            "hf.IntermediateCA": true,
            "hf.GenCRL": true,
            "hf.Registrar.Attributes": "*",
            "hf.AffiliationMgr": true,
          },
        },
      ];
    }
    return this;
  }

  /**
   * @description Sets whether affiliations can be removed in the Fabric CA Server.
   * @summary Configures the ability to remove affiliations from the Fabric CA Server.
   * @param {boolean} [allow] - Whether to allow removal of affiliations.
   * @return {this} The current instance of the builder for method chaining.
   */
  setAffiliationsAllowRemove(allow?: boolean): this {
    if (allow !== undefined) {
      this.log.debug(`Setting affiliations allow remove: ${allow}`);
      this.args.set("cfg.affiliations.allowremove", allow);
      // this.config.cfg.affiliations = this.config.cfg.affiliations || {};
      // this.config.cfg.affiliations.allowremove = allow;
    }
    return this;
  }

  /**
   * @description Sets whether identities can be removed in the Fabric CA Server.
   * @summary Configures the ability to remove identities from the Fabric CA Server.
   * @param {boolean} [allow] - Whether to allow removal of identities.
   * @return {this} The current instance of the builder for method chaining.
   */
  setIdentitiesAllowRemove(allow?: boolean): this {
    if (allow !== undefined) {
      this.log.debug(`Setting identities allow remove: ${allow}`);
      this.args.set("cfg.identities.allowremove", allow);
      // this.config.cfg.identities = this.config.cfg.identities || {};
      // this.config.cfg.identities.allowremove = allow;
    }
    return this;
  }

  /**
   * @description Sets the maximum number of password attempts for identities in the Fabric CA Server.
   * @summary Configures the maximum number of times an identity can attempt to authenticate before being locked out.
   * @param {number} [attempts] - The maximum number of password attempts.
   * @return {this} The current instance of the builder for method chaining.
   */
  setIdentitiesPasswordAttempts(attempts?: number): this {
    if (attempts !== undefined) {
      this.log.debug(`Setting identities password attempts: ${attempts}`);
      this.args.set("cfg.identities.passwordattempts", attempts);
      this.config.cfg.identities = this.config.cfg.identities || {};
      this.config.cfg.identities.passwordattempts = attempts;
    }
    return this;
  }

  /**
   * @description Sets the expiry period for the Certificate Revocation List (CRL).
   * @summary Configures how long the CRL should be considered valid before a new one needs to be generated.
   * @param {string} [expiry] - The expiry period for the CRL (e.g., "24h").
   * @return {this} The current instance of the builder for method chaining.
   */
  setCRLExpiry(expiry?: string): this {
    if (expiry !== undefined) {
      this.log.debug(`Setting CRL expiry: ${expiry}`);
      this.args.set("crl.expiry", expiry);
      this.config.crl = this.config.crl || {};
      this.config.crl.expiry = expiry;
    }
    return this;
  }

  /**
   * @description Sets the size limit for the Certificate Revocation List (CRL).
   * @summary Configures the maximum number of revoked certificates that can be included in a single CRL.
   * @param {number} [limit] - The maximum number of revoked certificates in the CRL.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCRLSizeLimit(limit?: number): this {
    if (limit !== undefined) {
      this.log.debug(`Setting CRL size limit: ${limit}`);
      this.args.set("crlsizelimit", limit);
      this.config.crlsizelimit = limit;
    }
    return this;
  }

  /**
   * @description Enables or disables the help flag for the Fabric CA Server command.
   * @summary Configures whether to display help information when running the Fabric CA Server command.
   * @param {boolean} [enable] - Whether to enable the help flag.
   * @return {this} The current instance of the builder for method chaining.
   */
  enableHelp(enable?: boolean): this {
    if (enable !== undefined) {
      this.log.debug(`Setting help flag: ${enable}`);
      if (enable) {
        this.args.set("help", true);
      } else {
        this.args.delete("help");
      }
    }
    return this;
  }

  // CA configuration ------------------------------------------------------------

  /**
   * @description Sets the CA certificate file for the Fabric CA Server.
   * @summary Configures the path to the CA certificate file used by the Fabric CA Server.
   * @param {string} [certfile] - The path to the CA certificate file.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCACertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.args.set("ca.certfile", certfile);
      this.config.ca!.certfile = certfile;
    }
    return this;
  }

  /**
   * @description Sets the CA key file for the Fabric CA Server.
   * @summary Configures the path to the CA private key file used by the Fabric CA Server.
   * @param {string} [keyfile] - The path to the CA private key file.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCAKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.args.set("ca.keyfile", keyfile);
      this.config.ca!.keyfile = keyfile;
    }
    return this;
  }

  /**
   * @description Sets the name of the CA for the Fabric CA Server.
   * @summary Configures the name identifier for the Certificate Authority.
   * @param {string} [name] - The name of the CA.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCAName(name?: string): this {
    if (name !== undefined) {
      this.log.debug(`Setting CA name: ${name}`);
      this.args.set("ca.name", name);
      this.config.ca!.name = name;
    }
    return this;
  }

  /**
   * @description Sets the CA chain file for the Fabric CA Server.
   * @summary Configures the path to the CA chain file used by the Fabric CA Server.
   * @param {string} [chainfile] - The path to the CA chain file.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCAChainFile(chainfile?: string): this {
    if (chainfile !== undefined) {
      this.args.set("ca.chainfile", chainfile);
      this.config.ca!.chainfile = chainfile;
    }
    return this;
  }

  /**
   * @description Sets whether to ignore certificate expiry during re-enrollment.
   * @summary Configures the Fabric CA Server to allow re-enrollment of identities with expired certificates.
   * @param {boolean} [ignore] - Whether to ignore certificate expiry during re-enrollment.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCAReenrollIgnoreCertExpiry(ignore?: boolean): this {
    if (ignore !== undefined) {
      this.args.set("ca.reenrollignorecertexpiry", ignore);
      this.config.ca!.reenrollIgnoreCertExpiry = ignore;
    }
    return this;
  }

  /**
   * @description Sets the number of CAs to run on the Fabric CA Server.
   * @summary Configures the Fabric CA Server to run multiple CA instances.
   * @param {number} [count] - The number of CA instances to run.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCACount(count?: number): this {
    if (count !== undefined) {
      this.log.debug(`Setting CA count: ${count}`);
      this.args.set("cacount", count);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  /**
   * @description Sets the configuration files for multiple CAs.
   * @summary Configures the Fabric CA Server with multiple CA configurations using separate files.
   * @param {string[]} [files] - An array of paths to CA configuration files.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCAFiles(files?: string[]): this {
    if (files !== undefined && files.length > 0) {
      this.log.debug(`Setting CA configuration files: ${files.join(", ")}`);
      this.args.set("cafiles", files);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  /**
   * @description Sets the maximum path length for CA certificates.
   * @summary Configures the maximum number of non-self-issued intermediate certificates that may follow this certificate in a valid certification path.
   * @param {number} [maxpathlength] - The maximum path length for CA certificates.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCAProfile(maxpathlength?: number): this {
    if (maxpathlength !== undefined) {
      this.log.debug(`Setting CA max path length: ${maxpathlength}`);
      if (
        this.config.signing &&
        this.config.signing.profiles &&
        this.config.signing.profiles.ca &&
        this.config.signing.profiles.ca.caconstraint
      )
        this.config.signing.profiles.ca.caconstraint.maxpathlen = maxpathlength;
    }
    return this;
  }

  /**
   * @description Sets the listen address for operations in the Fabric CA Server.
   * @summary Configures the network address on which the Fabric CA Server will listen for operations-related requests.
   * @param {string} [address] - The listen address for operations.
   * @return {this} The current instance of the builder for method chaining.
   */
  setOperationsListenAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting operations listen address: ${address}`);
      this.config.operations!.listenAddress = address;
    }
    return this;
  }

  /**
   * @description Sets the listen address for metrics in the Fabric CA Server.
   * @summary Configures the network address on which the Fabric CA Server will expose metrics.
   * This method allows you to specify where the Fabric CA Server should listen for metrics-related requests.
   * @param {string} [address] - The listen address for metrics. If provided, it should be a valid network address.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setMetricsListenAddress('localhost:8080');
   */
  setMetricsListenAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting metrics listen address: ${address}`);
      this.config.metrics!.statsd!.address = address;
    }
    return this;
  }

  /**
   * @description Removes unused profiles from the Fabric CA Server configuration.
   * @summary This method allows you to remove the TLS and/or CA profiles from the configuration if they are not needed.
   * Removing unused profiles can help streamline the configuration and potentially improve performance.
   * @param {boolean} [removeTLSProfile=false] - Whether to remove the TLS profile.
   * @param {boolean} [removeCAProfile=false] - Whether to remove the CA profile.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.removeUnusedProfiles(true, false); // Removes TLS profile, keeps CA profile
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as FabricCAServerConfig
   *   Client->>Builder: removeUnusedProfiles(true, false)
   *   Builder->>Builder: Check removeTLSProfile
   *   alt removeTLSProfile is true
   *     Builder->>Config: Remove TLS profile
   *   end
   *   Builder->>Builder: Check removeCAProfile
   *   alt removeCAProfile is true
   *     Builder->>Config: Remove CA profile
   *   end
   *   Builder-->>Client: Return this
   */
  removeUnusedProfiles(
    removeTLSProfile: boolean = false,
    removeCAProfile: boolean = false
  ): this {
    if (removeTLSProfile) {
      this.log.debug("Removing TLS profile");
      delete this.config.signing?.profiles?.tls;
    }
    if (removeCAProfile) {
      this.log.debug("Removing CA profile");
      delete this.config.signing?.profiles?.ca;
    }
    return this;
  }

  // TLS configuration -----------------------------------------------------------------

  /**
   * @description Enables or disables TLS for the Fabric CA Server.
   * @summary Configures whether the Fabric CA Server should use TLS (Transport Layer Security) for secure communication.
   * @param {boolean} [enabled] - Whether to enable TLS. If true, TLS will be enabled; if false, it will be disabled.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.enableTLS(true);
   */
  enableTLS(enabled?: boolean): this {
    if (enabled !== undefined) {
      this.log.debug(`Setting TLS enabled: ${enabled}`);
      this.args.set("tls.enabled", enabled);
      this.config.tls.enabled = enabled;
    }
    return this;
  }

  /**
   * @description Sets the TLS certificate file for the Fabric CA Server.
   * @summary Configures the path to the TLS certificate file used by the Fabric CA Server for secure communication.
   * @param {string} [certfile] - The path to the TLS certificate file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setTLSCertFile('/path/to/tls-cert.pem');
   */
  setTLSCertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.log.debug(`Setting TLS cert file: ${certfile}`);
      this.args.set("tls.certfile", certfile);
      this.config.tls.certfile = certfile;
    }
    return this;
  }

  /**
   * @description Sets the TLS key file for the Fabric CA Server.
   * @summary Configures the path to the TLS private key file used by the Fabric CA Server for secure communication.
   * @param {string} [keyfile] - The path to the TLS private key file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setTLSKeyFile('/path/to/tls-key.pem');
   */
  setTLSKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.log.debug(`Setting TLS key file: ${keyfile}`);
      this.args.set("tls.keyfile", keyfile);
      this.config.tls.keyfile = keyfile;
    }
    return this;
  }

  /**
   * @description Sets the TLS client authentication type for the Fabric CA Server.
   * @summary Configures the type of client authentication to be used with TLS.
   * @param {string} [type] - The TLS client authentication type (e.g., 'NoClientCert', 'RequestClientCert', 'RequireAnyClientCert', 'VerifyClientCertIfGiven', 'RequireAndVerifyClientCert').
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setTLSClientAuthType('RequireAndVerifyClientCert');
   */
  setTLSClientAuthType(type?: string): this {
    if (type !== undefined) {
      this.log.debug(`Setting TLS client auth type: ${type}`);
      this.args.set("tls.clientauth.type", type);
      this.config.tls.clientauth.type = type;
    }
    return this;
  }

  /**
   * @description Sets the TLS client authentication certificate files for the Fabric CA Server.
   * @summary Configures the paths to the client authentication certificate files used for TLS.
   * @param {string[]} [certfiles] - An array of paths to the client authentication certificate files.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setTLSClientAuthCertFiles(['/path/to/client-cert1.pem', '/path/to/client-cert2.pem']);
   */
  setTLSClientAuthCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined) {
      this.log.debug(`Setting TLS client auth cert files: ${certfiles}`);
      this.args.set("tls.clientauth.certfiles", certfiles);
      this.config.tls.clientauth.certfiles = certfiles;
    }
    return this;
  }

  // LDAP configuration ----------------------------------------------------------------------

  /**
   * @description Enables or disables LDAP authentication for the Fabric CA Server.
   * @summary Configures whether the Fabric CA Server should use LDAP for authentication.
   * @param {boolean} [enabled] - Whether to enable LDAP authentication. If true, LDAP will be enabled; if false, it will be disabled.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.enableLDAP(true);
   */
  enableLDAP(enabled?: boolean): this {
    if (enabled !== undefined) {
      this.log.debug(`Setting LDAP enabled: ${enabled}`);
      this.args.set("ldap.enabled", enabled);
      this.config.ldap.enabled = enabled;
    }
    return this;
  }

  /**
   * @description Sets the LDAP URL for the Fabric CA Server.
   * @summary Configures the URL of the LDAP server to be used for authentication.
   * @param {string} [url] - The URL of the LDAP server.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPURL('ldap://ldap.example.com:389');
   */
  setLDAPURL(url?: string): this {
    if (url !== undefined) {
      this.log.debug(`Setting LDAP URL: ${url}`);
      this.args.set("ldap.url", url);
      this.config.ldap.url = url;
    }
    return this;
  }

  /**
   * @description Sets the LDAP user filter for the Fabric CA Server.
   * @summary Configures the LDAP filter used to search for users.
   * @param {string} [filter] - The LDAP user filter string.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPUserFilter('(uid=%s)');
   */
  setLDAPUserFilter(filter?: string): this {
    if (filter !== undefined) {
      this.log.debug(`Setting LDAP user filter: ${filter}`);
      this.args.set("ldap.userfilter", filter);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  /**
   * @description Sets the LDAP group filter for the Fabric CA Server.
   * @summary Configures the LDAP filter used to search for groups.
   * @param {string} [filter] - The LDAP group filter string.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPGroupFilter('(memberUid=%s)');
   */
  setLDAPGroupFilter(filter?: string): this {
    if (filter !== undefined) {
      this.log.debug(`Setting LDAP group filter: ${filter}`);
      this.args.set("ldap.groupfilter", filter);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  /**
   * @description Sets the LDAP attribute names for the Fabric CA Server.
   * @summary Configures the LDAP attribute names used for mapping LDAP attributes to Fabric CA attributes.
   * @param {string[]} [names] - An array of LDAP attribute names.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPAttributeNames(['uid', 'member']);
   */
  setLDAPAttributeNames(names?: string[]): this {
    if (names !== undefined) {
      this.log.debug(`Setting LDAP attribute names: ${names}`);
      this.args.set("ldap.attribute.names", names);
      this.config.ldap.attribute.names = names;
    }
    return this;
  }

  /**
   * @description Sets the LDAP TLS certificate files for the Fabric CA Server.
   * @summary Configures the paths to the TLS certificate files used for secure communication with the LDAP server.
   * @param {string[]} [certfiles] - An array of paths to the LDAP TLS certificate files.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPTLSCertFiles(['/path/to/ldap-cert1.pem', '/path/to/ldap-cert2.pem']);
   */
  setLDAPTLSCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined && certfiles.length > 0) {
      this.log.debug(`Setting LDAP TLS cert files: ${certfiles.join(", ")}`);
      this.args.set("ldap.tls.certfiles", certfiles);
      this.config.ldap.tls.certfiles = certfiles;
    }
    return this;
  }

  /**
   * @description Sets the LDAP TLS client certificate file for the Fabric CA Server.
   * @summary Configures the path to the TLS client certificate file used for secure communication with the LDAP server.
   * @param {string} [certfile] - The path to the LDAP TLS client certificate file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPTLSClientCertFile('/path/to/ldap-client-cert.pem');
   */
  setLDAPTLSClientCertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.log.debug(`Setting LDAP TLS client cert file: ${certfile}`);
      this.args.set("ldap.tls.client.certfile", certfile);
      this.config.ldap.tls.client.certfile = certfile;
    }
    return this;
  }

  /**
   * @description Sets the LDAP TLS client key file for the Fabric CA Server.
   * @summary Configures the path to the TLS client key file used for secure communication with the LDAP server.
   * @param {string} [keyfile] - The path to the LDAP TLS client key file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setLDAPTLSClientKeyFile('/path/to/ldap-client-key.pem');
   */
  setLDAPTLSClientKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.log.debug(`Setting LDAP TLS client key file: ${keyfile}`);
      this.args.set("ldap.tls.client.keyfile", keyfile);
      this.config.ldap.tls.client.keyfile = keyfile;
    }
    return this;
  }

  // Database configuration ---------------------------------------------------------------------

  /**
   * @description Sets the database type for the Fabric CA Server.
   * @summary Configures the type of database to be used by the Fabric CA Server for storing data.
   * @param {FabricCAServerDBType} [type] - The type of database to use.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setDBType('postgres');
   */
  setDBType(type?: FabricCAServerDBType): this {
    if (type !== undefined) {
      this.log.debug(`Setting DB type: ${type}`);
      this.args.set("db.type", type);
      this.config.db.type = type;
    }
    return this;
  }

  /**
   * @description Sets the database data source for the Fabric CA Server.
   * @summary Configures the data source (connection string) for the database used by the Fabric CA Server.
   * @param {string} [datasource] - The database data source or connection string.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setDBDataSource('host=localhost port=5432 user=myuser password=mypassword dbname=fabricca');
   */
  setDBDataSource(datasource?: string): this {
    if (datasource !== undefined) {
      this.log.debug(`Setting DB data source: ${datasource}`);
      this.args.set("db.datasource", datasource);
      this.config.db.datasource = datasource;
    }
    return this;
  }

  /**
   * @description Sets the database TLS certificate files for the Fabric CA Server.
   * @summary Configures the paths to the TLS certificate files used for secure communication with the database.
   * @param {string[]} [certfiles] - An array of paths to the database TLS certificate files.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setDBTLSCertFiles(['/path/to/db-cert1.pem', '/path/to/db-cert2.pem']);
   */
  setDBTLSCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined && certfiles.length > 0) {
      this.log.debug(`Setting DB TLS cert files: ${certfiles.join(", ")}`);
      this.args.set("db.tls.certfiles", certfiles);
      this.config.db.tls = this.config.db.tls || {};
      this.config.db.tls.certfiles = certfiles;
    }
    return this;
  }

  /**
   * @description Sets the database TLS client certificate file for the Fabric CA Server.
   * @summary Configures the path to the TLS client certificate file used for secure communication with the database.
   * @param {string} [certfile] - The path to the database TLS client certificate file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setDBTLSClientCertFile('/path/to/db-client-cert.pem');
   */
  setDBTLSClientCertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.log.debug(`Setting DB TLS client cert file: ${certfile}`);
      this.args.set("db.tls.client.certfile", certfile);
      this.config.db.tls = this.config.db.tls || {};
      this.config.db.tls.client = this.config.db.tls.client || {};
      this.config.db.tls.client.certfile = certfile;
    }
    return this;
  }

  /**
   * @description Sets the database TLS client key file for the Fabric CA Server.
   * @summary Configures the path to the TLS client key file used for secure communication with the database.
   * @param {string} [keyfile] - The path to the database TLS client key file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setDBTLSClientKeyFile('/path/to/db-client-key.pem');
   */
  setDBTLSClientKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.log.debug(`Setting DB TLS client key file: ${keyfile}`);
      this.args.set("db.tls.client.keyfile", keyfile);
      this.config.db.tls = this.config.db.tls || {};
      this.config.db.tls.client = this.config.db.tls.client || {};
      this.config.db.tls.client.keyfile = keyfile;
    }
    return this;
  }

  // CSR configuration -------------------------------------------------------------------

  /**
   * @description Sets the CSR (Certificate Signing Request) common name for the Fabric CA Server.
   * @summary Configures the common name to be used in the CSR generated by the Fabric CA Server.
   * @param {string} [cn] - The common name to be used in the CSR.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCSRCommonName('fabric-ca-server.example.com');
   */
  setCSRCommonName(cn?: string): this {
    if (cn !== undefined) {
      this.log.debug(`Setting CSR common name: ${cn}`);
      this.args.set("csr.cn", cn);
      this.config.csr.cn = cn;
    }
    return this;
  }

  /**
   * @description Sets the CSR (Certificate Signing Request) hosts for the Fabric CA Server.
   * @summary Configures the list of hostnames to be included in the CSR generated by the Fabric CA Server.
   * @param {string[]} [hosts] - An array of hostnames to be included in the CSR.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCSRHosts(['localhost', 'fabric-ca-server.example.com']);
   */
  setCSRHosts(hosts?: string[]): this {
    if (hosts !== undefined) {
      this.log.debug(`Setting CSR hosts: ${hosts}`);
      this.args.set("csr.hosts", hosts);
      this.config.csr.hosts = hosts;
    }
    return this;
  }

  /**
   * @description Sets the CSR (Certificate Signing Request) key request algorithm for the Fabric CA Server.
   * @summary Configures the algorithm to be used for key generation in the CSR.
   * @param {string} [algo] - The key request algorithm (e.g., 'ecdsa', 'rsa').
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCSRKeyRequestAlgo('ecdsa');
   */
  setCSRKeyRequestAlgo(algo?: string): this {
    if (algo !== undefined) {
      this.log.debug(`Setting CSR key request algorithm: ${algo}`);
      this.args.set("csr.keyrequest.algo", algo);
      this.config.csr.keyrequest = this.config.csr.keyrequest || {};
      this.config.csr.keyrequest.algo = algo;
    }
    return this;
  }

  /**
   * @description Sets whether to reuse the key in CSR (Certificate Signing Request) for the Fabric CA Server.
   * @summary Configures whether the Fabric CA Server should reuse an existing key when generating a new CSR.
   * @param {boolean} [reuse] - Whether to reuse the key in CSR.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCSRKeyRequestReuseKey(true);
   */
  setCSRKeyRequestReuseKey(reuse?: boolean): this {
    if (reuse !== undefined) {
      this.log.debug(`Setting CSR key request reuse key: ${reuse}`);
      this.args.set("csr.keyrequest.reusekey", reuse);
      // this.config.csr.keyrequest = this.config.csr.keyrequest || {};
      // this.config.csr.keyrequest.reusekey = reuse;
    }
    return this;
  }

  /**
   * @description Sets the CSR (Certificate Signing Request) key request size for the Fabric CA Server.
   * @summary Configures the key size to be used when generating a new key for the CSR.
   * @param {number} [size] - The key size in bits.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCSRKeyRequestSize(2048);
   */
  setCSRKeyRequestSize(size?: number): this {
    if (size !== undefined) {
      this.log.debug(`Setting CSR key request size: ${size}`);
      this.args.set("csr.keyrequest.size", size);
      this.config.csr.keyrequest = this.config.csr.keyrequest || {};
      this.config.csr.keyrequest.size = size;
    }
    return this;
  }

  /**
   * @description Sets the CSR (Certificate Signing Request) serial number for the Fabric CA Server.
   * @summary Configures the serial number to be used in the CSR generated by the Fabric CA Server.
   * @param {string} [serialNumber] - The serial number to be used in the CSR.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCSRSerialNumber('12345');
   */
  setCSRSerialNumber(serialNumber?: string): this {
    if (serialNumber !== undefined) {
      this.log.debug(`Setting CSR serial number: ${serialNumber}`);
      this.args.set("csr.serialnumber", serialNumber);
      // this.config.csr.serialnumber = serialNumber;
    }
    return this;
  }

  // Intermediate CA configuration ------------------------------------------------

  /**
   * @description Sets the intermediate parent server URL for the Fabric CA Server.
   * @summary Configures the URL of the parent CA server for an intermediate CA. This URL is used by the intermediate CA to communicate with its parent CA during enrollment and other operations.
   * @param {string} [url] - The URL of the parent CA server.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateParentServerURL('https://parent-ca.example.com:7054');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateParentServerURL('https://parent-ca.example.com:7054')
   *   Builder->>Builder: Check if URL is defined
   *   alt URL is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.parentserver.url
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateParentServerURL(url?: string): this {
    if (url !== undefined) {
      this.log.debug(`Setting intermediate parent server URL: ${url}`);
      this.args.set("intermediate.parentserver.url", url);
      this.config.intermediate.parentserver.url = url;
    }
    return this;
  }

  /**
   * @description Sets the intermediate enrollment label for the Fabric CA Server.
   * @summary Configures the enrollment label for the intermediate CA. This label is used to identify the specific enrollment request when communicating with the parent CA.
   * @param {string} [label] - The enrollment label for the intermediate CA.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateEnrollmentLabel('intermediate-ca-1');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateEnrollmentLabel('intermediate-ca-1')
   *   Builder->>Builder: Check if label is defined
   *   alt label is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.enrollment.label
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateEnrollmentLabel(label?: string): this {
    if (label !== undefined) {
      this.log.debug(`Setting intermediate enrollment label: ${label}`);
      this.args.set("intermediate.enrollment.label", label);
      this.config.intermediate = this.config.intermediate || {};
      this.config.intermediate.enrollment =
        this.config.intermediate.enrollment || {};
      this.config.intermediate.enrollment.label = label;
    }
    return this;
  }

  /**
   * @description Sets the intermediate enrollment profile for the Fabric CA Server.
   * @summary Configures the enrollment profile for the intermediate CA. This profile determines the attributes and extensions that will be included in the intermediate CA's certificate.
   * @param {string} [profile] - The enrollment profile for the intermediate CA.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateEnrollmentProfile('ca');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateEnrollmentProfile('ca')
   *   Builder->>Builder: Check if profile is defined
   *   alt profile is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.enrollment.profile
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateEnrollmentProfile(profile?: string): this {
    if (profile !== undefined) {
      this.log.debug(`Setting intermediate enrollment profile: ${profile}`);
      this.args.set("intermediate.enrollment.profile", profile);
      this.config.intermediate = this.config.intermediate || {};
      this.config.intermediate.enrollment =
        this.config.intermediate.enrollment || {};
      this.config.intermediate.enrollment.profile = profile;
    }
    return this;
  }

  /**
   * @description Sets the intermediate enrollment type for the Fabric CA Server.
   * @summary Configures the enrollment type for the intermediate CA. This determines how the intermediate CA will enroll with its parent CA.
   * @param {FabricCAServerEnrollmentType} [type] - The enrollment type for the intermediate CA.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateEnrollmentType('tls');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateEnrollmentType('tls')
   *   Builder->>Builder: Check if type is defined
   *   alt type is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.enrollment.type
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateEnrollmentType(type?: FabricCAServerEnrollmentType): this {
    if (type !== undefined) {
      this.log.debug(`Setting intermediate enrollment type: ${type}`);
      this.args.set("intermediate.enrollment.type", type);
      // this.config.intermediate = this.config.intermediate || {};
      // this.config.intermediate.enrollment =
      //   this.config.intermediate.enrollment || {};
      // this.config.intermediate.enrollment.type = type;
    }
    return this;
  }

  /**
   * @description Sets the intermediate parent server CA name for the Fabric CA Server.
   * @summary Configures the name of the parent CA server for an intermediate CA. This name is used to identify the specific CA instance on the parent server during enrollment and other operations.
   * @param {string} [caName] - The name of the parent CA server.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateParentServerCAName('root-ca');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateParentServerCAName('root-ca')
   *   Builder->>Builder: Check if caName is defined
   *   alt caName is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.parentserver.caname
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateParentServerCAName(caName?: string): this {
    if (caName !== undefined) {
      this.log.debug(`Setting intermediate parent server CA name: ${caName}`);
      this.args.set("intermediate.parentserver.caname", caName);
      this.config.intermediate = this.config.intermediate || {};
      this.config.intermediate.parentserver =
        this.config.intermediate.parentserver || {};
      this.config.intermediate.parentserver.caname = caName;
    }
    return this;
  }

  /**
   * @description Sets the intermediate TLS certificate files for the Fabric CA Server.
   * @summary Configures the TLS certificate files for the intermediate CA. These certificates are used to establish secure TLS connections with the parent CA server.
   * @param {string[]} [certfiles] - An array of paths to the TLS certificate files.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateTLSCertFiles(['/path/to/cert1.pem', '/path/to/cert2.pem']);
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateTLSCertFiles(['/path/to/cert1.pem', '/path/to/cert2.pem'])
   *   Builder->>Builder: Check if certfiles is defined and not empty
   *   alt certfiles is defined and not empty
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.tls.certfiles
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateTLSCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined && certfiles.length > 0) {
      this.log.debug(
        `Setting intermediate TLS cert files: ${certfiles.join(", ")}`
      );
      this.args.set("intermediate.tls.certfiles", certfiles);
      this.config.intermediate = this.config.intermediate || {};
      this.config.intermediate.tls = this.config.intermediate.tls || {};
      this.config.intermediate.tls.certfiles = certfiles;
    }
    return this;
  }

  /**
   * @description Sets the intermediate TLS client certificate file for the Fabric CA Server.
   * @summary Configures the TLS client certificate file for the intermediate CA. This certificate is used by the intermediate CA to authenticate itself to the parent CA server during TLS handshakes.
   * @param {string} [certfile] - The path to the TLS client certificate file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateTLSClientCertFile('/path/to/client-cert.pem');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateTLSClientCertFile('/path/to/client-cert.pem')
   *   Builder->>Builder: Check if certfile is defined
   *   alt certfile is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.tls.client.certfile
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateTLSClientCertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.log.debug(`Setting intermediate TLS client cert file: ${certfile}`);
      this.args.set("intermediate.tls.client.certfile", certfile);
      this.config.intermediate = this.config.intermediate || {};
      this.config.intermediate.tls = this.config.intermediate.tls || {};
      this.config.intermediate.tls.client =
        this.config.intermediate.tls.client || {};
      this.config.intermediate.tls.client.certfile = certfile;
    }
    return this;
  }

  /**
   * @description Sets the intermediate TLS client key file for the Fabric CA Server.
   * @summary Configures the TLS client key file for the intermediate CA. This key file is used in conjunction with the client certificate for TLS authentication to the parent CA server.
   * @param {string} [keyfile] - The path to the TLS client key file.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIntermediateTLSClientKeyFile('/path/to/client-key.pem');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIntermediateTLSClientKeyFile('/path/to/client-key.pem')
   *   Builder->>Builder: Check if keyfile is defined
   *   alt keyfile is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set intermediate.tls.client.keyfile
   *   end
   *   Builder-->>Client: Return this
   */
  setIntermediateTLSClientKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.log.debug(`Setting intermediate TLS client key file: ${keyfile}`);
      this.args.set("intermediate.tls.client.keyfile", keyfile);
      this.config.intermediate = this.config.intermediate || {};
      this.config.intermediate.tls = this.config.intermediate.tls || {};
      this.config.intermediate.tls.client =
        this.config.intermediate.tls.client || {};
      this.config.intermediate.tls.client.keyfile = keyfile;
    }
    return this;
  }

  // Registry configuration -----------------------------------------------------

  /**
   * @description Sets the registry maximum enrollments for the Fabric CA Server.
   * @summary Configures the maximum number of times an identity can be enrolled. This setting applies to all identities registered with the CA unless overridden at the identity level.
   * @param {number} [max] - The maximum number of enrollments allowed.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setRegistryMaxEnrollments(5);
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setRegistryMaxEnrollments(5)
   *   Builder->>Builder: Check if max is defined
   *   alt max is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set registry.maxenrollments
   *   end
   *   Builder-->>Client: Return this
   */
  setRegistryMaxEnrollments(max?: number): this {
    if (max !== undefined) {
      this.log.debug(`Setting registry max enrollments: ${max}`);
      this.args.set("registry.maxenrollments", max);
      this.config.registry.maxenrollments = max;
    }
    return this;
  }

  // idemix configuration ---------------------------------------------------------------------

  /**
   * @description Sets the Idemix curve for the Fabric CA Server.
   * @summary Configures the elliptic curve to be used for Idemix operations. Idemix is a cryptographic protocol used for anonymous credentials in Hyperledger Fabric.
   * @param {FabricCAServerCurveName} [curve] - The name of the elliptic curve to be used for Idemix.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIdemixCurve('256');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIdemixCurve('256')
   *   Builder->>Builder: Check if curve is defined
   *   alt curve is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set idemix.curve
   *   end
   *   Builder-->>Client: Return this
   */
  setIdemixCurve(curve?: FabricCAServerCurveName): this {
    if (curve !== undefined) {
      this.log.debug(`Setting idemix curve: ${curve}`);
      this.args.set("idemix.curve", curve);
      this.config.idemix.curve = curve;
    }
    return this;
  }

  /**
   * @description Sets the Idemix nonce expiration for the Fabric CA Server.
   * @summary Configures the expiration time for Idemix nonces. Nonces are used to prevent replay attacks in the Idemix protocol.
   * @param {string} [duration] - The duration string for nonce expiration (e.g., '15m' for 15 minutes).
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIdemixNonceExpiration('30m');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIdemixNonceExpiration('30m')
   *   Builder->>Builder: Check if duration is defined
   *   alt duration is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set idemix.nonceexpiration
   *   end
   *   Builder-->>Client: Return this
   */
  setIdemixNonceExpiration(duration?: string): this {
    if (duration !== undefined) {
      this.log.debug(`Setting Idemix nonce expiration: ${duration}`);
      this.args.set("idemix.nonceexpiration", duration);
      this.config.idemix = this.config.idemix || {};
      this.config.idemix.nonceexpiration = duration;
    }
    return this;
  }

  /**
   * @description Sets the Idemix nonce sweep interval for the Fabric CA Server.
   * @summary Configures the interval at which expired Idemix nonces are removed from the system. This helps in maintaining system performance by regularly cleaning up unused nonces.
   * @param {string} [interval] - The duration string for the nonce sweep interval (e.g., '15m' for every 15 minutes).
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIdemixNonceSweepInterval('1h');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIdemixNonceSweepInterval('1h')
   *   Builder->>Builder: Check if interval is defined
   *   alt interval is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set idemix.noncesweepinterval
   *   end
   *   Builder-->>Client: Return this
   */
  setIdemixNonceSweepInterval(interval?: string): this {
    if (interval !== undefined) {
      this.log.debug(`Setting Idemix nonce sweep interval: ${interval}`);
      this.args.set("idemix.noncesweepinterval", interval);
      this.config.idemix = this.config.idemix || {};
      this.config.idemix.noncesweepinterval = interval;
    }
    return this;
  }

  /**
   * @description Sets the Idemix revocation handle pool size for the Fabric CA Server.
   * @summary Configures the size of the revocation handle pool for Idemix operations. Revocation handles are used in the Idemix protocol to enable credential revocation.
   * @param {number} [size] - The size of the revocation handle pool.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setIdemixRHPoolSize(1000);
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setIdemixRHPoolSize(1000)
   *   Builder->>Builder: Check if size is defined
   *   alt size is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set idemix.rhpoolsize
   *   end
   *   Builder-->>Client: Return this
   */
  setIdemixRHPoolSize(size?: number): this {
    if (size !== undefined) {
      this.log.debug(`Setting Idemix revocation handle pool size: ${size}`);
      this.args.set("idemix.rhpoolsize", size);
      this.config.idemix = this.config.idemix || {};
      this.config.idemix.rhpoolsize = size;
    }
    return this;
  }

  // CORS configuration ----------------------------------------------------------------------

  /**
   * @description Enables or disables Cross-Origin Resource Sharing (CORS) for the Fabric CA Server.
   * @summary Configures whether CORS is enabled for the Fabric CA Server. CORS allows web applications running at one origin to make requests to resources from a different origin.
   * @param {boolean} [enabled] - Whether to enable CORS.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.enableCORS(true);
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: enableCORS(true)
   *   Builder->>Builder: Check if enabled is defined
   *   alt enabled is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set cors.enabled
   *   end
   *   Builder-->>Client: Return this
   */
  enableCORS(enabled?: boolean): this {
    if (enabled !== undefined) {
      this.log.debug(`Setting CORS enabled: ${enabled}`);
      this.args.set("cors.enabled", enabled);
      this.config.cors.enabled = enabled;
    }
    return this;
  }

  /**
   * @description Sets the allowed origins for Cross-Origin Resource Sharing (CORS).
   * @summary Configures the list of origins that are allowed to make cross-origin requests to the Fabric CA Server. This is used in conjunction with CORS when it's enabled.
   * @param {string[]} [origins] - An array of allowed origin URLs.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setCORSOrigins(['https://example.com', 'https://test.com']);
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant Config as Configuration
   *   Client->>Builder: setCORSOrigins(['https://example.com', 'https://test.com'])
   *   Builder->>Builder: Check if origins is defined
   *   alt origins is defined
   *     Builder->>Builder: Log debug message
   *     Builder->>Config: Set cors.origins
   *   end
   *   Builder-->>Client: Return this
   */
  setCORSOrigins(origins?: string[]): this {
    if (origins !== undefined) {
      this.log.debug(`Setting CORS origins: ${origins}`);
      this.args.set("cors.origins", origins);
      this.config.cors.origins = origins;
    }
    return this;
  }

  /**
   * @description Saves the current configuration to a file.
   * @summary Writes the current Fabric CA Server configuration to a YAML file at the specified path. If the directory doesn't exist, it will be created.
   * @param {string} cpath - The path where the configuration file should be saved.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.saveConfig('/path/to/config/fabric-ca-server.yaml');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant FileSystem as File System
   *   Client->>Builder: saveConfig('/path/to/config/fabric-ca-server.yaml')
   *   Builder->>Builder: Check if cpath is defined
   *   alt cpath is defined
   *     Builder->>FileSystem: Check if directory exists
   *     alt Directory doesn't exist
   *       Builder->>FileSystem: Create directory
   *     end
   *     Builder->>Builder: Log debug message
   *     Builder->>FileSystem: Write YAML configuration to file
   *   end
   *   Builder-->>Client: Return this
   */
  saveConfig(cpath: string): this {
    if (cpath === undefined) return this;

    if (!fs.existsSync(path.join(cpath)))
      fs.mkdirSync(path.join(cpath), { recursive: true });

    if (!cpath.endsWith(".yaml"))
      cpath = path.join(cpath, "fabric-ca-server-config.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.verbose(`Config file: ${JSON.stringify(this.config)}`, 3);
    writeFileYaml(cpath, this.config);

    return this;
  }

  /**
   * @description Builds the final Fabric CA Server command string.
   * @summary Constructs the complete command string for the Fabric CA Server based on all the configured options. This method combines the base command with all the set arguments.
   * @return {string} The complete Fabric CA Server command as a string.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.setPort(7054).setTLSEnabled(true);
   * const command = builder.build();
   * console.log(command); // Outputs: fabric-ca-server start --port 7054 --tls.enabled
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   Client->>Builder: build()
   *   Builder->>Builder: Initialize command array
   *   Builder->>Builder: Iterate through args Map
   *   loop For each argument
   *     Builder->>Builder: Format argument
   *     Builder->>Builder: Add to command array
   *   end
   *   Builder->>Builder: Join command array into string
   *   Builder->>Builder: Log debug message
   *   Builder-->>Client: Return command string
   */
  build(): string[] | Array<Array<string>> {
    const commandArray: string[] = [this.getBinary(), this.command];

    this.args.forEach((value, key) => {
      if (typeof value === "boolean") {
        if (value) commandArray.push(`--${key}`);
      } else if (Array.isArray(value)) {
        commandArray.push(`--${key}`, value.join(","));
      } else {
        commandArray.push(`--${key}`, value.toString());
      }
    });

    const commandStr = commandArray.join(" ");

    this.log.debug(`Built command: ${commandStr}`);
    return [commandStr];
  }

  getCommand(): string {
    return this.command;
  }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    const argsArray: string[] = [];

    this.args.forEach((value, key) => {
      if (typeof value === "boolean") {
        if (value) argsArray.push(`--${key}`);
      } else if (Array.isArray(value)) {
        argsArray.push(`--${key}`, value.join(","));
      } else {
        argsArray.push(`--${key}`, value.toString());
      }
    });

    return argsArray;
  }

  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [this.getCommand(), ...this.getArgs()];

    const regex = /\[\s*INFO\s*\] Listening on http/;

    await runCommand(bin, argz, {}, regex);
  }
}
