import { Logger, Logging } from "@decaf-ts/logging";
import {
  AdminConfig,
  BCCSPConfig,
  BootstrapConfig,
  ChannelParticipationConfig,
  ClusterConfig,
  ConsensusConfig,
  DebugConfig,
  KafkaConfig,
  KeepAliveConfig,
  MetricsConfig,
  MSGSizeConfig,
  MSPConfig,
  OperationsConfig,
  OrdererConfig,
  ProfileConfig,
  TLSConfig,
} from "../interfaces/fabric/orderer-config";
import path from "path";
import fs from "fs";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";

export class FabricOrdererConfigBuilder {
  private log: Logger;

  private config: OrdererConfig = readFileYaml(
    path.join(__dirname, "../../../config/orderer.yaml")
  ) as OrdererConfig;

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricOrdererConfigBuilder);
    else this.log = logger.for(FabricOrdererConfigBuilder.name);
  }

  setKafka(kafka?: KafkaConfig): this {
    if (kafka !== undefined) {
      if (kafka.Retry !== undefined) {
        if (kafka.Retry.ShortInterval !== undefined) {
          this.log.debug(
            `Setting Kafka retry short interval to ${kafka.Retry.ShortInterval}`
          );
          this.config.Kafka!.Retry!.ShortInterval = kafka.Retry.ShortInterval;
        }
        if (kafka.Retry.ShortTotal !== undefined) {
          this.log.debug(
            `Setting Kafka retry short total to ${kafka.Retry.ShortTotal}`
          );
          this.config.Kafka!.Retry!.ShortTotal = kafka.Retry.ShortTotal;
        }
        if (kafka.Retry.LongInterval !== undefined) {
          this.log.debug(
            `Setting Kafka retry long interval to ${kafka.Retry.LongInterval}`
          );
          this.config.Kafka!.Retry!.LongInterval = kafka.Retry.LongInterval;
        }
        if (kafka.Retry.LongTotal !== undefined) {
          this.log.debug(
            `Setting Kafka retry long total to ${kafka.Retry.LongTotal}`
          );
          this.config.Kafka!.Retry!.LongTotal = kafka.Retry.LongTotal;
        }
        if (kafka.Retry.NetworkTimeouts !== undefined) {
          if (kafka.Retry.NetworkTimeouts.DialTimeout !== undefined) {
            this.log.debug(
              `Setting Kafka retry network timeouts dial timeout to ${kafka.Retry.NetworkTimeouts.DialTimeout}`
            );
            this.config.Kafka!.Retry!.NetworkTimeouts!.DialTimeout =
              kafka.Retry.NetworkTimeouts.DialTimeout;
          }
          if (kafka.Retry.NetworkTimeouts.ReadTimeout !== undefined) {
            this.log.debug(
              `Setting Kafka retry network timeouts read timeout to ${kafka.Retry.NetworkTimeouts.ReadTimeout}`
            );
            this.config.Kafka!.Retry!.NetworkTimeouts!.ReadTimeout =
              kafka.Retry.NetworkTimeouts.ReadTimeout;
          }
          if (kafka.Retry.NetworkTimeouts.WriteTimeout !== undefined) {
            this.log.debug(
              `Setting Kafka retry network timeouts write timeout to ${kafka.Retry.NetworkTimeouts.WriteTimeout}`
            );
            this.config.Kafka!.Retry!.NetworkTimeouts!.WriteTimeout =
              kafka.Retry.NetworkTimeouts.WriteTimeout;
          }
        }

        if (kafka.Retry.Metadata !== undefined) {
          if (kafka.Retry.Metadata.RetryBackoff !== undefined) {
            this.log.debug(
              `Setting Kafka retry metadata retry backoff to ${kafka.Retry.Metadata.RetryBackoff}`
            );
            this.config.Kafka!.Retry!.Metadata!.RetryBackoff =
              kafka.Retry.Metadata.RetryBackoff;
          }
          if (kafka.Retry.Metadata.RetryMax !== undefined) {
            this.log.debug(
              `Setting Kafka retry metadata retry max to ${kafka.Retry.Metadata.RetryMax}`
            );
            this.config.Kafka!.Retry!.Metadata!.RetryMax =
              kafka.Retry.Metadata.RetryMax;
          }
        }

        if (kafka.Retry.Producer !== undefined) {
          if (kafka.Retry.Producer.RetryBackoff !== undefined) {
            this.log.debug(
              `Setting Kafka retry producer retry backoff to ${kafka.Retry.Producer.RetryBackoff}`
            );
            this.config.Kafka!.Retry!.Producer!.RetryBackoff =
              kafka.Retry.Producer.RetryBackoff;
          }
          if (kafka.Retry.Producer.RetryMax !== undefined) {
            this.log.debug(
              `Setting Kafka retry producer retry max to ${kafka.Retry.Producer.RetryMax}`
            );
            this.config.Kafka!.Retry!.Producer!.RetryMax =
              kafka.Retry.Producer.RetryMax;
          }
        }

        if (kafka.Retry.Consumer !== undefined) {
          if (kafka.Retry.Consumer.RetryBackoff !== undefined) {
            this.log.debug(
              `Setting Kafka retry consumer retry backoff to ${kafka.Retry.Consumer.RetryBackoff}`
            );
            this.config.Kafka!.Retry!.Consumer!.RetryBackoff =
              kafka.Retry.Consumer.RetryBackoff;
          }
        }
      }

      if (kafka.Topic !== undefined) {
        if (kafka.Topic.ReplicationFactor !== undefined) {
          this.log.debug(
            `Setting Kafka topic replication factor to ${kafka.Topic.ReplicationFactor}`
          );
          this.config.Kafka!.Topic!.ReplicationFactor =
            kafka.Topic.ReplicationFactor;
        }
      }

      if (kafka.Verbose !== undefined) {
        this.log.debug(`Setting Kafka verbose to ${kafka.Verbose}`);
        this.config.Kafka!.Verbose = kafka.Verbose;
      }

      if (kafka.TLS !== undefined) {
        if (kafka.TLS.Enabled !== undefined) {
          this.log.debug(`Setting Kafka TLS enabled to ${kafka.TLS.Enabled}`);
          this.config.Kafka!.TLS!.Enabled = kafka.TLS.Enabled;
        }
        if (kafka.TLS.Certificate !== undefined) {
          this.log.debug(
            `Setting Kafka TLS certificate to ${kafka.TLS.Certificate}`
          );
          this.config.Kafka!.TLS!.Certificate = kafka.TLS.Certificate;
        }

        if (kafka.TLS.PrivateKey !== undefined) {
          this.log.debug(
            `Setting Kafka TLS private key to ${kafka.TLS.PrivateKey}`
          );
          this.config.Kafka!.TLS!.PrivateKey = kafka.TLS.PrivateKey;
        }

        if (kafka.TLS.RootCAs !== undefined) {
          this.log.debug(`Setting Kafka TLS root CAs to ${kafka.TLS.RootCAs}`);
          this.config.Kafka!.TLS!.RootCAs = kafka.TLS.RootCAs;
        }
      }

      if (kafka.Version !== undefined) {
        this.log.debug(`Setting Kafka version to ${kafka.Version}`);
        this.config.Kafka!.Version = kafka.Version;
      }

      if (kafka.SASLPlain !== undefined) {
        if (kafka.SASLPlain.Enabled !== undefined) {
          this.log.debug(
            `Setting Kafka SASL plain enabled to ${kafka.SASLPlain.Enabled}`
          );
          this.config.Kafka!.SASLPlain!.Enabled = kafka.SASLPlain.Enabled;
        }
        if (kafka.SASLPlain.User !== undefined) {
          this.log.debug(
            `Setting Kafka SASL plain user to ${kafka.SASLPlain.User}`
          );
          this.config.Kafka!.SASLPlain!.User = kafka.SASLPlain.User;
        }
        if (kafka.SASLPlain.Password !== undefined) {
          this.log.debug(
            `Setting Kafka SASL plain password to ${kafka.SASLPlain.Password}`
          );
          this.config.Kafka!.SASLPlain!.Password = kafka.SASLPlain.Password;
        }
      }
    }
    return this;
  }

  setFileLedgerLocation(fileLedgerLocation?: string): this {
    if (fileLedgerLocation !== undefined) {
      this.log.debug(`Setting file ledger location to ${fileLedgerLocation}`);
      this.config.FileLedger!.Location = fileLedgerLocation;
    }
    return this;
  }

  setAuthWindow(authWindow?: string): this {
    if (authWindow !== undefined) {
      this.log.debug(`Setting auth window to ${authWindow}`);
      this.config.General!.Authentication!.TimeWindow = authWindow;
    }
    return this;
  }

  setBCCSP(bccsp?: BCCSPConfig): this {
    if (bccsp !== undefined) {
      if (bccsp.Default !== undefined) {
        this.log.debug(`Setting BCCSP default to ${bccsp.Default}`);
        this.config.General!.BCCSP!.Default = bccsp.Default;
      }
      if (bccsp.SW !== undefined) {
        if (bccsp.SW.Hash !== undefined) {
          this.log.debug(`Setting BCCSP SW hash to ${bccsp.SW.Hash}`);
          this.config.General!.BCCSP!.SW!.Hash = bccsp.SW.Hash;
        }
        if (bccsp.SW.Security !== undefined) {
          this.log.debug(`Setting BCCSP SW security to ${bccsp.SW.Security}`);
          this.config.General!.BCCSP!.SW!.Security = bccsp.SW.Security;
        }
        if (bccsp.SW.FileKeyStore !== undefined) {
          if (bccsp.SW.FileKeyStore.KeyStore !== undefined) {
            this.log.debug(
              `Setting BCCSP SW FileKeyStore key store to ${bccsp.SW.FileKeyStore.KeyStore}`
            );
            this.config.General!.BCCSP!.SW!.FileKeyStore!.KeyStore =
              bccsp.SW.FileKeyStore.KeyStore;
          }
        }
      }

      if (bccsp.PKCS11 !== undefined) {
        if (bccsp.PKCS11.Library !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 library to ${bccsp.PKCS11.Library}`
          );
          this.config.General!.BCCSP!.PKCS11!.Library = bccsp.PKCS11.Library;
        }
        if (bccsp.PKCS11.Label !== undefined) {
          this.log.debug(`Setting BCCSP PKCS11 label to ${bccsp.PKCS11.Label}`);
          this.config.General!.BCCSP!.PKCS11!.Label = bccsp.PKCS11.Label;
        }
        if (bccsp.PKCS11.Pin !== undefined) {
          this.log.debug(`Setting BCCSP PKCS11 pin to ${bccsp.PKCS11.Pin}`);
          this.config.General!.BCCSP!.PKCS11!.Pin = bccsp.PKCS11.Pin;
        }
        if (bccsp.PKCS11.Hash !== undefined) {
          this.log.debug(`Setting BCCSP PKCS11 hash to ${bccsp.PKCS11.Hash}`);
          this.config.General!.BCCSP!.PKCS11!.Hash = bccsp.PKCS11.Hash;
        }
        if (bccsp.PKCS11.Security !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 security to ${bccsp.PKCS11.Security}`
          );
          this.config.General!.BCCSP!.PKCS11!.Security = bccsp.PKCS11.Security;
        }
        if (bccsp.PKCS11.FileKeyStore !== undefined) {
          if (bccsp.PKCS11.FileKeyStore.KeyStore !== undefined) {
            this.log.debug(
              `Setting BCCSP PKCS11 FileKeyStore key store to ${bccsp.PKCS11.FileKeyStore.KeyStore}`
            );
            this.config.General!.BCCSP!.PKCS11!.FileKeyStore!.KeyStore =
              bccsp.PKCS11.FileKeyStore.KeyStore;
          }
        }
      }
    }

    return this;
  }

  setDebug(debug?: DebugConfig): this {
    if (debug !== undefined) {
      if (debug.BroadcastTraceDir !== undefined) {
        this.log.debug(
          `Setting debug broadcast trace directory to ${debug.BroadcastTraceDir}`
        );
        this.config.Debug!.BroadcastTraceDir = debug.BroadcastTraceDir;
      }
      if (debug.DeliverTraceDir !== undefined) {
        this.log.debug(
          `Setting debug deliver trace directory to ${debug.DeliverTraceDir}`
        );
        this.config.Debug!.DeliverTraceDir = debug.DeliverTraceDir;
      }
    }
    return this;
  }

  setOperations(operations?: OperationsConfig): this {
    if (operations !== undefined) {
      if (operations.ListenAddress !== undefined) {
        this.log.debug(
          `Setting operations listen address to ${operations.ListenAddress}`
        );
        this.config.Operations!.ListenAddress = operations.ListenAddress;
      }
      if (operations.TLS !== undefined) {
        if (operations.TLS.Enabled !== undefined) {
          this.log.debug(`Setting TLS enabled to ${operations.TLS.Enabled}`);
          this.config.Operations!.TLS!.Enabled = operations.TLS.Enabled;
        }
        if (operations.TLS.Certificate !== undefined) {
          this.log.debug(
            `Setting TLS certificate to ${operations.TLS.Certificate}`
          );
          this.config.Operations!.TLS!.Certificate = operations.TLS.Certificate;
        }
        if (operations.TLS.PrivateKey !== undefined) {
          this.log.debug(
            `Setting TLS private key to ${operations.TLS.PrivateKey}`
          );
          this.config.Operations!.TLS!.PrivateKey = operations.TLS.PrivateKey;
        }
        if (operations.TLS.ClientAuthRequired !== undefined) {
          this.log.debug(
            `Setting TLS client authentication required to ${operations.TLS.ClientAuthRequired}`
          );
          this.config.Operations!.TLS!.ClientAuthRequired =
            operations.TLS.ClientAuthRequired;
        }
        if (operations.TLS.ClientRootCAs !== undefined) {
          this.log.debug(
            `Setting TLS client root CAs to ${operations.TLS.ClientRootCAs}`
          );
          this.config.Operations!.TLS!.ClientRootCAs =
            operations.TLS.ClientRootCAs;
        }
      }
    }

    return this;
  }

  setMetrics(metrics?: MetricsConfig): this {
    if (metrics !== undefined) {
      if (metrics.Provider !== undefined) {
        this.log.debug(`Setting metrics provider to ${metrics.Provider}`);
        this.config.Metrics!.Provider = metrics.Provider;
      }
      if (metrics.Statsd !== undefined) {
        if (metrics.Statsd.Network !== undefined) {
          this.log.debug(`Setting statsd network to ${metrics.Statsd.Network}`);
          this.config.Metrics!.Statsd!.Network = metrics.Statsd.Network;
        }
        if (metrics.Statsd.Address !== undefined) {
          this.log.debug(`Setting statsd address to ${metrics.Statsd.Address}`);
          this.config.Metrics!.Statsd!.Address = metrics.Statsd.Address;
        }
        if (metrics.Statsd.WriteInterval !== undefined) {
          this.log.debug(
            `Setting statsd write interval to ${metrics.Statsd.WriteInterval}`
          );
          this.config.Metrics!.Statsd!.WriteInterval =
            metrics.Statsd.WriteInterval;
        }
        if (metrics.Statsd.Prefix !== undefined) {
          this.log.debug(`Setting statsd prefix to ${metrics.Statsd.Prefix}`);
          this.config.Metrics!.Statsd!.Prefix = metrics.Statsd.Prefix;
        }
      }
    }
    return this;
  }

  setProfile(profile?: ProfileConfig): this {
    if (profile !== undefined) {
      if (profile.Enabled !== undefined) {
        this.log.debug(`Setting profile to ${profile.Enabled}`);
        this.config.General!.Profile = profile;
      }

      if (profile.Address !== undefined) {
        this.log.debug(`Setting profile address to ${profile.Address}`);
        this.config.General!.Profile!.Address = profile.Address;
      }
    }

    return this;
  }

  setLocalMSP(msp?: MSPConfig): this {
    if (msp !== undefined) {
      if (msp.LocalMSPDir !== undefined) {
        this.log.debug(`Setting local MSP directory to ${msp.LocalMSPDir}`);
        this.config.General!.LocalMSPDir = msp.LocalMSPDir;
      }
      if (msp.LocalMSPID !== undefined) {
        this.log.debug(`Setting local MSP ID to ${msp.LocalMSPID}`);
        this.config.General!.LocalMSPID = msp.LocalMSPID;
      }
    }
    return this;
  }

  setBootstrap(boot?: BootstrapConfig): this {
    if (boot !== undefined) {
      if (boot.BootstrapFile !== undefined) {
        this.log.debug(`Setting bootstrap file to ${boot.BootstrapFile}`);
        this.config.General!.BootstrapFile = boot.BootstrapFile;
      }

      if (boot.BootstrapMethod) {
        this.log.debug(`Setting bootstrap method to ${boot.BootstrapMethod}`);
        this.config.General!.BootstrapMethod = boot.BootstrapMethod;
      }
    }

    return this;
  }

  setCluster(cluster?: ClusterConfig): this {
    if (cluster !== undefined) {
      if (cluster.SendBufferSize !== undefined) {
        this.log.debug(`Setting send buffer size to ${cluster.SendBufferSize}`);
        this.config.General!.Cluster!.SendBufferSize = cluster.SendBufferSize;
      }

      if (cluster.ClientCertificate !== undefined) {
        this.log.debug(
          `Setting client certificate to ${cluster.ClientCertificate}`
        );
        this.config.General!.Cluster!.ClientCertificate =
          cluster.ClientCertificate;
      }

      if (cluster.ClientPrivateKey !== undefined) {
        this.log.debug(
          `Setting client private key to ${cluster.ClientPrivateKey}`
        );
        this.config.General!.Cluster!.ClientPrivateKey =
          cluster.ClientPrivateKey;
      }

      if (cluster.ListenAddress !== undefined) {
        this.log.debug(`Setting listen address to ${cluster.ListenAddress}`);
        this.config.General!.Cluster!.ListenAddress = cluster.ListenAddress;
      }

      if (cluster.ListenPort !== undefined) {
        this.log.debug(`Setting listen port to ${cluster.ListenPort}`);
        this.config.General!.Cluster!.ListenPort = cluster.ListenPort;
      }

      if (cluster.ServerCertificate !== undefined) {
        this.log.debug(
          `Setting server certificate to ${cluster.ServerCertificate}`
        );
        this.config.General!.Cluster!.ServerCertificate =
          cluster.ServerCertificate;
      }

      if (cluster.ServerPrivateKey !== undefined) {
        this.log.debug(
          `Setting server private key to ${cluster.ServerPrivateKey}`
        );
        this.config.General!.Cluster!.ServerPrivateKey =
          cluster.ServerPrivateKey;
      }
    }

    return this;
  }

  setMSGSize(cfg?: MSGSizeConfig): this {
    if (cfg !== undefined) {
      if (cfg.MaxRecvMsgSize !== undefined) {
        this.log.debug(
          `Setting max receive message size to ${cfg.MaxRecvMsgSize}`
        );
        this.config.General!.MaxRecvMsgSize = cfg.MaxRecvMsgSize;
      }
      if (cfg.MaxSendMsgSize !== undefined) {
        this.log.debug(
          `Setting max send message size to ${cfg.MaxSendMsgSize}`
        );
        this.config.General!.MaxSendMsgSize = cfg.MaxSendMsgSize;
      }
    }

    return this;
  }

  setKeepAlive(keepAlive?: KeepAliveConfig): this {
    if (keepAlive !== undefined) {
      if (keepAlive.ServerInterval !== undefined) {
        this.log.debug(
          `Setting server interval to ${keepAlive.ServerInterval}`
        );
        this.config.General!.Keepalive!.ServerInterval =
          keepAlive.ServerInterval;
      }
      if (keepAlive.ServerMinInterval !== undefined) {
        this.log.debug(
          `Setting server minimum interval to ${keepAlive.ServerMinInterval}`
        );
        this.config.General!.Keepalive!.ServerMinInterval =
          keepAlive.ServerMinInterval;
      }
      if (keepAlive.ServerTimeout !== undefined) {
        this.log.debug(`Setting server timeout to ${keepAlive.ServerTimeout}`);
        this.config.General!.Keepalive!.ServerTimeout = keepAlive.ServerTimeout;
      }
    }

    return this;
  }

  setListenAddress(address?: string): this {
    if (address !== undefined) {
      this.log.debug(`Setting listen address to ${address}`);
      this.config.General!.ListenAddress = address;
    }

    return this;
  }

  setPort(port?: number): this {
    if (port !== undefined) {
      this.log.debug(`Setting port to ${port}`);
      this.config.General!.ListenPort = port;
    }

    return this;
  }

  setTLS(tls?: TLSConfig): this {
    if (tls !== undefined) {
      if (tls.Enabled !== undefined) {
        this.log.debug(`Setting TLS enabled to ${tls.Enabled}`);
        this.config.General!.TLS!.Enabled = tls.Enabled;
      }
      if (tls.Certificate !== undefined) {
        this.log.debug(`Setting TLS certificate to ${tls.Certificate}`);
        this.config.General!.TLS!.Certificate = tls.Certificate;
      }
      if (tls.PrivateKey !== undefined) {
        this.log.debug(`Setting TLS private key to ${tls.PrivateKey}`);
        this.config.General!.TLS!.PrivateKey = tls.PrivateKey;
      }
      if (tls.RootCAs !== undefined) {
        this.log.debug(`Setting TLS root CAs to ${tls.RootCAs.join(", ")}`);
        this.config.General!.TLS!.RootCAs = tls.RootCAs;
      }
      if (tls.ClientAuthRequired !== undefined) {
        this.log.debug(
          `Setting TLS client auth required to ${tls.ClientAuthRequired}`
        );
        this.config.General!.TLS!.ClientAuthRequired = tls.ClientAuthRequired;
      }
      if (tls.ClientRootCAs !== undefined) {
        this.log.debug(
          `Setting TLS client root CAs to ${tls.ClientRootCAs.join(", ")}`
        );
        this.config.General!.TLS!.ClientRootCAs = tls.ClientRootCAs;
      }
    }
    return this;
  }

  setAdmin(cfg?: AdminConfig): this {
    if (cfg !== undefined) {
      if (cfg.ListenAddress !== undefined) {
        this.log.debug(`Setting admin listen address to ${cfg.ListenAddress}`);
        this.config.Admin!.ListenAddress = cfg.ListenAddress;
      }
      if (cfg.TLS !== undefined) {
        if (cfg.TLS.Enabled !== undefined) {
          this.log.debug(`Setting admin TLS enabled to ${cfg.TLS.Enabled}`);
          this.config.Admin!.TLS!.Enabled = cfg.TLS.Enabled;
        }

        if (cfg.TLS.PrivateKey !== undefined) {
          this.log.debug(
            `Setting admin TLS private key to ${cfg.TLS.PrivateKey}`
          );
          this.config.Admin!.TLS!.PrivateKey = cfg.TLS.PrivateKey;
        }

        if (cfg.TLS.Certificate !== undefined) {
          this.log.debug(
            `Setting admin TLS certificate to ${cfg.TLS.Certificate}`
          );
          this.config.Admin!.TLS!.Certificate = cfg.TLS.Certificate;
        }

        if (cfg.TLS.RootCAs !== undefined) {
          this.log.debug(
            `Setting admin TLS root CAs files: ${cfg.TLS.RootCAs.join(", ")}`
          );
          this.config.Admin!.TLS!.RootCAs = cfg.TLS.RootCAs;
        }

        if (cfg.TLS.ClientAuthRequired !== undefined) {
          this.log.debug(
            `Setting admin TLS client auth required to ${cfg.TLS.ClientAuthRequired}`
          );
          this.config.Admin!.TLS!.ClientAuthRequired =
            cfg.TLS.ClientAuthRequired;
        }

        if (cfg.TLS.ClientRootCAs !== undefined) {
          if (cfg.TLS.ClientRootCAs !== undefined) {
            this.log.debug(
              `Setting admin TLS client root CAs files: ${cfg.TLS.ClientRootCAs.join(
                ", "
              )}`
            );
            this.config.Admin!.TLS!.ClientRootCAs = cfg.TLS.ClientRootCAs;
          }
        }
      }
    }
    return this;
  }

  setChannelParticipation(
    channelParticipation?: ChannelParticipationConfig
  ): this {
    if (channelParticipation !== undefined) {
      if (channelParticipation.Enabled !== undefined) {
        this.log.debug(
          `Setting channel participation to ${channelParticipation.Enabled}`
        );
        this.config.ChannelParticipation!.Enabled =
          channelParticipation.Enabled;
      }

      if (channelParticipation.MaxRequestBodySize !== undefined) {
        this.log.debug(
          `Setting max request body size to ${channelParticipation.MaxRequestBodySize}`
        );
        this.config.ChannelParticipation!.MaxRequestBodySize =
          channelParticipation.MaxRequestBodySize;
      }
    }
    return this;
  }

  setConsensus(consensus?: ConsensusConfig): this {
    if (consensus !== undefined) {
      if (consensus.WALDir !== undefined) {
        this.log.debug(`Setting WAL directory to ${consensus.WALDir}`);
        this.config.Consensus!.WALDir = consensus.WALDir;
      }

      if (consensus.SnapDir !== undefined) {
        this.log.debug(`Setting snapshot directory to ${consensus.SnapDir}`);
        this.config.Consensus!.SnapDir = consensus.SnapDir;
      }
    }
    return this;
  }

  /**
   * @description Saves the current configuration to a file.
   * @summary Writes the current Fabric CA Server configuration to a YAML file at the specified path. If the directory doesn't exist, it will be created.
   * @param {string} cpath - The path where the configuration file should be saved.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.save('/path/to/config/fabric-ca-server.yaml');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant FileSystem as File System
   *   Client->>Builder: saveConfig('/path/to/config/fabric-ca-server.yaml')
   *   Builder->>Builder: Check if cpath is defined
   *   alt cpath is defined
   *     Builder->>FileSystem: Check if directory exists
   *     alt Directory doesn't exist
   *       Builder->>FileSystem: Create directory
   *     end
   *     Builder->>Builder: Log debug message
   *     Builder->>FileSystem: Write YAML configuration to file
   *   end
   *   Builder-->>Client: Return this
   */
  save(cpath?: string): this {
    if (cpath === undefined) return this;

    if (!fs.existsSync(path.join(cpath)))
      fs.mkdirSync(path.join(cpath), { recursive: true });

    if (!cpath.endsWith(".yaml")) cpath = path.join(cpath, "orderer.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.debug(`Config file: ${JSON.stringify(this.config, null, 2)}`);
    writeFileYaml(cpath, this.config);

    return this;
  }
}
