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

export function getAccountType(type: string): FabricAccountType {
  switch (type.toLowerCase()) {
    case "client":
      return FabricAccountType.CLIENT;
    case "peer":
      return FabricAccountType.PEER;
    case "orderer":
      return FabricAccountType.ORDERER;
    case "user":
      return FabricAccountType.USER;
    case "admin":
    default:
      return FabricAccountType.ADMIN;
  }
}
