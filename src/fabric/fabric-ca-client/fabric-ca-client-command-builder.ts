import { Logger, Logging } from "@decaf-ts/logging";
// import { FabricBinaries } from "../constants/fabric-binaries";
// import {
//   FabricCAServerCommand,
//   FabricLogLevel,
// } from "../constants/fabric-ca-server";
// import {
//   CAConfig,
//   CommadCSRConfig,
//   CommandIntermediateCAConfig,
//   CommandLDAPConfig,
//   CorsConfig,
//   DBConfig,
//   IdemixConfig,
//   ServerTLSConfig,
// } from "../interfaces/fabric/fabric-ca-server-config";
// import { COMMA_SEPARATOR } from "../../core/constants/constants";
// import { mapParser } from "../../utils";
// import { runCommand } from "../../utils/child-process";

export class FabricCAClientCommandBuilder {
  private log: Logger;
  //   private binName: FabricBinaries = FabricBinaries.SERVER;
  //   private command: FabricCAServerCommand = FabricCAServerCommand.HELP;
  //   private args: Map<string, string | boolean | number | string[]> = new Map();
  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricCAClientCommandBuilder);
    else this.log = logger.for(FabricCAClientCommandBuilder.name);
  }
  //   /**
  //    * @description Sets the command for the Fabric CA Server.
  //    * @summary Configures the primary action for the Fabric CA Server, such as starting the server or generating certificates.
  //    * @param {FabricCAServerCommand} [command] - The command to be executed by the Fabric CA Server.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setCommand(command?: FabricCAServerCommand): this {
  //     if (command !== undefined) {
  //       this.log.debug(`Setting command: ${command}`);
  //       this.command = command;
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Sets the port for the Fabric CA Server.
  //    * @summary Configures the network port on which the Fabric CA Server will listen for incoming connections.
  //    * @param {number} [port] - The port number for the Fabric CA Server to listen on.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setPort(port?: number): this {
  //     if (port !== undefined) {
  //       this.log.debug(`Setting port: ${port}`);
  //       this.args.set("port", port);
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Enables or disables debug mode for the Fabric CA Server.
  //    * @summary Configures whether the Fabric CA Server should run in debug mode, providing more detailed logging and output.
  //    * @param {boolean} [enable] - Whether to enable debug mode.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   enableDebug(enable?: boolean): this {
  //     if (enable !== undefined) {
  //       this.log.debug(`Setting debug: ${enable}`);
  //       this.args.set("debug", enable);
  //     }
  //     return this;
  //   }
  //   setServerTLS(tlsConfig?: ServerTLSConfig): this {
  //     if (!tlsConfig) return this;
  //     if (tlsConfig.enabled !== undefined) {
  //       this.log.debug("Setting TLS enabled");
  //       this.args.set("tls.enabled", tlsConfig.enabled);
  //     }
  //     if (tlsConfig.certfile !== undefined) {
  //       this.log.debug(`Setting TLS cert file: ${tlsConfig.certfile}`);
  //       this.args.set("tls.certfile", tlsConfig.certfile);
  //     }
  //     if (tlsConfig.keyfile !== undefined) {
  //       this.log.debug(`Setting TLS key file: ${tlsConfig.keyfile}`);
  //       this.args.set("tls.keyfile", tlsConfig.keyfile);
  //     }
  //     if (tlsConfig.clientauth === undefined) return this;
  //     if (tlsConfig.clientauth.certfiles !== undefined) {
  //       this.log.debug(
  //         `Setting TLS client certfiles: ${tlsConfig.clientauth.certfiles}`
  //       );
  //       this.args.set(
  //         "tls.clientauth.certfiles",
  //         tlsConfig.clientauth.certfiles.join(COMMA_SEPARATOR)
  //       );
  //     }
  //     if (tlsConfig.clientauth.type !== undefined) {
  //       this.log.debug(
  //         `Setting TLS client auth type: ${tlsConfig.clientauth.type}`
  //       );
  //       this.args.set("tls.clientauth.type", tlsConfig.clientauth.type);
  //     }
  //     return this;
  //   }
  //   setCA(config: CAConfig): this {
  //     if (!config) return this;
  //     if (config.name !== undefined) {
  //       this.log.debug(`Setting CA name: ${config.name}`);
  //       this.args.set("ca.name", config.name);
  //     }
  //     if (config.keyfile !== undefined) {
  //       this.log.debug(`Setting CA key file: ${config.keyfile}`);
  //       this.args.set("ca.keyfile", config.keyfile);
  //     }
  //     if (config.certfile !== undefined) {
  //       this.log.debug(`Setting CA cert file: ${config.certfile}`);
  //       this.args.set("ca.certfile", config.certfile);
  //     }
  //     if (config.chainfile !== undefined) {
  //       this.log.debug(`Setting CA chain file: ${config.chainfile}`);
  //       this.args.set("ca.chainfile", config.chainfile);
  //     }
  //     if (config.reenrollIgnoreCertExpiry !== undefined) {
  //       this.log.debug(
  //         `Setting reenrollIgnoreCertExpiry: ${config.reenrollIgnoreCertExpiry}`
  //       );
  //       this.args.set(
  //         "ca.reenrollignorecertexpiry",
  //         config.reenrollIgnoreCertExpiry
  //       );
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Sets the address for the Fabric CA Server.
  //    * @summary Configures the network address on which the Fabric CA Server will listen for incoming connections.
  //    * @param {string} [address] - The network address for the Fabric CA Server to listen on.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setAddress(address?: string): this {
  //     if (address !== undefined) {
  //       this.log.debug(`Setting address: ${address}`);
  //       this.args.set("address", address);
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Sets the bootstrap admin user for the Fabric CA Server.
  //    * @summary Configures the initial admin user with full privileges for the Fabric CA Server.
  //    * @param {string} [bootUser] - The bootstrap admin user in the format "username:password".
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setBootstrapAdmin(bootUser?: string): this {
  //     if (bootUser !== undefined) {
  //       const [user, password] = bootUser.split(":");
  //       this.log.debug(`Setting bootstrap admin: ${user}:${password}`);
  //       this.args.set("boot", bootUser);
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Sets the number of CAs to run on the Fabric CA Server.
  //    * @summary Configures the Fabric CA Server to run multiple CA instances.
  //    * @param {number} [count] - The number of CA instances to run.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setCACount(count?: number): this {
  //     if (count !== undefined) {
  //       this.log.debug(`Setting CA count: ${count}`);
  //       this.args.set("cacount", count);
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Sets the configuration files for multiple CAs.
  //    * @summary Configures the Fabric CA Server with multiple CA configurations using separate files.
  //    * @param {string[]} [files] - An array of paths to CA configuration files.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setCAFiles(files?: string[]): this {
  //     if (files !== undefined && files.length > 0) {
  //       this.log.debug(`Setting CA configuration files: ${files.join(", ")}`);
  //       this.args.set("cafiles", files.join(COMMA_SEPARATOR));
  //     }
  //     return this;
  //   }
  //   setCors(config?: CorsConfig): this {
  //     if (!config) return this;
  //     if (config.enabled !== undefined) {
  //       this.log.debug(`Setting CORS enabled: ${config.enabled}`);
  //       this.args.set("cors.enabled", config.enabled);
  //     }
  //     if (config.origins !== undefined) {
  //       this.log.debug(`Setting CORS origins: ${config.origins.join(", ")}`);
  //       this.args.set("cors.origins", config.origins.join(COMMA_SEPARATOR));
  //     }
  //     return this;
  //   }
  //   setCrlExpiry(crlExpiry?: string): this {
  //     if (crlExpiry !== undefined) {
  //       this.log.debug(`Setting CRL expiry: ${crlExpiry}`);
  //       this.args.set("crl.expiry", crlExpiry);
  //     }
  //     return this;
  //   }
  //   /**
  //    * @description Sets the size limit for the Certificate Revocation List (CRL).
  //    * @summary Configures the maximum number of revoked certificates that can be included in a single CRL.
  //    * @param {number} [limit] - The maximum number of revoked certificates in the CRL.
  //    * @return {this} The current instance of the builder for method chaining.
  //    */
  //   setCRLSizeLimit(limit?: number): this {
  //     if (limit !== undefined) {
  //       this.log.debug(`Setting CRL size limit: ${limit}`);
  //       this.args.set("crlsizelimit", limit);
  //     }
  //     return this;
  //   }
  //   setCSR(csr?: CommadCSRConfig): this {
  //     if (csr === undefined) return this;
  //     if (csr.cn !== undefined) {
  //       this.log.debug(`Setting CSR CN: ${csr.cn}`);
  //       this.args.set("csr.cn", csr.cn);
  //     }
  //     if (csr.hosts !== undefined) {
  //       this.log.debug(`Setting CSR hosts: ${csr.hosts}`);
  //       this.args.set("csr.hosts", [...new Set(csr.hosts)].join(COMMA_SEPARATOR));
  //     }
  //     if (csr.keyrequest !== undefined) {
  //       if (csr.keyrequest.algo !== undefined) {
  //         this.log.debug(
  //           `Setting CSR key request algorithm: ${csr.keyrequest.algo}`
  //         );
  //         this.args.set("csr.keyrequest.algo", csr.keyrequest.algo);
  //       }
  //       if (csr.keyrequest.size !== undefined) {
  //         this.log.debug(`Setting CSR key request size: ${csr.keyrequest.size}`);
  //         this.args.set("csr.keyrequest.size", csr.keyrequest.size);
  //       }
  //       if (csr.keyrequest.reusekey !== undefined) {
  //         this.log.debug(
  //           `Setting CSR key request reuse key: ${csr.keyrequest.reusekey}`
  //         );
  //         this.args.set("csr.keyrequest.reusekey", csr.keyrequest.reusekey);
  //       }
  //     }
  //     if (csr.serialnumber !== undefined) {
  //       this.log.debug(`Setting CSR serial number: ${csr.serialnumber}`);
  //       this.args.set("csr.serialnumber", csr.serialnumber);
  //     }
  //     return this;
  //   }
  //   setHelp(show?: boolean): this {
  //     if (show !== undefined) {
  //       this.log.debug(`Setting help flag: ${show}`);
  //       this.args.set("help", show);
  //     }
  //     return this;
  //   }
  //   setHome(home?: string): this {
  //     if (home !== undefined) {
  //       this.log.debug(`Setting home directory: ${home}`);
  //       this.args.set("home", home);
  //     }
  //     return this;
  //   }
  //   setDatabase(cfg?: DBConfig): this {
  //     if (cfg === undefined) return this;
  //     if (cfg.type !== undefined) {
  //       this.log.debug(`Setting database type: ${cfg.type}`);
  //       this.args.set("db.type", cfg.type);
  //     }
  //     if (cfg.datasource !== undefined) {
  //       this.log.debug(`Setting database datasource: ${cfg.datasource}`);
  //       this.args.set("db.datasource", cfg.datasource);
  //     }
  //     if (cfg.tls !== undefined) {
  //       if (cfg.tls.certfiles !== undefined) {
  //         this.log.debug(`Setting TLS certfiles: ${cfg.tls.certfiles}`);
  //         this.args.set(
  //           "db.tls.certfiles",
  //           cfg.tls.certfiles.join(COMMA_SEPARATOR)
  //         );
  //       }
  //       if (cfg.tls.client !== undefined) {
  //         if (cfg.tls.client.certfile !== undefined) {
  //           this.log.debug(
  //             `Setting TLS client certfile: ${cfg.tls.client.certfile}`
  //           );
  //           this.args.set("db.tls.client.certfile", cfg.tls.client.certfile);
  //         }
  //         if (cfg.tls.client.keyfile !== undefined) {
  //           this.log.debug(
  //             `Setting TLS client keyfile: ${cfg.tls.client.keyfile}`
  //           );
  //           this.args.set("db.tls.client.keyfile", cfg.tls.client.keyfile);
  //         }
  //       }
  //     }
  //     return this;
  //   }
  //   setIdemix(idemix?: IdemixConfig): this {
  //     if (idemix === undefined) return this;
  //     if (idemix.nonceexpiration !== undefined) {
  //       this.log.debug(
  //         `Setting Idemix nonce expiration: ${idemix.nonceexpiration}`
  //       );
  //       this.args.set("idemix.nonceexpiration", idemix.nonceexpiration);
  //     }
  //     if (idemix.curve !== undefined) {
  //       this.log.debug(`Setting Idemix curve: ${idemix.curve}`);
  //       this.args.set("idemix.curve", idemix.curve);
  //     }
  //     if (idemix.noncesweepinterval !== undefined) {
  //       this.log.debug(
  //         `Setting Idemix noncesweep interval: ${idemix.noncesweepinterval}`
  //       );
  //       this.args.set("idemix.noncesweepinterval", idemix.noncesweepinterval);
  //     }
  //     if (idemix.rhpoolsize !== undefined) {
  //       this.log.debug(`Setting Idemix rhpoolsize: ${idemix.rhpoolsize}`);
  //       this.args.set("idemix.rhpoolsize", idemix.rhpoolsize);
  //     }
  //     return this;
  //   }
  //   setIntermediate(int: CommandIntermediateCAConfig): this {
  //     if (int === undefined) return this;
  //     if (int.parentserver !== undefined) {
  //       if (int.parentserver.url !== undefined) {
  //         this.log.debug(
  //           `Setting intermediate CA parent server URL: ${int.parentserver.url}`
  //         );
  //         this.args.set("intermediate.parentserver.url", int.parentserver.url);
  //       }
  //       if (int.parentserver.caname !== undefined) {
  //         this.log.debug(
  //           `Setting intermediate CA parent server caname: ${int.parentserver.caname}`
  //         );
  //         this.args.set(
  //           "intermediate.parentserver.caname",
  //           int.parentserver.caname
  //         );
  //       }
  //     }
  //     if (int.enrollment !== undefined) {
  //       if (int.enrollment.type !== undefined) {
  //         this.log.debug(
  //           `Setting intermediate CA enrollment type: ${int.enrollment.type}`
  //         );
  //         this.args.set("intermediate.enrollment.type", int.enrollment.type);
  //       }
  //       if (int.enrollment.profile !== undefined) {
  //         this.log.debug(
  //           `Setting intermediate CA enrollment profile: ${int.enrollment.profile}`
  //         );
  //         this.args.set(
  //           "intermediate.enrollment.profile",
  //           int.enrollment.profile
  //         );
  //       }
  //       if (int.enrollment.label !== undefined) {
  //         this.log.debug(
  //           `Setting intermediate CA enrollment label: ${int.enrollment.label}`
  //         );
  //         this.args.set("intermediate.enrollment.label", int.enrollment.label);
  //       }
  //     }
  //     if (int.tls !== undefined) {
  //       if (int.tls.certfiles !== undefined) {
  //         this.log.debug(
  //           `Setting intermediate CA TLS certfiles: ${int.tls.certfiles.join(
  //             ", "
  //           )}`
  //         );
  //         this.args.set(
  //           "intermediate.tls.certfiles",
  //           int.tls.certfiles.join(COMMA_SEPARATOR)
  //         );
  //       }
  //       if (int.tls.client !== undefined) {
  //         if (int.tls.client.certfile !== undefined) {
  //           this.log.debug(
  //             `Setting intermediate CA TLS client certfile: ${int.tls.client.certfile}`
  //           );
  //           this.args.set(
  //             "intermediate.tls.client.certfile",
  //             int.tls.client.certfile
  //           );
  //         }
  //         if (int.tls.client.keyfile !== undefined) {
  //           this.log.debug(
  //             `Setting intermediate CA TLS client keyfile: ${int.tls.client.keyfile}`
  //           );
  //           this.args.set(
  //             "intermediate.tls.client.keyfile",
  //             int.tls.client.keyfile
  //           );
  //         }
  //       }
  //     }
  //     return this;
  //   }
  //   setLDAP(ldap?: CommandLDAPConfig): this {
  //     if (ldap === undefined) return this;
  //     if (ldap.enabled !== undefined) {
  //       this.log.debug(`Setting LDAP enabled: ${ldap.enabled}`);
  //       this.args.set("ldap.enabled", ldap.enabled);
  //     }
  //     if (ldap.url !== undefined) {
  //       this.log.debug(`Setting LDAP URL: ${ldap.url}`);
  //       this.args.set("ldap.url", ldap.url);
  //     }
  //     if (ldap.tls !== undefined) {
  //       if (ldap.tls.certfiles !== undefined) {
  //         this.log.debug(
  //           `Setting TLS certfiles: ${ldap.tls.certfiles.join(", ")}`
  //         );
  //         this.args.set(
  //           "ldap.tls.certfiles",
  //           ldap.tls.certfiles.join(COMMA_SEPARATOR)
  //         );
  //       }
  //       if (ldap.tls.client !== undefined) {
  //         if (ldap.tls.client.certfile !== undefined) {
  //           this.log.debug(
  //             `Setting TLS client certfile: ${ldap.tls.client.certfile}`
  //           );
  //           this.args.set("ldap.tls.client.certfile", ldap.tls.client.certfile);
  //         }
  //         if (ldap.tls.client.keyfile !== undefined) {
  //           this.log.debug(
  //             `Setting TLS client keyfile: ${ldap.tls.client.keyfile}`
  //           );
  //           this.args.set("ldap.tls.client.keyfile", ldap.tls.client.keyfile);
  //         }
  //       }
  //     }
  //     if (ldap.attribute !== undefined) {
  //       if (ldap.attribute.names !== undefined) {
  //         this.log.debug(
  //           `Setting LDAP attribute names: ${ldap.attribute.names.join(", ")}`
  //         );
  //         this.args.set(
  //           "ldap.attribute.names",
  //           ldap.attribute.names.join(COMMA_SEPARATOR)
  //         );
  //       }
  //     }
  //     if (ldap.groupfilter !== undefined) {
  //       this.log.debug(`Setting LDAP groupfiler: ${ldap.groupfilter}`);
  //       this.args.set("ldap.groupfilter", ldap.groupfilter);
  //     }
  //     if (ldap.userfilter !== undefined) {
  //       this.log.debug(`Setting LDAP userfilter: ${ldap.userfilter}`);
  //       this.args.set("ldap.userfilter", ldap.userfilter);
  //     }
  //     return this;
  //   }
  //   setLogLevel(level: FabricLogLevel): this {
  //     this.log.debug(`Setting log level: ${level}`);
  //     this.args.set("loglevel", level);
  //     return this;
  //   }
  //   setMaxEnrollments(maxEnrollments?: number): this {
  //     if (maxEnrollments !== undefined) {
  //       this.log.debug(`Setting max enrollments: ${maxEnrollments}`);
  //       this.args.set("registry.maxenrollments", maxEnrollments);
  //     }
  //     return this;
  //   }
  //   setAllowAffiliationsRemove(allow?: boolean): this {
  //     if (allow !== undefined) {
  //       this.log.debug(`Setting affiliations allow remove: ${allow}`);
  //       this.args.set("cfg.affiliations.allowremove", allow);
  //     }
  //     return this;
  //   }
  //   setAllowIdentitiesRemove(allow?: boolean): this {
  //     if (allow !== undefined) {
  //       this.log.debug(`Setting identities allow remove: ${allow}`);
  //       this.args.set("cfg.identities.allowremove", allow);
  //     }
  //     return this;
  //   }
  //   setPasswordAttempts(attempts?: number): this {
  //     if (attempts !== undefined) {
  //       this.log.debug(`Setting password attempts: ${attempts}`);
  //       this.args.set("cfg.identities.passwordattempts", attempts);
  //     }
  //     return this;
  //   }
  //   build(): string {
  //     const command: string = [
  //       this.getBinary(),
  //       this.getCommand(),
  //       ...mapParser(this.args),
  //     ].join(" ");
  //     this.log.debug(`Built command: ${command}`);
  //     return command;
  //   }
  //   getCommand(): string {
  //     return this.command;
  //   }
  //   getBinary(): string {
  //     return this.binName;
  //   }
  //   getArgs(): string[] {
  //     return mapParser(this.args);
  //   }
  //   async execute(): Promise<void> {
  //     const bin = this.getBinary();
  //     const argz = [this.getCommand(), ...this.getArgs()];
  //     const regex = /\[\s*INFO\s*\] Listening on http/;
  //     await runCommand(bin, argz, {}, regex);
  //   }
}
