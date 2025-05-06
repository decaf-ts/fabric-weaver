import { Logging } from "@decaf-ts/logging";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import { FabricLogLevel } from "../general/constants";
import {
  FabricCAServerCommand,
  FabricCAServerCurveName,
  FabricCAServerDBType,
  FabricCAServerEnrollmentType,
} from "./constants";
import { FabricCAServerConfig } from "./fabric-ca-server-config";
import path from "path";
import fs from "fs";

// Use "fabric-ca-server [command] --help" for more information about a command.
export class FabricCAServerCommandBuilder {
  private log = Logging.for(FabricCAServerCommandBuilder);

  private args: Map<string, string | boolean | number | string[]> = new Map();
  private command: FabricCAServerCommand = FabricCAServerCommand.START;

  private config: FabricCAServerConfig = readFileYaml<FabricCAServerConfig>(
    path.join(__dirname, "../../../config/fabric-ca-server.yaml")
  ) as FabricCAServerConfig;

  // Command setter
  setCommand(command?: FabricCAServerCommand): this {
    if (command !== undefined) {
      this.log.debug(`Setting command: ${command}`);
      this.command = command;
    }
    return this;
  }

  // Basic configuration
  setAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting address: ${address}`);
      this.args.set("address", address);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  setPort(port?: number): this {
    if (port !== undefined) {
      this.log.debug(`Setting port: ${port}`);
      this.args.set("port", port);
      this.config.port = port;
    }
    return this;
  }

  setHomeDirectory(home?: string): this {
    if (home !== undefined) {
      this.log.debug(`Setting home directory: ${home}`);
      this.args.set("home", home);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  setLogLevel(level?: FabricLogLevel): this {
    if (level !== undefined) {
      this.args.set("loglevel", level);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  enableDebug(enable?: boolean): this {
    if (enable !== undefined) {
      this.log.debug(`Setting debug: ${enable}`);
      this.args.set("debug", enable);
      this.config.debug = enable;
    }
    return this;
  }

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

  setAffiliationsAllowRemove(allow?: boolean): this {
    if (allow !== undefined) {
      this.log.debug(`Setting affiliations allow remove: ${allow}`);
      this.args.set("cfg.affiliations.allowremove", allow);
      // this.config.cfg.affiliations = this.config.cfg.affiliations || {};
      // this.config.cfg.affiliations.allowremove = allow;
    }
    return this;
  }

  setIdentitiesAllowRemove(allow?: boolean): this {
    if (allow !== undefined) {
      this.log.debug(`Setting identities allow remove: ${allow}`);
      this.args.set("cfg.identities.allowremove", allow);
      // this.config.cfg.identities = this.config.cfg.identities || {};
      // this.config.cfg.identities.allowremove = allow;
    }
    return this;
  }

  setIdentitiesPasswordAttempts(attempts?: number): this {
    if (attempts !== undefined) {
      this.log.debug(`Setting identities password attempts: ${attempts}`);
      this.args.set("cfg.identities.passwordattempts", attempts);
      this.config.cfg.identities = this.config.cfg.identities || {};
      this.config.cfg.identities.passwordattempts = attempts;
    }
    return this;
  }

  setCRLExpiry(expiry?: string): this {
    if (expiry !== undefined) {
      this.log.debug(`Setting CRL expiry: ${expiry}`);
      this.args.set("crl.expiry", expiry);
      this.config.crl = this.config.crl || {};
      this.config.crl.expiry = expiry;
    }
    return this;
  }

  setCRLSizeLimit(limit?: number): this {
    if (limit !== undefined) {
      this.log.debug(`Setting CRL size limit: ${limit}`);
      this.args.set("crlsizelimit", limit);
      this.config.crlsizelimit = limit;
    }
    return this;
  }

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

  // CA configuration
  setCACertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.args.set("ca.certfile", certfile);
      this.config.ca.certfile = certfile;
    }
    return this;
  }

  setCAKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.args.set("ca.keyfile", keyfile);
      this.config.ca.keyfile = keyfile;
    }
    return this;
  }

  setCAName(name?: string): this {
    if (name !== undefined) {
      this.log.debug(`Setting CA name: ${name}`);
      this.args.set("ca.name", name);
      this.config.ca.name = name;
    }
    return this;
  }

  setCAChainFile(chainfile?: string): this {
    if (chainfile !== undefined) {
      this.args.set("ca.chainfile", chainfile);
      this.config.ca.chainfile = chainfile;
    }
    return this;
  }

  setCAReenrollIgnoreCertExpiry(ignore?: boolean): this {
    if (ignore !== undefined) {
      this.args.set("ca.reenrollignorecertexpiry", ignore);
      this.config.ca.reenrollIgnoreCertExpiry = ignore;
    }
    return this;
  }

  setCACount(count?: number): this {
    if (count !== undefined) {
      this.log.debug(`Setting CA count: ${count}`);
      this.args.set("cacount", count);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  setCAFiles(files?: string[]): this {
    if (files !== undefined && files.length > 0) {
      this.log.debug(`Setting CA configuration files: ${files.join(", ")}`);
      this.args.set("cafiles", files);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  setCAProfile(maxpathlength?: number): this {
    if (maxpathlength !== undefined) {
      this.log.debug(`Setting CA max path length: ${maxpathlength}`);
      this.config.signing.profiles.ca.caconstraint.maxpathlen = maxpathlength;
    }
    return this;
  }

  setOperationsListenAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting operations listen address: ${address}`);
      this.config.operations.listenAddress = address;
    }
    return this;
  }

  setMetricsListenAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting metrics listen address: ${address}`);
      this.config.metrics.statsd.address = address;
    }
    return this;
  }

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

  // TLS configuration
  enableTLS(enabled?: boolean): this {
    if (enabled !== undefined) {
      this.log.debug(`Setting TLS enabled: ${enabled}`);
      this.args.set("tls.enabled", enabled);
      this.config.tls.enabled = enabled;
    }
    return this;
  }

  setTLSCertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.log.debug(`Setting TLS cert file: ${certfile}`);
      this.args.set("tls.certfile", certfile);
      this.config.tls.certfile = certfile;
    }
    return this;
  }

  setTLSKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.log.debug(`Setting TLS key file: ${keyfile}`);
      this.args.set("tls.keyfile", keyfile);
      this.config.tls.keyfile = keyfile;
    }
    return this;
  }

  setTLSClientAuthType(type?: string): this {
    if (type !== undefined) {
      this.log.debug(`Setting TLS client auth type: ${type}`);
      this.args.set("tls.clientauth.type", type);
      this.config.tls.clientauth.type = type;
    }
    return this;
  }

  setTLSClientAuthCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined) {
      this.log.debug(`Setting TLS client auth cert files: ${certfiles}`);
      this.args.set("tls.clientauth.certfiles", certfiles);
      this.config.tls.clientauth.certfiles = certfiles;
    }
    return this;
  }

  // LDAP configuration
  enableLDAP(enabled?: boolean): this {
    if (enabled !== undefined) {
      this.log.debug(`Setting LDAP enabled: ${enabled}`);
      this.args.set("ldap.enabled", enabled);
      this.config.ldap.enabled = enabled;
    }
    return this;
  }

  setLDAPURL(url?: string): this {
    if (url !== undefined) {
      this.log.debug(`Setting LDAP URL: ${url}`);
      this.args.set("ldap.url", url);
      this.config.ldap.url = url;
    }
    return this;
  }

  setLDAPUserFilter(filter?: string): this {
    if (filter !== undefined) {
      this.log.debug(`Setting LDAP user filter: ${filter}`);
      this.args.set("ldap.userfilter", filter);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  setLDAPGroupFilter(filter?: string): this {
    if (filter !== undefined) {
      this.log.debug(`Setting LDAP group filter: ${filter}`);
      this.args.set("ldap.groupfilter", filter);
      // Note: Not present in the FabricCAServerConfig interface.
    }
    return this;
  }

  setLDAPAttributeNames(names?: string[]): this {
    if (names !== undefined) {
      this.log.debug(`Setting LDAP attribute names: ${names}`);
      this.args.set("ldap.attribute.names", names);
      this.config.ldap.attribute.names = names;
    }
    return this;
  }

  setLDAPTLSCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined && certfiles.length > 0) {
      this.log.debug(`Setting LDAP TLS cert files: ${certfiles.join(", ")}`);
      this.args.set("ldap.tls.certfiles", certfiles);
      this.config.ldap.tls.certfiles = certfiles;
    }
    return this;
  }

  setLDAPTLSClientCertFile(certfile?: string): this {
    if (certfile !== undefined) {
      this.log.debug(`Setting LDAP TLS client cert file: ${certfile}`);
      this.args.set("ldap.tls.client.certfile", certfile);
      this.config.ldap.tls.client.certfile = certfile;
    }
    return this;
  }

  setLDAPTLSClientKeyFile(keyfile?: string): this {
    if (keyfile !== undefined) {
      this.log.debug(`Setting LDAP TLS client key file: ${keyfile}`);
      this.args.set("ldap.tls.client.keyfile", keyfile);
      this.config.ldap.tls.client.keyfile = keyfile;
    }
    return this;
  }

  // Database configuration
  setDBType(type?: FabricCAServerDBType): this {
    if (type !== undefined) {
      this.log.debug(`Setting DB type: ${type}`);
      this.args.set("db.type", type);
      this.config.db.type = type;
    }
    return this;
  }

  setDBDataSource(datasource?: string): this {
    if (datasource !== undefined) {
      this.log.debug(`Setting DB data source: ${datasource}`);
      this.args.set("db.datasource", datasource);
      this.config.db.datasource = datasource;
    }
    return this;
  }

  setDBTLSCertFiles(certfiles?: string[]): this {
    if (certfiles !== undefined && certfiles.length > 0) {
      this.log.debug(`Setting DB TLS cert files: ${certfiles.join(", ")}`);
      this.args.set("db.tls.certfiles", certfiles);
      this.config.db.tls = this.config.db.tls || {};
      this.config.db.tls.certfiles = certfiles;
    }
    return this;
  }

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

  // CSR configuration
  setCSRCommonName(cn?: string): this {
    if (cn !== undefined) {
      this.log.debug(`Setting CSR common name: ${cn}`);
      this.args.set("csr.cn", cn);
      this.config.csr.cn = cn;
    }
    return this;
  }

  setCSRHosts(hosts?: string[]): this {
    if (hosts !== undefined) {
      this.log.debug(`Setting CSR hosts: ${hosts}`);
      this.args.set("csr.hosts", hosts);
      this.config.csr.hosts = hosts;
    }
    return this;
  }

  setCSRKeyRequestAlgo(algo?: string): this {
    if (algo !== undefined) {
      this.log.debug(`Setting CSR key request algorithm: ${algo}`);
      this.args.set("csr.keyrequest.algo", algo);
      this.config.csr.keyrequest = this.config.csr.keyrequest || {};
      this.config.csr.keyrequest.algo = algo;
    }
    return this;
  }

  setCSRKeyRequestReuseKey(reuse?: boolean): this {
    if (reuse !== undefined) {
      this.log.debug(`Setting CSR key request reuse key: ${reuse}`);
      this.args.set("csr.keyrequest.reusekey", reuse);
      // this.config.csr.keyrequest = this.config.csr.keyrequest || {};
      // this.config.csr.keyrequest.reusekey = reuse;
    }
    return this;
  }

  setCSRKeyRequestSize(size?: number): this {
    if (size !== undefined) {
      this.log.debug(`Setting CSR key request size: ${size}`);
      this.args.set("csr.keyrequest.size", size);
      this.config.csr.keyrequest = this.config.csr.keyrequest || {};
      this.config.csr.keyrequest.size = size;
    }
    return this;
  }

  setCSRSerialNumber(serialNumber?: string): this {
    if (serialNumber !== undefined) {
      this.log.debug(`Setting CSR serial number: ${serialNumber}`);
      this.args.set("csr.serialnumber", serialNumber);
      // this.config.csr.serialnumber = serialNumber;
    }
    return this;
  }

  // Intermediate CA configuration
  setIntermediateParentServerURL(url?: string): this {
    if (url !== undefined) {
      this.log.debug(`Setting intermediate parent server URL: ${url}`);
      this.args.set("intermediate.parentserver.url", url);
      this.config.intermediate.parentserver.url = url;
    }
    return this;
  }

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

  // Registry configuration
  setRegistryMaxEnrollments(max?: number): this {
    if (max !== undefined) {
      this.log.debug(`Setting registry max enrollments: ${max}`);
      this.args.set("registry.maxenrollments", max);
      this.config.registry.maxenrollments = max;
    }
    return this;
  }

  // idemix configuration
  setIdemixCurve(curve?: FabricCAServerCurveName): this {
    if (curve !== undefined) {
      this.log.debug(`Setting idemix curve: ${curve}`);
      this.args.set("idemix.curve", curve);
      this.config.idemix.curve = curve;
    }
    return this;
  }

  setIdemixNonceExpiration(duration?: string): this {
    if (duration !== undefined) {
      this.log.debug(`Setting Idemix nonce expiration: ${duration}`);
      this.args.set("idemix.nonceexpiration", duration);
      this.config.idemix = this.config.idemix || {};
      this.config.idemix.nonceexpiration = duration;
    }
    return this;
  }

  setIdemixNonceSweepInterval(interval?: string): this {
    if (interval !== undefined) {
      this.log.debug(`Setting Idemix nonce sweep interval: ${interval}`);
      this.args.set("idemix.noncesweepinterval", interval);
      this.config.idemix = this.config.idemix || {};
      this.config.idemix.noncesweepinterval = interval;
    }
    return this;
  }

  setIdemixRHPoolSize(size?: number): this {
    if (size !== undefined) {
      this.log.debug(`Setting Idemix revocation handle pool size: ${size}`);
      this.args.set("idemix.rhpoolsize", size);
      this.config.idemix = this.config.idemix || {};
      this.config.idemix.rhpoolsize = size;
    }
    return this;
  }

  // CORS configuration
  enableCORS(enabled?: boolean): this {
    if (enabled !== undefined) {
      this.log.debug(`Setting CORS enabled: ${enabled}`);
      this.args.set("cors.enabled", enabled);
      this.config.cors.enabled = enabled;
    }
    return this;
  }

  setCORSOrigins(origins?: string[]): this {
    if (origins !== undefined) {
      this.log.debug(`Setting CORS origins: ${origins}`);
      this.args.set("cors.origins", origins);
      this.config.cors.origins = origins;
    }
    return this;
  }

  saveConfig(cpath: string): this {
    if (cpath === undefined) return this;

    if (!fs.existsSync(path.join(cpath)))
      fs.mkdirSync(path.join(cpath), { recursive: true });

    if (!cpath.endsWith(".yaml"))
      cpath = path.join(cpath, "fabric-ca-server.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.verbose(`Config file: ${JSON.stringify(this.config)}`, 3);
    writeFileYaml(cpath, this.config);

    return this;
  }

  build(): string {
    const commandArray: string[] = ["fabric-ca-server", this.command];

    this.args.forEach((value, key) => {
      if (typeof value === "boolean") {
        if (value) commandArray.push(`--${key}`);
      } else if (Array.isArray(value)) {
        commandArray.push(`--${key}`, value.join(","));
      } else {
        commandArray.push(`--${key}`, value.toString());
      }
    });

    return commandArray.join(" ");
  }
}
