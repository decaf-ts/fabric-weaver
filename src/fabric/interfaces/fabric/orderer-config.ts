export interface OrdererConfig {
  General?: {
    ListenAddress?: string;
    ListenPort?: number;
    TLS?: TLSConfig;
    Keepalive?: KeepAliveConfig;
    MaxRecvMsgSize?: number;
    MaxSendMsgSize?: number;
    Cluster?: ClusterConfig;
    BootstrapMethod?: string;
    BootstrapFile?: string;
    LocalMSPDir?: string;
    LocalMSPID?: string;
    Profile?: ProfileConfig;
    BCCSP?: BCCSPConfig;
    Authentication?: {
      TimeWindow?: string;
    };
  };
  FileLedger?: {
    Location?: string;
  };
  Kafka?: KafkaConfig;
  Debug?: DebugConfig;
  Operations?: OperationsConfig;
  Metrics?: MetricsConfig;
  Admin?: AdminConfig;
  ChannelParticipation?: ChannelParticipationConfig;
  Consensus?: ConsensusConfig;
}

export interface KafkaConfig {
  Retry?: {
    ShortInterval?: string;
    ShortTotal?: string;
    LongInterval?: string;
    LongTotal?: string;
    NetworkTimeouts?: {
      DialTimeout?: string;
      ReadTimeout?: string;
      WriteTimeout?: string;
    };
    Metadata?: {
      RetryBackoff?: string;
      RetryMax?: number;
    };
    Producer?: {
      RetryBackoff?: string;
      RetryMax?: number;
    };
    Consumer?: {
      RetryBackoff?: string;
    };
  };
  Topic?: {
    ReplicationFactor?: number;
  };
  Verbose?: boolean;
  TLS?: {
    Enabled?: boolean;
    PrivateKey?: string;
    Certificate?: string;
    RootCAs?: string[];
  };
  SASLPlain?: {
    Enabled?: boolean;
    User?: string;
    Password?: string;
  };
  Version?: string;
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
    FileKeyStore?: {
      KeyStore?: string;
    };
  };
}

export interface DebugConfig {
  BroadcastTraceDir?: string;
  DeliverTraceDir?: string;
}

export interface OperationsConfig {
  ListenAddress?: string;
  TLS?: {
    Enabled?: boolean;
    Certificate?: string;
    PrivateKey?: string;
    ClientAuthRequired?: boolean;
    ClientRootCAs?: string[];
  };
}

export interface MetricsConfig {
  Provider?: string;
  Statsd?: {
    Network?: string;
    Address?: string;
    WriteInterval?: string;
    Prefix?: string;
  };
}

export interface ProfileConfig {
  Enabled?: boolean;
  Address?: string;
}

export interface MSPConfig {
  LocalMSPDir?: string;
  LocalMSPID?: string;
}

export interface BootstrapConfig {
  BootstrapMethod?: string;
  BootstrapFile?: string;
}

export interface ClusterConfig {
  SendBufferSize?: number;
  ClientCertificate?: string;
  ClientPrivateKey?: string;
  ListenPort?: number;
  ListenAddress?: string;
  ServerCertificate?: string;
  ServerPrivateKey?: string;
}

export type MSGSizeConfig = {
  MaxRecvMsgSize?: number;
  MaxSendMsgSize?: number;
};

export interface KeepAliveConfig {
  ServerMinInterval?: string;
  ServerInterval?: string;
  ServerTimeout?: string;
}

export type TLSConfig = AdminTLSConfig & {
  RootCAs?: string[];
};

export interface AdminConfig {
  ListenAddress?: string;
  TLS?: AdminTLSConfig;
}
export interface AdminTLSConfig {
  Enabled?: boolean;
  Certificate?: string;
  PrivateKey?: string;
  ClientAuthRequired?: boolean;
  ClientRootCAs?: string[];
}
export interface ChannelParticipationConfig {
  Enabled?: boolean;
  MaxRequestBodySize?: string;
}

export interface ConsensusConfig {
  WALDir?: string;
  SnapDir?: string;
}
