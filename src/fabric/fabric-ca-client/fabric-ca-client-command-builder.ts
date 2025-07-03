import { Logger, Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../constants/fabric-binaries";
import { mapParser } from "../../utils/parsers";
import { runCommand } from "../../utils/child-process";
import { FabricCAClientCommand } from "../constants/fabric-ca-client";
import { COMMA_SEPARATOR } from "../../core/constants/constants";
import {
  CommadCSRConfig,
  EnrollmentConfig,
  IdentityConfig,
  RevokeConfig,
  TLSConfig,
} from "../interfaces/fabric/fabric-ca-client-config";
import {
  FabricCAServerCurveName,
  FabricLogLevel,
} from "../constants/fabric-ca-server";

export class FabricCAClientCommandBuilder {
  private log: Logger;
  private binName: FabricBinaries = FabricBinaries.CLIENT;
  private command: FabricCAClientCommand = FabricCAClientCommand.HELP;
  private args: Map<string, string | boolean | number | string[]> = new Map();

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricCAClientCommandBuilder);
    else this.log = logger.for(FabricCAClientCommandBuilder.name);
  }

  /**
   * @description Sets the command for the Fabric CA Server.
   * @summary Configures the primary action for the Fabric CA Server, such as starting the server or generating certificates.
   * @param {FabricCAServerCommand} [command] - The command to be executed by the Fabric CA Server.
   * @return {this} The current instance of the builder for method chaining.
   */
  setCommand(command?: FabricCAClientCommand): this {
    if (command !== undefined) {
      this.log.debug(`Setting command: ${command}`);
      this.command = command;
    }
    return this;
  }

  setCSR(csr?: CommadCSRConfig): this {
    if (csr === undefined) return this;
    if (csr.cn !== undefined) {
      this.log.debug(`Setting CSR CN: ${csr.cn}`);
      this.args.set("csr.cn", csr.cn);
    }
    if (csr.hosts !== undefined) {
      this.log.debug(`Setting CSR hosts: ${csr.hosts}`);
      this.args.set("csr.hosts", [...new Set(csr.hosts)].join(COMMA_SEPARATOR));
    }
    if (csr.keyrequest !== undefined) {
      if (csr.keyrequest.algo !== undefined) {
        this.log.debug(
          `Setting CSR key request algorithm: ${csr.keyrequest.algo}`
        );
        this.args.set("csr.keyrequest.algo", csr.keyrequest.algo);
      }
      if (csr.keyrequest.size !== undefined) {
        this.log.debug(`Setting CSR key request size: ${csr.keyrequest.size}`);
        this.args.set("csr.keyrequest.size", csr.keyrequest.size);
      }
      if (csr.keyrequest.reusekey !== undefined) {
        this.log.debug(
          `Setting CSR key request reuse key: ${csr.keyrequest.reusekey}`
        );
        this.args.set("csr.keyrequest.reusekey", csr.keyrequest.reusekey);
      }
    }
    if (csr.serialnumber !== undefined) {
      this.log.debug(`Setting CSR serial number: ${csr.serialnumber}`);
      this.args.set("csr.serialnumber", csr.serialnumber);
    }
    if (csr.names !== undefined) {
      this.log.debug(`Setting CSR names: ${csr.names.join(", ")}`);
      this.args.set("csr.names", csr.names.join(COMMA_SEPARATOR));
    }
    return this;
  }
  setHelp(show?: boolean): this {
    if (show !== undefined) {
      this.log.debug(`Setting help flag: ${show}`);
      this.args.set("help", show);
    }
    return this;
  }
  setHome(home?: string): this {
    if (home !== undefined) {
      this.log.debug(`Setting home directory: ${home}`);
      this.args.set("home", home);
    }
    return this;
  }

  setCAName(name?: string): this {
    if (name !== undefined) {
      this.log.debug(`Setting CA name: ${name}`);
      this.args.set("caname", name);
    }
    return this;
  }

  setUrl(url?: string): this {
    if (url !== undefined) {
      this.log.debug(`Setting URL: ${url}`);
      this.args.set("url", url);
    }
    return this;
  }

  setEnrollment(enrollment?: EnrollmentConfig): this {
    if (enrollment === undefined) return this;

    if (enrollment.attrs !== undefined) {
      this.log.debug(
        `Setting enrollment attributes: ${enrollment.attrs.join(", ")}`
      );
      this.args.set("enrollment.attrs", enrollment.attrs.join(COMMA_SEPARATOR));
    }

    if (enrollment.label !== undefined) {
      this.log.debug(`Setting enrollment label: ${enrollment.label}`);
      this.args.set("enrollment.label", enrollment.label);
    }

    if (enrollment.profile !== undefined) {
      this.log.debug(`Setting enrollment profile: ${enrollment.profile}`);
      this.args.set("enrollment.profile", enrollment.profile);
    }

    if (enrollment.type !== undefined) {
      this.log.debug(`Setting enrollment type: ${enrollment.type}`);
      this.args.set("enrollment.type", enrollment.type);
    }

    return this;
  }

  setIdentity(identity?: IdentityConfig): this {
    if (identity === undefined) return this;

    if (identity.affiliation !== undefined) {
      this.log.debug(`Setting identity affiliation: ${identity.affiliation}`);
      this.args.set("id.affiliation", identity.affiliation);
    }

    if (identity.maxenrollments !== undefined) {
      this.log.debug(
        `Setting identity max enrollments: ${identity.maxenrollments}`
      );
      this.args.set("id.maxenrollments", identity.maxenrollments.toString());
    }

    if (identity.name !== undefined) {
      this.log.debug(`Setting identity name: ${identity.name}`);
      this.args.set("id.name", identity.name);
    }

    if (identity.secret !== undefined) {
      this.log.debug(`Setting identity secret: ${identity.secret}`);
      this.args.set("id.secret", identity.secret);
    }

    if (identity.type !== undefined) {
      this.log.debug(`Setting identity type: ${identity.type}`);
      this.args.set("id.type", identity.type);
    }

    if (identity.attrs !== undefined) {
      this.log.debug(
        `Setting identity attributes: ${identity.attrs.join(", ")}`
      );
      this.args.set("id.attrs", identity.attrs.join(COMMA_SEPARATOR));
    }

    return this;
  }

  setIdemixCurve(curve?: FabricCAServerCurveName): this {
    if (curve !== undefined) {
      this.log.debug(`Setting Idemix curve: ${curve}`);
      this.args.set("idemix.curve", curve);
    }

    return this;
  }

  setLogLevel(level: FabricLogLevel): this {
    this.log.debug(`Setting log level: ${level}`);
    this.args.set("loglevel", level);
    return this;
  }

  setMspdir(mspdir?: string): this {
    if (mspdir !== undefined) {
      this.log.debug(`Setting MSP directory: ${mspdir}`);
      this.args.set("mspdir", mspdir);
    }
    return this;
  }

  setMyHost(myHost?: string): this {
    if (myHost !== undefined) {
      this.log.debug(`Setting myhost: ${myHost}`);
      this.args.set("myHost", myHost);
    }
    return this;
  }

  setRevoke(revocation?: RevokeConfig): this {
    if (revocation === undefined) return this;

    if (revocation.aki !== undefined) {
      this.log.debug(`Setting revocation AKI: ${revocation.aki}`);
      this.args.set("revoke.aki", revocation.aki);
    }

    if (revocation.name !== undefined) {
      this.log.debug(`Setting revocation name: ${revocation.name}`);
      this.args.set("revoke.name", revocation.name);
    }

    if (revocation.reason !== undefined) {
      this.log.debug(`Setting revocation reason: ${revocation.reason}`);
      this.args.set("revoke.reason", revocation.reason);
    }

    if (revocation.serial !== undefined) {
      this.log.debug(`Setting revocation serial: ${revocation.serial}`);
      this.args.set("revoke.serial", revocation.serial);
    }

    return this;
  }

  setTLS(tls?: TLSConfig): this {
    if (tls === undefined) return this;

    if (tls.certfiles !== undefined) {
      this.log.debug(`Setting TLS certfiles: ${tls.certfiles.join(", ")}`);
      this.args.set("tls.certfiles", tls.certfiles.join(COMMA_SEPARATOR));
    }

    if (tls.client !== undefined) {
      if (tls.client.certfile !== undefined) {
        this.log.debug(`Setting TLS client certfile: ${tls.client.certfile}`);
        this.args.set("tls.client.certfile", tls.client.certfile);
      }
      if (tls.client.keyfile !== undefined) {
        this.log.debug(`Setting TLS client keyfile: ${tls.client.keyfile}`);
        this.args.set("tls.client.keyfile", tls.client.keyfile);
      }
    }

    return this;
  }

  build(): string {
    const command: string = [
      this.getBinary(),
      this.getCommand(),
      ...mapParser(this.args),
    ].join(" ");
    this.log.debug(`Built command: ${command}`);
    return command;
  }
  getCommand(): string {
    return this.command;
  }
  getBinary(): string {
    return this.binName;
  }
  getArgs(): string[] {
    return mapParser(this.args);
  }
  async execute(): Promise<void> {
    const bin = this.getBinary();
    const argz = [this.getCommand(), ...this.getArgs()];

    // const regex = /\[\s*INFO\s*\] Listening on http/;
    // can be used as a promise but to lock the logs running as execsync
    await runCommand(bin, argz);
  }
}

//TODO: LATER IMPLEMENT
// Identity Command¶
// Manage identities

// Usage:
//   fabric-ca-client identity [command]

// Available Commands:
//   add         Add identity
//   list        List identities
//   modify      Modify identity
//   remove      Remove identity

// Flags:
//   -h, --help   help for identity

// -----------------------------

// Add an identity

// Usage:
//   fabric-ca-client identity add <id> [flags]

// Examples:
// fabric-ca-client identity add user1 --type peer

// Flags:
//       --affiliation string   The identity's affiliation
//       --attrs strings        A list of comma-separated attributes of the form <name>=<value> (e.g. foo=foo1,bar=bar1)
//   -h, --help                 help for add
//       --json string          JSON string for adding a new identity
//       --maxenrollments int   The maximum number of times the secret can be reused to enroll (default CA's Max Enrollment)
//       --secret string        The enrollment secret for the identity being added
//       --type string          Type of identity being registered (e.g. 'peer, app, user') (default "user")

// -----------------------------

// List identities visible to caller

// Usage:
//   fabric-ca-client identity list [flags]

// Flags:
//   -h, --help        help for list
//       --id string   Get identity information from the fabric-ca server

// -----------------------------

// Modify an existing identity

// Usage:
//   fabric-ca-client identity modify <id> [flags]

// Examples:
// fabric-ca-client identity modify user1 --type peer

// Flags:
//       --affiliation string   The identity's affiliation
//       --attrs strings        A list of comma-separated attributes of the form <name>=<value> (e.g. foo=foo1,bar=bar1)
//   -h, --help                 help for modify
//       --json string          JSON string for modifying an existing identity
//       --maxenrollments int   The maximum number of times the secret can be reused to enroll
//       --secret string        The enrollment secret for the identity
//       --type string          Type of identity being registered (e.g. 'peer, app, user')

// -----------------------------

// Remove an identity

// Usage:
//   fabric-ca-client identity remove <id> [flags]

// Examples:
// fabric-ca-client identity remove user1

// Flags:
//       --force   Forces removing your own identity
//   -h, --help    help for remove
// Affiliation Command¶
// Manage affiliations

// Usage:
//   fabric-ca-client affiliation [command]

// Available Commands:
//   add         Add affiliation
//   list        List affiliations
//   modify      Modify affiliation
//   remove      Remove affiliation

// Flags:
//   -h, --help   help for affiliation

// -----------------------------

// Add affiliation

// Usage:
//   fabric-ca-client affiliation add <affiliation> [flags]

// Flags:
//       --force   Creates parent affiliations if they do not exist
//   -h, --help    help for add

// -----------------------------

// List affiliations visible to caller

// Usage:
//   fabric-ca-client affiliation list [flags]

// Flags:
//       --affiliation string   Get affiliation information from the fabric-ca server
//   -h, --help                 help for list

// -----------------------------

// Modify existing affiliation

// Usage:
//   fabric-ca-client affiliation modify <affiliation> [flags]

// Flags:
//       --force         Forces identities using old affiliation to use new affiliation
//   -h, --help          help for modify
//       --name string   Rename the affiliation

// -----------------------------

// Remove affiliation

// Usage:
//   fabric-ca-client affiliation remove <affiliation> [flags]

// Flags:
//       --force   Forces removal of any child affiliations and any identities associated with removed affiliations
//   -h, --help    help for remove
// Certificate Command¶
// Manage certificates

// Usage:
//   fabric-ca-client certificate [command]

// Available Commands:
//   list        List certificates

// Flags:
//   -h, --help   help for certificate

// -----------------------------

// List all certificates which are visible to the caller and match the flags

// Usage:
//   fabric-ca-client certificate list [flags]

// Examples:
// fabric-ca-client certificate list --id admin --expiration 2018-01-01::2018-01-30
// fabric-ca-client certificate list --id admin --expiration 2018-01-01T01:30:00z::2018-01-30T11:30:00z
// fabric-ca-client certificate list --id admin --expiration -30d::-15d

// Flags:
//       --aki string          Get certificates for this AKI
//       --expiration string   Get certificates which expire between the UTC timestamp (RFC3339 format) or duration specified (e.g. <begin_time>::<end_time>)
//   -h, --help                help for list
//       --id string           Get certificates for this enrollment ID
//       --notexpired          Don't return expired certificates
//       --notrevoked          Don't return revoked certificates
//       --revocation string   Get certificates that were revoked between the UTC timestamp (RFC3339 format) or duration specified (e.g. <begin_time>::<end_time>)
//       --serial string       Get certificates for this serial number
//       --store string        Store requested certificates in this location
