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

/**
 * @description Fabric CA Server database types.
 * @summary Enumeration of supported database types for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
export enum FabricCAServerDBType {
  /** SQLite3 database */
  SQLITE3 = "sqlite3",
  /** PostgreSQL database */
  POSTGRES = "postgres",
  /** MySQL database */
  MYSQL = "mysql",
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
