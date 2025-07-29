export enum PeerCommands {
  CHAINCODE = "chaincode",
  CHANNEL = "channel",
  NODE = "node",
  //   VERSION = "version",
  LIFECYCLE_CHAINCODE = "lifecycle chaincode",
}

export enum PeerNodeCommands {
  PAUSE = "pause",
  REBUILD_DBS = "rebuild-dbs",
  RESET = "reset",
  RESUME = "resume",
  ROLLBACK = "rollback",
  START = "start",
  UNJOIN = "unjoin",
  UPGRADE_DBS = "upgrade-dbs",
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
