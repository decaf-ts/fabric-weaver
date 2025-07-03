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
