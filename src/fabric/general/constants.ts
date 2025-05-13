/**
 * @description Log levels for Fabric components.
 * @summary Enumeration of available log levels for Hyperledger Fabric components.
 * These levels determine the verbosity and type of information logged by the system.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-general
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

export enum FabricBinaries {
  CLIENT = "fabric-ca-client",
  SERVER = "fabric-ca-server",
  ORDERER = "orderer",
  PEER = "peer",
}
