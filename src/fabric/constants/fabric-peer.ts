export enum PeerCommands {
  //   CHAINCODE = "chaincode",
  CHANNEL = "channel",
  NODE = "node",
  //   VERSION = "version",
  //   LIFECYCLE_CHAINCODE = "lifecycle chaincode",
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
