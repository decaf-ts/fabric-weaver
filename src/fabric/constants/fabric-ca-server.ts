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
