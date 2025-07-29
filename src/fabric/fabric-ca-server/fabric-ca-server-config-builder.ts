import { Logger, Logging } from "@decaf-ts/logging";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import {
  BCCSPConfig,
  CAConfig,
  CorsConfig,
  CSRConfig,
  DBConfig,
  FabricCAServerConfig,
  IdemixConfig,
  Identity,
  IntermediateCAConfig,
  LDAPConfig,
  ServerTLSConfig,
  SigningConfig,
} from "../interfaces/fabric/fabric-ca-server-config";
import path from "path";
import { overrideNonUndefined } from "../../utils-old/object";
import fs from "fs";
import {
  MetricsConfig,
  OperationsConfig,
} from "../interfaces/fabric/general-configs";

export class FabricCAServerConfigBuilder {
  private log: Logger;

  private config: FabricCAServerConfig = readFileYaml(
    path.join(__dirname, "../../../config/fabric-ca-server-config.yaml")
  ) as FabricCAServerConfig;

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricCAServerConfigBuilder);
    else this.log = logger.for(FabricCAServerConfigBuilder.name);
  }

  setVersion(version?: string): this {
    if (version !== undefined) {
      this.log.debug(`Setting version: ${version}`);
      this.config.version = version;
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
      this.config.port = port;
    }
    return this;
  }

  setCors(cors?: CorsConfig) {
    if (cors === undefined) return this;

    if (cors.enabled !== undefined) {
      this.log.debug("Setting CORS enabled");
      this.config.cors!.enabled = cors.enabled;
    }
    if (cors.origins !== undefined) {
      this.log.debug(`Setting CORS origins: ${cors.origins}`);
      this.config.cors!.origins = cors.origins;
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
      this.config.debug = enable;
    }
    return this;
  }

  setCrlSizeLimit(crlSizeLimit?: number): this {
    if (crlSizeLimit !== undefined) {
      this.log.debug(`Setting CRL size limit: ${crlSizeLimit}`);
      this.config.crlsizelimit = crlSizeLimit;
    }
    return this;
  }

  setServerTLS(tlsConfig?: ServerTLSConfig): this {
    if (!tlsConfig) return this;

    if (tlsConfig.enabled !== undefined) {
      this.log.debug("Setting TLS enabled");
      this.config.tls!.enabled = tlsConfig.enabled;
    }

    if (tlsConfig.certfile !== undefined) {
      this.log.debug(`Setting TLS cert file: ${tlsConfig.certfile}`);
      this.config.tls!.certfile = tlsConfig.certfile;
    }

    if (tlsConfig.keyfile !== undefined) {
      this.log.debug(`Setting TLS key file: ${tlsConfig.keyfile}`);
      this.config.tls!.keyfile = tlsConfig.keyfile;
    }

    if (tlsConfig.clientauth !== undefined) {
      if (tlsConfig.clientauth.certfiles !== undefined) {
        this.log.debug(
          `Setting TLS client certfiles: ${tlsConfig.clientauth.certfiles}`
        );
        this.config.tls!.clientauth!.certfiles = tlsConfig.clientauth.certfiles;
      }

      if (tlsConfig.clientauth.type !== undefined) {
        this.log.debug(
          `Setting TLS client auth type: ${tlsConfig.clientauth.type}`
        );
        this.config.tls!.clientauth!.type = tlsConfig.clientauth.type;
      }
    }

    return this;
  }

  setCA(config?: CAConfig): this {
    if (!config) return this;

    if (config.name !== undefined) {
      this.log.debug(`Setting CA name: ${config.name}`);
      this.config.ca!.name = config.name;
    }

    if (config.keyfile !== undefined) {
      this.log.debug(`Setting CA key file: ${config.keyfile}`);
      this.config.ca!.keyfile = config.keyfile;
    }

    if (config.certfile !== undefined) {
      this.log.debug(`Setting CA cert file: ${config.certfile}`);
      this.config.ca!.certfile = config.certfile;
    }

    if (config.chainfile !== undefined) {
      this.log.debug(`Setting CA chain file: ${config.chainfile}`);
      this.config.ca!.chainfile = config.chainfile;
    }

    if (config.reenrollIgnoreCertExpiry !== undefined) {
      this.log.debug(
        `Setting reenrollIgnoreCertExpiry: ${config.reenrollIgnoreCertExpiry}`
      );
      this.config.ca!.reenrollIgnoreCertExpiry =
        config.reenrollIgnoreCertExpiry;
    }

    return this;
  }

  setCrlExpiry(crlExpiry?: string): this {
    if (crlExpiry !== undefined) {
      this.log.debug(`Setting CRL expiry: ${crlExpiry}`);
      this.config.crl!.expiry = crlExpiry;
    }
    return this;
  }

  setIdentities(ids?: Identity[] | Identity): this {
    if (ids !== undefined) {
      if (!Array.isArray(ids)) ids = [ids];

      this.log.debug(`Setting identities: ${JSON.stringify(ids)}`);
      const baseIdentity: Identity = this.config.registry!.identities![0];
      const identities: Identity[] = ids.map((el: Identity) => {
        const identity = { ...baseIdentity };
        if (el.name !== undefined) identity.name = el.name;
        if (el.pass !== undefined) identity.pass = el.pass;
        if (el.type !== undefined) identity.type = el.type;
        if (el.affiliation !== undefined) identity.affiliation = el.affiliation;
        if (el.attrs !== undefined)
          identity.attrs = overrideNonUndefined(
            identity.attrs as {
              [key: string]: string | boolean;
            },
            el.attrs
          );

        return identity;
      });
      this.config.registry!.identities = identities;
    }
    return this;
  }

  setMaxEnrollments(maxEnrollments?: number): this {
    if (maxEnrollments !== undefined) {
      this.log.debug(`Setting max enrollments: ${maxEnrollments}`);
      this.config.registry!.maxenrollments = maxEnrollments;
    }
    return this;
  }

  setDatabase(cfg?: DBConfig): this {
    if (cfg === undefined) return this;

    if (cfg.type !== undefined) {
      this.log.debug(`Setting database type: ${cfg.type}`);
      this.config.db!.type = cfg.type;
    }
    if (cfg.datasource !== undefined) {
      this.log.debug(`Setting database datasource: ${cfg.datasource}`);
      this.config.db!.datasource = cfg.datasource;
    }

    if (cfg.tls !== undefined) {
      if (cfg.tls.enabled !== undefined) {
        this.log.debug(`Setting TLS enabled: ${cfg.tls.enabled}`);
        this.config.db!.tls!.enabled = cfg.tls.enabled;
      }

      if (cfg.tls.certfiles !== undefined) {
        this.log.debug(`Setting TLS certfiles: ${cfg.tls.certfiles}`);
        this.config.db!.tls!.certfiles = cfg.tls.certfiles;
      }

      if (cfg.tls.client !== undefined) {
        if (cfg.tls.client.certfile !== undefined) {
          this.log.debug(
            `Setting TLS client certfile: ${cfg.tls.client.certfile}`
          );
          this.config.db!.tls!.client!.certfile = cfg.tls.client.certfile;
        }

        if (cfg.tls.client.keyfile !== undefined) {
          this.log.debug(
            `Setting TLS client keyfile: ${cfg.tls.client.keyfile}`
          );
          this.config.db!.tls!.client!.keyfile = cfg.tls.client.keyfile;
        }
      }
    }

    return this;
  }

  setLDAP(ldap?: LDAPConfig): this {
    if (ldap === undefined) return this;

    if (ldap.enabled !== undefined) {
      this.log.debug(`Setting LDAP enabled: ${ldap.enabled}`);
      this.config.ldap!.enabled = ldap.enabled;
    }

    if (ldap.url !== undefined) {
      this.log.debug(`Setting LDAP URL: ${ldap.url}`);
      this.config.ldap!.url = ldap.url;
    }

    if (ldap.tls !== undefined) {
      if (ldap.tls.certfiles !== undefined) {
        this.log.debug(`Setting TLS certfiles: ${ldap.tls.certfiles}`);
        this.config.ldap!.tls!.certfiles = ldap.tls.certfiles;
      }

      if (ldap.tls.client !== undefined) {
        if (ldap.tls.client.certfile !== undefined) {
          this.log.debug(
            `Setting TLS client certfile: ${ldap.tls.client.certfile}`
          );
          this.config.ldap!.tls!.client!.certfile = ldap.tls.client.certfile;
        }

        if (ldap.tls.client.keyfile !== undefined) {
          this.log.debug(
            `Setting TLS client keyfile: ${ldap.tls.client.keyfile}`
          );
          this.config.ldap!.tls!.client!.keyfile = ldap.tls.client.keyfile;
        }
      }
    }

    if (ldap.attribute !== undefined) {
      if (ldap.attribute.names !== undefined) {
        this.log.debug(`Setting LDAP attribute names: ${ldap.attribute.names}`);
        this.config.ldap!.attribute!.names = ldap.attribute.names;
      }

      if (ldap.attribute.converters !== undefined) {
        this.log.debug(
          `Setting LDAP attribute converters: ${JSON.stringify(
            ldap.attribute.converters
          )}`
        );
        this.config.ldap!.attribute!.converters = ldap.attribute.converters;
      }

      if (ldap.attribute.maps !== undefined) {
        this.log.debug(
          `Setting LDAP attribute maps: ${JSON.stringify(ldap.attribute.maps)}`
        );
        this.config.ldap!.attribute!.maps = ldap.attribute.maps;
      }
    }

    return this;
  }

  setAffiliations(affiliations?: { [key: string]: string[] }): this {
    if (affiliations !== undefined) {
      this.log.debug(`Setting affiliations: ${JSON.stringify(affiliations)}`);
      this.config.affiliations = affiliations;
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

  setSigning(cfg?: SigningConfig): this {
    if (cfg === undefined) return this;

    if (cfg.default !== undefined) {
      if (cfg.default.usage !== undefined) {
        this.log.debug(`Setting default usage: ${cfg.default.usage}`);
        this.config.signing!.default!.usage = [...new Set(cfg.default.usage)];
      }

      if (cfg.default.expiry !== undefined) {
        this.log.debug(`Setting default expiry: ${cfg.default.expiry}`);
        this.config.signing!.default!.expiry = cfg.default.expiry;
      }
    }

    if (cfg.profiles !== undefined) {
      if (cfg.profiles.ca !== undefined) {
        if (cfg.profiles.ca.usage !== undefined) {
          this.log.debug(`Setting CA usage: ${cfg.profiles.ca.usage}`);
          this.config.signing!.profiles!.ca!.usage = [
            ...new Set(cfg.profiles.ca.usage),
          ];
        }

        if (cfg.profiles.ca.expiry !== undefined) {
          this.log.debug(`Setting CA expiry: ${cfg.profiles.ca.expiry}`);
          this.config.signing!.profiles!.ca!.expiry = cfg.profiles.ca.expiry;
        }

        if (cfg.profiles.ca.caconstraint !== undefined) {
          if (cfg.profiles.ca.caconstraint.isca !== undefined) {
            this.log.debug(
              `Setting CA isCA: ${cfg.profiles.ca.caconstraint.isca}`
            );
            this.config.signing!.profiles!.ca!.caconstraint!.isca =
              cfg.profiles.ca.caconstraint.isca;
          }

          if (cfg.profiles.ca.caconstraint.maxpathlen !== undefined) {
            this.log.debug(
              `Setting CA max pathlength: ${cfg.profiles.ca.caconstraint.maxpathlen}`
            );
            this.config.signing!.profiles!.ca!.caconstraint!.maxpathlen =
              cfg.profiles.ca.caconstraint.maxpathlen;
          }
        }
      }

      if (cfg.profiles.tls !== undefined) {
        if (cfg.profiles.tls.usage !== undefined) {
          this.log.debug(`Setting TLS usage: ${cfg.profiles.tls.usage}`);
          this.config.signing!.profiles!.tls!.usage = [
            ...new Set(cfg.profiles.tls.usage),
          ];
        }

        if (cfg.profiles.tls.expiry !== undefined) {
          this.log.debug(`Setting TLS expiry: ${cfg.profiles.tls.expiry}`);
          this.config.signing!.profiles!.tls!.expiry = cfg.profiles.tls.expiry;
        }
      }
    }

    return this;
  }

  setCSR(csr?: CSRConfig): this {
    if (csr === undefined) return this;

    if (csr.cn !== undefined) {
      this.log.debug(`Setting CSR CN: ${csr.cn}`);
      this.config.csr!.cn = csr.cn;
    }

    if (csr.hosts !== undefined) {
      this.log.debug(`Setting CSR hosts: ${csr.hosts}`);
      this.config.csr!.hosts = [...new Set(csr.hosts)];
    }

    if (csr.keyrequest !== undefined) {
      if (csr.keyrequest.algo !== undefined) {
        this.log.debug(
          `Setting CSR key request algorithm: ${csr.keyrequest.algo}`
        );
        this.config.csr!.keyrequest!.algo = csr.keyrequest.algo;
      }
      if (csr.keyrequest.size !== undefined) {
        this.log.debug(`Setting CSR key request size: ${csr.keyrequest.size}`);
        this.config.csr!.keyrequest!.size = csr.keyrequest.size;
      }
    }

    if (csr.names !== undefined) {
      this.log.debug(`Setting CSR names: ${JSON.stringify(csr.names)}`);
      this.config.csr!.names = csr.names;
    }

    if (csr.ca !== undefined) {
      if (csr.ca.expiry !== undefined) {
        this.log.debug(`Setting CSR CA expiry: ${csr.ca.expiry}`);
        this.config.csr!.ca!.expiry = csr.ca.expiry;
      }
      if (csr.ca.pathlength !== undefined) {
        this.log.debug(`Setting CSR CA pathlength: ${csr.ca.pathlength}`);
        this.config.csr!.ca!.pathlength = csr.ca.pathlength;
      }
    }

    return this;
  }

  setIdemix(idemix?: IdemixConfig): this {
    if (idemix === undefined) return this;

    if (idemix.nonceexpiration !== undefined) {
      this.log.debug(
        `Setting Idemix nonce expiration: ${idemix.nonceexpiration}`
      );
      this.config.idemix!.nonceexpiration = idemix.nonceexpiration;
    }

    if (idemix.curve !== undefined) {
      this.log.debug(`Setting Idemix curve: ${idemix.curve}`);
      this.config.idemix!.curve = idemix.curve;
    }

    if (idemix.noncesweepinterval !== undefined) {
      this.log.debug(
        `Setting Idemix noncesweep interval: ${idemix.noncesweepinterval}`
      );
      this.config.idemix!.noncesweepinterval = idemix.noncesweepinterval;
    }

    if (idemix.rhpoolsize !== undefined) {
      this.log.debug(`Setting Idemix rhpoolsize: ${idemix.rhpoolsize}`);
      this.config.idemix!.rhpoolsize = idemix.rhpoolsize;
    }

    return this;
  }

  setBCCSP(bccsp?: BCCSPConfig): this {
    if (bccsp === undefined) return this;

    if (bccsp.default !== undefined) {
      this.log.debug(`Setting default BCCSP: ${bccsp.default}`);
      this.config.bccsp!.default = bccsp.default;
    }

    if (bccsp.sw !== undefined) {
      if (bccsp.sw.hash !== undefined) {
        this.log.debug(`Setting BCCSP hash: ${bccsp.sw.hash}`);
        this.config.bccsp!.sw!.hash = bccsp.sw.hash;
      }

      if (bccsp.sw.security !== undefined) {
        this.log.debug(`Setting BCCSP security: ${bccsp.sw.security}`);
        this.config.bccsp!.sw!.security = bccsp.sw.security;
      }
      if (bccsp.sw.filekeystore !== undefined) {
        if (bccsp.sw.filekeystore.keystore !== undefined) {
          this.log.debug(
            `Setting BCCSP filekeystore keystore: ${bccsp.sw.filekeystore.keystore}`
          );
          this.config.bccsp!.sw!.filekeystore!.keystore =
            bccsp.sw.filekeystore.keystore;
        }
      }
    }

    return this;
  }

  setCACount(count?: number): this {
    if (count !== undefined) {
      this.log.debug(`Setting CA count: ${count}`);
      this.config.cacount = count;
    }
    return this;
  }

  setCAFiles(files?: string[]): this {
    if (files !== undefined) {
      this.log.debug(`Setting CA files: ${files.join(", ")}`);
      this.config.cafiles = files;
    }
    return this;
  }

  setIntermediate(int: IntermediateCAConfig): this {
    if (int === undefined) return this;

    if (int.parentserver !== undefined) {
      if (int.parentserver.url !== undefined) {
        this.log.debug(
          `Setting intermediate CA parent server URL: ${int.parentserver.url}`
        );
        this.config.intermediate!.parentserver!.url = int.parentserver.url;
      }
      if (int.parentserver.caname !== undefined) {
        this.log.debug(
          `Setting intermediate CA parent server caname: ${int.parentserver.caname}`
        );
        this.config.intermediate!.parentserver!.caname =
          int.parentserver.caname;
      }
    }

    if (int.enrollment !== undefined) {
      if (int.enrollment.hosts !== undefined) {
        this.log.debug(
          `Setting intermediate CA enrollment hosts: ${int.enrollment.hosts.join(
            ", "
          )}`
        );
        this.config.intermediate!.enrollment!.hosts = int.enrollment.hosts;
      }
      if (int.enrollment.profile !== undefined) {
        this.log.debug(
          `Setting intermediate CA enrollment profile: ${int.enrollment.profile}`
        );
        this.config.intermediate!.enrollment!.profile = int.enrollment.profile;
      }
      if (int.enrollment.label !== undefined) {
        this.log.debug(
          `Setting intermediate CA enrollment label: ${int.enrollment.label}`
        );
        this.config.intermediate!.enrollment!.label = int.enrollment.label;
      }
    }
    if (int.tls !== undefined) {
      if (int.tls.certfiles !== undefined) {
        this.log.debug(
          `Setting intermediate CA TLS certfiles: ${int.tls.certfiles.join(
            ", "
          )}`
        );
        this.config.intermediate!.tls!.certfiles = int.tls.certfiles;
      }
      if (int.tls.client !== undefined) {
        if (int.tls.client.certfile !== undefined) {
          this.log.debug(
            `Setting intermediate CA TLS client certfile: ${int.tls.client.certfile}`
          );
          this.config.intermediate!.tls!.client!.certfile =
            int.tls.client.certfile;
        }
        if (int.tls.client.keyfile !== undefined) {
          this.log.debug(
            `Setting intermediate CA TLS client keyfile: ${int.tls.client.keyfile}`
          );
          this.config.intermediate!.tls!.client!.keyfile =
            int.tls.client.keyfile;
        }
      }
    }

    return this;
  }

  setPasswordAttempts(attempts?: number): this {
    if (attempts !== undefined) {
      this.log.debug(`Setting password attempts: ${attempts}`);
      this.config.cfg!.identities!.passwordattempts = attempts;
    }
    return this;
  }

  setOperations(operations?: OperationsConfig): this {
    if (operations === undefined) return this;

    if (operations.listenAddress !== undefined) {
      this.log.debug(
        `Setting operations listen address: ${operations.listenAddress}`
      );
      this.config.operations!.listenAddress = operations.listenAddress;
    }
    if (operations.tls !== undefined) {
      if (operations.tls.enabled !== undefined) {
        this.log.debug(
          `Setting operations TLS enabled: ${operations.tls.enabled}`
        );
        this.config.operations!.tls!.enabled = operations.tls.enabled;
      }
      if (operations.tls.cert !== undefined) {
        if (operations.tls.cert.file !== undefined) {
          this.log.debug(
            `Setting operations TLS cert file: ${operations.tls.cert.file}`
          );
          this.config.operations!.tls!.cert!.file = operations.tls.cert.file;
        }
      }
      if (operations.tls.key !== undefined) {
        if (operations.tls.key.file !== undefined) {
          this.log.debug(
            `Setting operations TLS key file: ${operations.tls.key.file}`
          );
          this.config.operations!.tls!.key!.file = operations.tls.key.file;
        }
      }
      if (operations.tls.clientAuthRequired !== undefined) {
        this.log.debug(
          `Setting operations TLS client authentication required: ${operations.tls.clientAuthRequired}`
        );
        this.config.operations!.tls!.clientAuthRequired =
          operations.tls.clientAuthRequired;
      }
      if (operations.tls.clientRootCAs !== undefined) {
        if (operations.tls.clientRootCAs.files !== undefined) {
          this.log.debug(
            `Setting operations TLS client root CAs files: ${operations.tls.clientRootCAs.files.join(
              ", "
            )}`
          );
          this.config.operations!.tls!.clientRootCAs!.files =
            operations.tls.clientRootCAs.files;
        }
      }
    }
    return this;
  }

  setMetrics(metrics?: MetricsConfig): this {
    if (metrics === undefined) return this;

    if (metrics.provider !== undefined) {
      this.log.debug(`Setting metrics provider: ${metrics.provider}`);
      this.config.metrics!.provider = metrics.provider;
    }

    if (metrics.statsd !== undefined) {
      if (metrics.statsd.network !== undefined) {
        this.log.debug(
          `Setting metrics statsd network: ${metrics.statsd.network}`
        );
        this.config.metrics!.statsd!.network = metrics.statsd.network;
      }
      if (metrics.statsd.address !== undefined) {
        this.log.debug(
          `Setting metrics statsd address: ${metrics.statsd.address}`
        );
        this.config.metrics!.statsd!.address = metrics.statsd.address;
      }
      if (metrics.statsd.writeInterval !== undefined) {
        this.log.debug(
          `Setting metrics statsd write interval: ${metrics.statsd.writeInterval}`
        );
        this.config.metrics!.statsd!.writeInterval =
          metrics.statsd.writeInterval;
      }
      if (metrics.statsd.prefix !== undefined) {
        this.log.debug(
          `Setting metrics statsd prefix: ${metrics.statsd.prefix}`
        );
        this.config.metrics!.statsd!.prefix = metrics.statsd.prefix;
      }
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
   * builder.save('/path/to/config/fabric-ca-server.yaml');
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
  save(cpath?: string): this {
    if (cpath === undefined) return this;

    if (!fs.existsSync(path.join(cpath)))
      fs.mkdirSync(path.join(cpath), { recursive: true });

    if (!cpath.endsWith(".yaml"))
      cpath = path.join(cpath, "fabric-ca-server-config.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.debug(`Config file: ${JSON.stringify(this.config, null, 2)}`);
    writeFileYaml(cpath, this.config);

    return this;
  }
}
