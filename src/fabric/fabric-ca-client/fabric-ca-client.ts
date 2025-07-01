import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../general-utils/constants";
import { FabricCAClientCommand } from "./constants";
import { runCommand } from "../../utils-old/child-process";
import { getAccountType } from "../general-utils/fabric-account-types";
import fs from "fs";

//TODO: Implement the subcommands for each Fabric CA Client commands
// reference page https://hyperledger-fabric-ca.readthedocs.io/en/latest/clientcli.html

export class FabricCAClientCommandBuilder {
  protected log: Logger = Logging.for(FabricCAClientCommandBuilder);
  protected binName: FabricBinaries = FabricBinaries.CLIENT;
  protected flags: Map<string, string | boolean | number | string[]> =
    new Map();

  protected command: FabricCAClientCommand = FabricCAClientCommand.HELP;

  // Command setters
  setCommand(command: FabricCAClientCommand): FabricCAClientCommandBuilder {
    this.command = command;
    this.log.debug(`Setting command: ${command}`);
    return this;
  }

  // Flag setters
  setCAName(name: string): FabricCAClientCommandBuilder {
    this.flags.set("caname", name);
    return this;
  }

  setCSRCommonName(cn: string): FabricCAClientCommandBuilder {
    this.flags.set("csr.cn", cn);
    return this;
  }

  setCSRHosts(hosts?: string[]): FabricCAClientCommandBuilder {
    if (hosts !== undefined) {
      this.log.debug(`Setting CSR hosts: ${hosts}`);
      this.flags.set("csr.hosts", hosts.join(","));
    }
    return this;
  }

  setCSRKeyRequestAlgo(algo: string): FabricCAClientCommandBuilder {
    this.flags.set("csr.keyrequest.algo", algo);
    return this;
  }

  setCSRKeyRequestReuseKey(reuse: boolean): FabricCAClientCommandBuilder {
    this.flags.set("csr.keyrequest.reusekey", reuse);
    return this;
  }

  setCSRKeyRequestSize(size: number): FabricCAClientCommandBuilder {
    this.flags.set("csr.keyrequest.size", size);
    return this;
  }

  setCSRNames(names: string[]): FabricCAClientCommandBuilder {
    this.flags.set("csr.names", names);
    return this;
  }

  setCSRSerialNumber(serialNumber: string): FabricCAClientCommandBuilder {
    this.flags.set("csr.serialnumber", serialNumber);
    return this;
  }

  setEnrollmentAttrs(attrs: string[]): FabricCAClientCommandBuilder {
    this.flags.set("enrollment.attrs", attrs);
    return this;
  }

  setEnrollmentLabel(label: string): FabricCAClientCommandBuilder {
    this.flags.set("enrollment.label", label);
    return this;
  }

  setEnrollmentProfile(profile: string): FabricCAClientCommandBuilder {
    this.flags.set("enrollment.profile", profile);
    return this;
  }

  setEnrollmentType(type: string): FabricCAClientCommandBuilder {
    this.flags.set("enrollment.type", type);
    return this;
  }

  setHome(home?: string): FabricCAClientCommandBuilder {
    if (home !== undefined) {
      this.log.debug(`Setting home directory: ${home}`);
      this.flags.set("home", home);
    }
    return this;
  }

  /**
   * @description Enables the help flag for the Fabric CA Client command.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  enableHelp(): FabricCAClientCommandBuilder {
    this.flags.set("help", true);
    return this;
  }

  /**
   * @description Sets the identity's affiliation.
   * @param {string} affiliation - The identity's affiliation.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdAffiliation(affiliation: string): FabricCAClientCommandBuilder {
    this.flags.set("id.affiliation", affiliation);
    return this;
  }

  /**
   * @description Sets the identity's attributes.
   * @param {string[]} attrs - A list of attributes in the form <name>=<value>.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdAttributes(attrs?: string): FabricCAClientCommandBuilder {
    if (attrs !== undefined) {
      this.log.debug(`Setting ID Attributes: ${attrs}`);
      this.flags.set("id.attrs", attrs);
    }
    return this;
  }

  /**
   * @description Sets the maximum number of times the secret can be reused to enroll.
   * @param {number} maxEnrollments - The maximum number of enrollments.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdMaxEnrollments(maxEnrollments: number): FabricCAClientCommandBuilder {
    this.flags.set("id.maxenrollments", maxEnrollments);
    return this;
  }

  /**
   * @description Sets the unique name of the identity.
   * @param {string} name - The unique name of the identity.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdName(name?: string): FabricCAClientCommandBuilder {
    if (name !== undefined) {
      this.log.debug(`Setting ID Name: ${name}`);
      this.flags.set("id.name", name);
    }
    return this;
  }

  /**
   * @description Sets the enrollment secret for the identity being registered.
   * @param {string} secret - The enrollment secret.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdSecret(secret?: string): FabricCAClientCommandBuilder {
    if (secret !== undefined) {
      this.log.debug(`Setting ID Secret: ${secret}`);
      this.flags.set("id.secret", secret);
    }
    return this;
  }

  /**
   * @description Sets the type of identity being registered.
   * @param {string} type - The type of identity (e.g. 'peer', 'app', 'user').
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdType(type?: string): FabricCAClientCommandBuilder {
    if (type !== undefined) {
      type = getAccountType(type);
      this.log.debug(`Setting ID Type: ${type}`);
      this.flags.set("id.type", type);
    }

    return this;
  }

  /**
   * @description Sets the identity mixer curve ID to use.
   * @param {string} curve - The curve ID ('amcl.Fp256bn', 'gurvy.Bn254', or 'amcl.Fp256Miraclbn').
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setIdemixCurve(curve: string): FabricCAClientCommandBuilder {
    this.flags.set("idemix.curve", curve);
    return this;
  }

  /**
   * @description Sets the logging level.
   * @param {string} level - The log level (info, warning, debug, error, fatal, critical).
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setLogLevel(level: string): FabricCAClientCommandBuilder {
    this.flags.set("loglevel", level);
    return this;
  }

  /**
   * @description Sets the Membership Service Provider directory.
   * @param {string} dir - The MSP directory path.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setMSPDir(dir?: string): FabricCAClientCommandBuilder {
    if (dir !== undefined) {
      this.log.debug(`Setting MSP directory: ${dir}`);
      this.flags.set("mspdir", dir);
    }
    return this;
  }

  /**
   * @description Sets the hostname to include in the certificate signing request during enrollment.
   * @param {string} hostname - The hostname to include.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setMyHost(hostname: string): FabricCAClientCommandBuilder {
    this.flags.set("myhost", hostname);
    return this;
  }

  /**
   * @description Sets the AKI (Authority Key Identifier) of the certificate to be revoked.
   * @param {string} aki - The AKI of the certificate.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setRevokeAKI(aki: string): FabricCAClientCommandBuilder {
    this.flags.set("revoke.aki", aki);
    return this;
  }

  /**
   * @description Sets the identity whose certificates should be revoked.
   * @param {string} name - The name of the identity to revoke.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setRevokeName(name: string): FabricCAClientCommandBuilder {
    this.flags.set("revoke.name", name);
    return this;
  }

  /**
   * @description Sets the reason for revocation.
   * @param {string} reason - The reason for revocation.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setRevokeReason(reason: string): FabricCAClientCommandBuilder {
    this.flags.set("revoke.reason", reason);
    return this;
  }

  /**
   * @description Sets the serial number of the certificate to be revoked.
   * @param {string} serial - The serial number of the certificate.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setRevokeSerial(serial: string): FabricCAClientCommandBuilder {
    this.flags.set("revoke.serial", serial);
    return this;
  }

  /**
   * @description Sets the list of PEM-encoded trusted certificate files.
   * @param {string[]} certfiles - An array of paths to trusted certificate files.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setTLSCertFiles(certfiles?: string[]): FabricCAClientCommandBuilder {
    if (certfiles !== undefined) {
      this.log.debug(
        `Setting TLS certificate files to ${certfiles} (length: ${certfiles.length})`
      );
      this.flags.set("tls.certfiles", certfiles.join(","));
    }
    return this;
  }

  /**
   * @description Sets the PEM-encoded certificate file for mutual authentication.
   * @param {string} certfile - The path to the client certificate file.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setTLSClientCertFile(certfile: string): FabricCAClientCommandBuilder {
    this.flags.set("tls.client.certfile", certfile);
    return this;
  }

  /**
   * @description Sets the PEM-encoded key file for mutual authentication.
   * @param {string} keyfile - The path to the client key file.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setTLSClientKeyFile(keyfile: string): FabricCAClientCommandBuilder {
    this.flags.set("tls.client.keyfile", keyfile);
    return this;
  }

  /**
   * @description Sets the URL of the Fabric CA server.
   * @param {string} url - The URL of the Fabric CA server.
   * @returns {FabricCAClientCommandBuilder} The current instance for method chaining.
   */
  setURL(url?: string): FabricCAClientCommandBuilder {
    if (url !== undefined) {
      this.log.debug(`Setting URL to ${url}`);
      this.flags.set("url", url);
    }
    return this;
  }

  build(): string[] | Array<Array<string>> {
    const commandArray: string[] = [this.getBinary(), this.command];

    this.flags.forEach((value, key) => {
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

  changeKeyName(pathToMSPDir?: string): FabricCAClientCommandBuilder {
    if (pathToMSPDir !== undefined) {
      try {
        const pathToKeystore = pathToMSPDir + "/keystore";
        const fileList = fs.readdirSync(pathToKeystore);
        const currentName = `${pathToKeystore}/${fileList[0]}`;
        const finalName = `${pathToKeystore}/key.pem`;
        fs.renameSync(currentName, finalName);
      } catch (error: unknown) {
        this.log.error(
          `Error: Failed to rename the key file in the MSP directory: ${error}`
        );
      }
    }

    return this;
  }

  getCommand(): string {
    return this.command;
  }

  getBinary(): string {
    return this.binName;
  }

  getArgs(): string[] {
    const argsArray: string[] = [];

    this.flags.forEach((value, key) => {
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
    const regex =
      /(\[\s*INFO\s*\] Stored Issuer revocation|Configuration file location:)/;

    await runCommand(bin, argz, {}, regex);
  }
}
