export interface OrdererConfig {
  General?: {
    ListenAddress?: string;
    ListenPort?: number;
    TLS?: {
      Enabled?: boolean;
      PrivateKey?: string;
      Certificate?: string;
      RootCAs?: string[];
      ClientAuthRequired?: boolean;
      ClientRootCAs?: string[];
    };
    Keepalive?: {
      ServerMinInterval?: string;
      ServerInterval?: string;
      ServerTimeout?: string;
    };
    MaxRecvMsgSize?: number;
    MaxSendMsgSize?: number;
    Cluster?: {
      SendBufferSize?: number;
      ClientCertificate?: string;
      ClientPrivateKey?: string;
      ListenPort?: number;
      ListenAddress?: string;
      ServerCertificate?: string;
      ServerPrivateKey?: string;
    };
    BootstrapMethod?: string;
    BootstrapFile?: string;
    LocalMSPDir?: string;
    LocalMSPID?: string;
    Profile?: {
      Enabled?: boolean;
      Address?: string;
    };
    BCCSP?: {
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
    };
    Authentication?: {
      TimeWindow?: string;
    };
  };
  FileLedger?: {
    Location?: string;
  };
  Kafka?: {
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
  };
  Debug?: {
    BroadcastTraceDir?: string;
    DeliverTraceDir?: string;
  };
  Operations?: {
    ListenAddress?: string;
    TLS?: {
      Enabled?: boolean;
      Certificate?: string;
      PrivateKey?: string;
      ClientAuthRequired?: boolean;
      ClientRootCAs?: string[];
    };
  };
  Metrics?: {
    Provider?: string;
    Statsd?: {
      Network?: string;
      Address?: string;
      WriteInterval?: string;
      Prefix?: string;
    };
  };
  Admin?: {
    ListenAddress?: string;
    TLS?: {
      Enabled?: boolean;
      Certificate?: string;
      PrivateKey?: string;
      ClientAuthRequired?: boolean;
      ClientRootCAs?: string[];
    };
  };
  ChannelParticipation?: {
    Enabled?: boolean;
    MaxRequestBodySize?: string;
  };
  Consensus?: {
    WALDir?: string;
    SnapDir?: string;
  };
}
