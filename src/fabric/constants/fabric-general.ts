/**
 * @description Fabric account types.
 * @summary Enumeration of supported account types in Hyperledger Fabric.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-general
 */
export enum FabricAccountType {
  /** Client account type */
  CLIENT = "client",
  /** Peer account type */
  PEER = "peer",
  /** Orderer account type */
  ORDERER = "orderer",
  /** Admin account type */
  ADMIN = "admin",
  /** User account type */
  USER = "user",
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
