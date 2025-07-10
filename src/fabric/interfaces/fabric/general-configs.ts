export interface MetricsConfig {
  provider?: string;
  statsd?: {
    network?: string;
    address?: string;
    writeInterval?: string;
    prefix?: string;
  };
}

export interface OperationsConfig {
  listenAddress?: string;
  tls?: {
    enabled?: boolean;
    cert?: {
      file?: string;
    };
    key?: {
      file?: string;
    };
    clientAuthRequired?: boolean;
    clientRootCAs?: {
      files?: string[];
    };
  };
}
