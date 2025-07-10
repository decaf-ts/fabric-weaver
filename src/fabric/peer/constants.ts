export enum PeerCommands {
  CHAINCODE = "chaincode",
  CHANNEL = "channel",
  NODE = "node",
  VERSION = "version",
  LIFECYCLE_CHAINCODE = "lifecycle chaincode",
}

export enum PeerChaincodeCommands {
  INSTALL = "install",
  INSTANTIATE = "instantiate",
  INVOKE = "invoke",
  LIST = "list",
  PACKAGE = "package",
  QUERY = "query",
  SIGNPACKAGE = "signpackage",
  UPGRADE = "upgrade",
}

export enum PeerLifecycleChaincodeCommands {
  PACKAGE = "package",
  INSTALL = "install",
  QUERYINSTALLED = "queryinstalled",
  GETINSTALLEDPACKAGE = "getinstalledpackage",
  CALCULATEPACKAGEID = "calculatepackageid",
  APPROVEFORMYORG = "approveformyorg",
  QUERYAPPROVED = "queryapproved",
  CHECKCOMMITREADINESS = "checkcommitreadiness",
  COMMIT = "commit",
  QUERYCOMMITTED = "querycommitted",
}

export enum PeerChannelCommands {
  CREATE = "create",
  FETCH = "fetch",
  GETINFO = "getinfo",
  JOIN = "join",
  JOINBYSNAPSHOT = "joinbysnapshot",
  JOINBYSNAPSHOTSTATUS = "joinbysnapshotstatus",
  LIST = "list",
  SIGNCONFIGTX = "signconfigtx",
  UPDATE = "update",
}

export enum PeerSnapshotCommands {
  CANCELREQUEST = "cancelrequest",
  LISTPENDING = "listpending",
  SUBMITREQUEST = "submitrequest",
}

// export type PeerSubcommands =
//   | PeerChaincodeCommands
//   | PeerLifecycleChaincodeCommands
//   | PeerChannelCommands
//   | PeerNodeCommands
//   | PeerSnapshotCommands
//   | undefined;
