import { MetricsConfig, OperationsConfig } from "./general-configs";

export interface PeerConfig {
  peer?: {
    id?: string;
    networkId?: string;
    listenAddress?: string;
    chaincodeListenAddress?: string;
    chaincodeAddress?: string;
    address?: string;
    addressAutoDetect?: boolean;
    gateway?: GatewayConfig;
    keepalive?: KeepAliveConfig;
    gossip?: GossipConfig;
    tls?: TLSConfig;
    authentication?: {
      timewindow?: string;
    };
    fileSystemPath?: string;
    BCCSP?: BCCSPConfig;
    mspConfigPath?: string;
    localMspId?: string;
    client?: {
      connTimeout?: string;
    };
    deliveryclient?: DeliveryClientConfig;
    localMspType?: string;
    profile?: ProfileConfig;
    handlers?: HandlersConfig;
    validatorPoolSize?: number;
    discovery?: DiscoveryConfig;
    limits?: LimitsConfig;
    maxRecvMsgSize?: number;
    maxSendMsgSize?: number;
  };
  vm?: {
    endpoint?: string;
    docker?: {
      tls?: {
        enabled?: boolean;
        ca?: {
          file?: string;
        };
        cert?: {
          file?: string;
        };
        key?: {
          file?: string;
        };
      };
      attachStdout?: boolean;
      hostConfig?: {
        NetworkMode?: string;
        Dns?: string[];
        LogConfig?: {
          Type?: string;
          Config?: {
            "max-size"?: string;
            "max-file"?: string;
          };
        };
        Memory?: number;
      };
    };
  };
  chaincode?: ChaincodeConfig;
  ledger?: {
    blockchain?: any;
    state?: LedgerStateConfig;
    history?: {
      enableHistoryDatabase?: boolean;
    };
    pvtdataStore?: PrivateDataStoreConfig;
    snapshots?: {
      rootDir?: string;
    };
  };
  operations?: OperationsConfig;
  metrics?: MetricsConfig;
}

export interface GossipConfig {
  bootstrap?: string;
  useLeaderElection?: boolean;
  orgLeader?: boolean;
  membershipTrackerInterval?: string;
  maxBlockCountToStore?: number;
  maxPropagationBurstLatency?: string;
  maxPropagationBurstSize?: number;
  propagateIterations?: number;
  propagatePeerNum?: number;
  pullInterval?: string;
  pullPeerNum?: number;
  requestStateInfoInterval?: string;
  publishStateInfoInterval?: string;
  stateInfoRetentionInterval?: string;
  publishCertPeriod?: string;
  skipBlockVerification?: boolean;
  dialTimeout?: string;
  connTimeout?: string;
  recvBuffSize?: number;
  sendBuffSize?: number;
  digestWaitTime?: string;
  requestWaitTime?: string;
  responseWaitTime?: string;
  aliveTimeInterval?: string;
  aliveExpirationTimeout?: string;
  reconnectInterval?: string;
  maxConnectionAttempts?: number;
  msgExpirationFactor?: number;
  externalEndpoint?: string;
  election?: {
    startupGracePeriod?: string;
    membershipSampleInterval?: string;
    leaderAliveThreshold?: string;
    leaderElectionDuration?: string;
  };
  pvtData?: {
    pullRetryThreshold?: string;
    transientstoreMaxBlockRetention?: number;
    pushAckTimeout?: string;
    btlPullMargin?: number;
    reconcileBatchSize?: number;
    reconcileSleepInterval?: string;
    reconciliationEnabled?: boolean;
    skipPullingInvalidTransactionsDuringCommit?: boolean;
    implicitCollectionDisseminationPolicy?: {
      requiredPeerCount?: number;
      maxPeerCount?: number;
    };
  };
  state?: {
    enabled?: boolean;
    checkInterval?: string;
    responseTimeout?: string;
    batchSize?: number;
    blockBufferSize?: number;
    maxRetries?: number;
  };
}

export interface TLSConfig {
  enabled?: boolean;
  clientAuthRequired?: boolean;
  cert?: {
    file?: string;
  };
  key?: {
    file?: string;
  };
  rootcert?: {
    file?: string;
  };
  clientRootCAs?: {
    files?: string[];
  };
  clientKey?: {
    file?: string;
  };
  clientCert?: {
    file?: string;
  };
}

export interface KeepAliveConfig {
  interval?: string;
  timeout?: string;
  minInterval?: string;
  client?: {
    interval?: string;
    timeout?: string;
  };
  deliveryClient?: {
    interval?: string;
    timeout?: string;
  };
}

export interface GatewayConfig {
  enabled?: boolean;
  endorsementTimeout?: string;
  broadcastTimeout?: string;
  dialTimeout?: string;
}

export interface GeneralConfig {
  validatorPoolSize?: number;
  fileSystemPath?: string;
  id?: string;
  networkId?: string;
  listenAddress?: string;
  chaincodeListenAddress?: string;
  chaincodeAddress?: string;
  address?: string;
  addressAutoDetect?: boolean;
}

export interface MSPConfig {
  localMspType?: string;
  mspConfigPath?: string;
  localMspId?: string;
}

export interface DeliveryClientConfig {
  blockGossipEnabled?: boolean;
  reconnectTotalTimeThreshold?: string;
  connTimeout?: string;
  reConnectBackoffThreshold?: string;
  addressOverrides?: Array<{
    from?: string;
    to?: string;
    caCertsFile?: string;
  }>;
}

export interface ProfileConfig {
  enabled?: boolean;
  listenAddress?: string;
}

export interface HandlersConfig {
  authFilters?: Array<{
    name?: string;
    library?: string;
  }>;
  decorators?: Array<{
    name?: string;
    library?: string;
  }>;
  endorsers?: {
    escc?: {
      name?: string;
      library?: string;
    };
  };
  validators?: {
    vscc?: {
      name?: string;
      library?: string;
    };
  };
}

export interface DiscoveryConfig {
  enabled?: boolean;
  authCacheEnabled?: boolean;
  authCacheMaxSize?: number;
  authCachePurgeRetentionRatio?: number;
  orgMembersAllowedAccess?: boolean;
}

export interface LimitsConfig {
  concurrency?: {
    endorserService?: number;
    deliverService?: number;
    gatewayService?: number;
  };
}

export interface MSGSizeConfig {
  maxRecvMsgSize?: number;
  maxSendMsgSize?: number;
}

export interface ChaincodeConfig {
  id?: {
    path?: string;
    name?: string;
  };
  builder?: string;
  pull?: boolean;
  golang?: {
    runtime?: string;
    dynamicLink?: boolean;
  };
  java?: {
    runtime?: string;
  };
  node?: {
    runtime?: string;
  };
  externalBuilders?: Array<{
    name?: string;
    path?: string;
    propagateEnvironment?: string[];
  }>;
  installTimeout?: string;
  startuptimeout?: string;
  executetimeout?: string;
  mode?: string;
  keepalive?: number;
  system?: {
    _lifecycle?: string;
    cscc?: string;
    lscc?: string;
    qscc?: string;
  };
  logging?: {
    level?: string;
    shim?: string;
    format?: string;
  };
}

export interface PrivateDataStoreConfig {
  collElgProcMaxDbBatchSize?: number;
  collElgProcDbBatchesInterval?: number;
  deprioritizedDataReconcilerInterval?: string;
  purgeInterval?: number;
  purgedKeyAuditLogging?: boolean;
}

export interface LedgerStateConfig {
  stateDatabase?: string;
  totalQueryLimit?: number;
  couchDBConfig?: CouchDBConfig;
}

export interface CouchDBConfig {
  couchDBAddress?: string;
  username?: string;
  password?: string;
  maxRetries?: number;
  maxRetriesOnStartup?: number;
  requestTimeout?: string;
  internalQueryLimit?: number;
  maxBatchUpdateSize?: number;
  createGlobalChangesDB?: boolean;
  cacheSize?: number;
}

export interface BCCSPConfig {
  Default?: string;
  SW?: {
    Hash?: string;
    Security?: number;
    FileKeyStore?: {
      KeyStore?: string;
    };
  };
  PKCS11?: {
    Library?: string;
    Label?: string;
    Pin?: string;
    Hash?: string;
    Security?: number;
    SoftwareVerify?: boolean;
    Immutable?: boolean;
    AltID?: string;
    KeyIds?: string[];
  };
}
