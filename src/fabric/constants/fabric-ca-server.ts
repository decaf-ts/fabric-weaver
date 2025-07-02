/**
 * @description Fabric CA Server command options.
 * @summary Enumeration of available commands for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
export enum FabricCAServerCommand {
  /** Generate bash completion script */
  COMPLETION = "completion",
  /** Show help */
  HELP = "help",
  /** Initialize the Fabric CA server */
  INIT = "init",
  /** Start the Fabric CA server */
  START = "start",
  /** Show version information */
  VERSION = "version",
}

export enum ClientAuthType {
  NoClientCert = "noclientcert",
  RequestClientCert = "requestclientcert",
  RequireAnyClientCert = "requireanyclientcert",
  VerifyClientCertIfGiven = "verifyclientcertifgiven",
  RequireAndVerifyClientCert = "requireandverifyclientcert",
}

/**
 * @description Fabric CA Server database types.
 * @summary Enumeration of supported database types for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
export enum FabricCAServerDBTypes {
  /** SQLite3 database */
  SQLITE3 = "sqlite3",
  /** PostgreSQL database */
  POSTGRES = "postgres",
  /** MySQL database */
  MYSQL = "mysql",
}

/**
 * @description Log levels for Fabric components.
 * @summary Enumeration of available log levels for Hyperledger Fabric components.
 * These levels determine the verbosity and type of information logged by the system.
 * @enum {string}
 * @readonly
 */
export enum FabricLogLevel {
  /** Standard information messages */
  INFO = "info",
  /** Warning messages for potential issues */
  WARNING = "warning",
  /** Detailed debugging information */
  DEBUG = "debug",
  /** Error messages for issues that don't stop execution */
  ERROR = "error",
  /** Fatal error messages that may stop execution */
  FATAL = "fatal",
  /** Critical error messages that require immediate attention */
  CRITICAL = "critical",
}

/**
 * @description Fabric CA Server elliptic curve names.
 * @summary Enumeration of supported elliptic curves for cryptographic operations in the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
export enum FabricCAServerCurveName {
  /** AMCL Fp256bn curve */
  FP256BN = "amcl.Fp256bn",
  /** Gurvy Bn254 curve */
  BN254 = "gurvy.Bn254",
  /** AMCL Fp256Miraclbn curve */
  FP256MIRACLBN = "amcl.Fp256Miraclbn",
}

/**
 * @description Fabric CA Server enrollment types.
 * @summary Enumeration of supported enrollment types for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
export enum FabricCAServerEnrollmentType {
  /** X.509 certificate-based enrollment */
  X509 = "x509",
  /** Identity Mixer (Idemix) credential-based enrollment */
  IDEMIX = "idemix",
}
