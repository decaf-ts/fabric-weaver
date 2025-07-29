/**
 * @enum {string}
 * @description Enumeration of available Fabric CA Client commands.
 * @summary This enum represents all the possible commands that can be executed using the Fabric CA Client.
 */
export enum FabricCAClientCommand {
  /** Manage affiliations */
  AFFILIATION = "affiliation",

  /** Manage certificates */
  CERTIFICATE = "certificate",

  /** Generate the autocompletion script for the specified shell */
  COMPLETION = "completion",

  /** Enroll an identity */
  ENROLL = "enroll",

  /** Generate a CRL (Certificate Revocation List) */
  GENCRL = "gencrl",

  /** Generate a CSR (Certificate Signing Request) */
  GENCSR = "gencsr",

  /** Get CA certificate chain and Idemix public key */
  GETCAINFO = "getcainfo",

  /** Help about any command */
  HELP = "help",

  /** Manage identities */
  IDENTITY = "identity",

  /** Reenroll an identity */
  REENROLL = "reenroll",

  /** Register an identity */
  REGISTER = "register",

  /** Revoke an identity */
  REVOKE = "revoke",

  /** Prints Fabric CA Client version */
  VERSION = "version",
}
