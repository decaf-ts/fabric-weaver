import { Logger, Logging } from "@decaf-ts/logging";
import path from "path";
import fs from "fs";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import {
  BCCSPConfig,
  ChaincodeConfig,
  DeliveryClientConfig,
  DiscoveryConfig,
  GatewayConfig,
  GeneralConfig,
  GossipConfig,
  HandlersConfig,
  KeepAliveConfig,
  LedgerStateConfig,
  LimitsConfig,
  MSGSizeConfig,
  MSPConfig,
  PeerConfig,
  PrivateDataStoreConfig,
  ProfileConfig,
  TLSConfig,
  VMConfig,
} from "../interfaces/fabric/peer-config";
import {
  MetricsConfig,
  OperationsConfig,
} from "../interfaces/fabric/general-configs";

export class FabricPeerConfigBuilder {
  private log: Logger;

  private config: PeerConfig = readFileYaml(
    path.join(__dirname, "../../../config/core.yaml")
  ) as PeerConfig;

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricPeerConfigBuilder);
    else this.log = logger.for(FabricPeerConfigBuilder.name);
  }

  setGossip(gossip?: GossipConfig): this {
    if (gossip === undefined) return this;

    if (gossip.bootstrap !== undefined) {
      this.log.debug(`Setting bootstrap: ${gossip.bootstrap}`);
      this.config.peer!.gossip!.bootstrap = gossip.bootstrap;
    }

    if (gossip.useLeaderElection !== undefined) {
      this.log.debug(
        `Setting use leader election: ${gossip.useLeaderElection}`
      );
      this.config.peer!.gossip!.useLeaderElection = gossip.useLeaderElection;
    }

    if (gossip.orgLeader !== undefined) {
      this.log.debug(`Setting org leaders: ${gossip.orgLeader}`);
      this.config.peer!.gossip!.orgLeader = gossip.orgLeader;
    }

    if (gossip.membershipTrackerInterval !== undefined) {
      this.log.debug(
        `Setting membership tracker interval: ${gossip.membershipTrackerInterval}`
      );
      this.config.peer!.gossip!.membershipTrackerInterval =
        gossip.membershipTrackerInterval;
    }

    if (gossip.maxBlockCountToStore !== undefined) {
      this.log.debug(
        `Setting max block count to store: ${gossip.maxBlockCountToStore}`
      );
      this.config.peer!.gossip!.maxBlockCountToStore =
        gossip.maxBlockCountToStore;
    }

    if (gossip.maxPropagationBurstLatency !== undefined) {
      this.log.debug(
        `Setting max propagation burst latency: ${gossip.maxPropagationBurstLatency}`
      );
      this.config.peer!.gossip!.maxPropagationBurstLatency =
        gossip.maxPropagationBurstLatency;
    }

    if (gossip.maxPropagationBurstSize !== undefined) {
      this.log.debug(
        `Setting max propagation burst size: ${gossip.maxPropagationBurstSize}`
      );
      this.config.peer!.gossip!.maxPropagationBurstSize =
        gossip.maxPropagationBurstSize;
    }

    if (gossip.propagateIterations !== undefined) {
      this.log.debug(
        `Setting propagate iterations: ${gossip.propagateIterations}`
      );
      this.config.peer!.gossip!.propagateIterations =
        gossip.propagateIterations;
    }

    if (gossip.propagatePeerNum !== undefined) {
      this.log.debug(
        `Setting propagate peer number: ${gossip.propagatePeerNum}`
      );
      this.config.peer!.gossip!.propagatePeerNum = gossip.propagatePeerNum;
    }

    if (gossip.pullInterval !== undefined) {
      this.log.debug(`Setting pull interval: ${gossip.pullInterval}`);
      this.config.peer!.gossip!.pullInterval = gossip.pullInterval;
    }

    if (gossip.pullPeerNum !== undefined) {
      this.log.debug(`Setting pull peer number: ${gossip.pullPeerNum}`);
      this.config.peer!.gossip!.pullPeerNum = gossip.pullPeerNum;
    }

    if (gossip.requestStateInfoInterval !== undefined) {
      this.log.debug(
        `Setting request state info interval: ${gossip.requestStateInfoInterval}`
      );
      this.config.peer!.gossip!.requestStateInfoInterval =
        gossip.requestStateInfoInterval;
    }

    if (gossip.publishStateInfoInterval !== undefined) {
      this.log.debug(
        `Setting publish state info interval: ${gossip.publishStateInfoInterval}`
      );
      this.config.peer!.gossip!.publishStateInfoInterval =
        gossip.publishStateInfoInterval;
    }

    if (gossip.stateInfoRetentionInterval !== undefined) {
      this.log.debug(
        `Setting state info retention interval: ${gossip.stateInfoRetentionInterval}`
      );
      this.config.peer!.gossip!.stateInfoRetentionInterval =
        gossip.stateInfoRetentionInterval;
    }

    if (gossip.publishCertPeriod !== undefined) {
      this.log.debug(
        `Setting publish cert period: ${gossip.publishCertPeriod}`
      );
      this.config.peer!.gossip!.publishCertPeriod = gossip.publishCertPeriod;
    }

    if (gossip.skipBlockVerification !== undefined) {
      this.log.debug(
        `Setting skip block verifications: ${gossip.skipBlockVerification}`
      );
      this.config.peer!.gossip!.skipBlockVerification =
        gossip.skipBlockVerification;
    }

    if (gossip.dialTimeout !== undefined) {
      this.log.debug(`Setting dial timeout: ${gossip.dialTimeout}`);
      this.config.peer!.gossip!.dialTimeout = gossip.dialTimeout;
    }

    if (gossip.connTimeout !== undefined) {
      this.log.debug(`Setting connection timeout: ${gossip.connTimeout}`);
      this.config.peer!.gossip!.connTimeout = gossip.connTimeout;
    }

    if (gossip.recvBuffSize !== undefined) {
      this.log.debug(`Setting receive buffer size: ${gossip.recvBuffSize}`);
      this.config.peer!.gossip!.recvBuffSize = gossip.recvBuffSize;
    }

    if (gossip.sendBuffSize !== undefined) {
      this.log.debug(`Setting send buffer size: ${gossip.sendBuffSize}`);
      this.config.peer!.gossip!.sendBuffSize = gossip.sendBuffSize;
    }

    if (gossip.digestWaitTime !== undefined) {
      this.log.debug(`Setting digest wait time: ${gossip.digestWaitTime}`);
      this.config.peer!.gossip!.digestWaitTime = gossip.digestWaitTime;
    }
    if (gossip.requestWaitTime !== undefined) {
      this.log.debug(`Setting request wait time: ${gossip.requestWaitTime}`);
      this.config.peer!.gossip!.requestWaitTime = gossip.requestWaitTime;
    }
    if (gossip.responseWaitTime !== undefined) {
      this.log.debug(`Setting response wait time: ${gossip.responseWaitTime}`);
      this.config.peer!.gossip!.responseWaitTime = gossip.responseWaitTime;
    }
    if (gossip.aliveTimeInterval !== undefined) {
      this.log.debug(
        `Setting alive time interval: ${gossip.aliveTimeInterval}`
      );
      this.config.peer!.gossip!.aliveTimeInterval = gossip.aliveTimeInterval;
    }
    if (gossip.aliveExpirationTimeout !== undefined) {
      this.log.debug(
        `Setting alive expiration timeout: ${gossip.aliveExpirationTimeout}`
      );
      this.config.peer!.gossip!.aliveExpirationTimeout =
        gossip.aliveExpirationTimeout;
    }

    if (gossip.reconnectInterval !== undefined) {
      this.log.debug(`Setting reconnect interval: ${gossip.reconnectInterval}`);
      this.config.peer!.gossip!.reconnectInterval = gossip.reconnectInterval;
    }

    if (gossip.maxConnectionAttempts !== undefined) {
      this.log.debug(
        `Setting maximum connection attempts: ${gossip.maxConnectionAttempts}`
      );
      this.config.peer!.gossip!.maxConnectionAttempts =
        gossip.maxConnectionAttempts;
    }

    if (gossip.msgExpirationFactor !== undefined) {
      this.log.debug(
        `Setting message expiration factor: ${gossip.msgExpirationFactor}`
      );
      this.config.peer!.gossip!.msgExpirationFactor =
        gossip.msgExpirationFactor;
    }

    if (gossip.externalEndpoint !== undefined) {
      this.log.debug(`Setting external endpoint: ${gossip.externalEndpoint}`);
      this.config.peer!.gossip!.externalEndpoint = gossip.externalEndpoint;
    }

    if (gossip.election !== undefined) {
      const election = gossip.election;

      if (election.startupGracePeriod !== undefined) {
        this.log.debug(
          `Setting startup grace period: ${election.startupGracePeriod}`
        );
        this.config.peer!.gossip!.election!.startupGracePeriod =
          election.startupGracePeriod;
      }

      if (election.membershipSampleInterval !== undefined) {
        this.log.debug(
          `Setting membership sample interval: ${election.membershipSampleInterval}`
        );
        this.config.peer!.gossip!.election!.membershipSampleInterval =
          election.membershipSampleInterval;
      }

      if (election.leaderAliveThreshold !== undefined) {
        this.log.debug(
          `Setting leader alive threshold: ${election.leaderAliveThreshold}`
        );
        this.config.peer!.gossip!.election!.leaderAliveThreshold =
          election.leaderAliveThreshold;
      }

      if (election.leaderElectionDuration !== undefined) {
        this.log.debug(
          `Setting leader election duration: ${election.leaderElectionDuration}`
        );
        this.config.peer!.gossip!.election!.leaderElectionDuration =
          election.leaderElectionDuration;
      }
    }

    if (gossip.pvtData !== undefined) {
      const pvtData = gossip.pvtData;

      if (pvtData.pullRetryThreshold !== undefined) {
        this.log.debug(
          `Setting pull retry threshold: ${pvtData.pullRetryThreshold}`
        );
        this.config.peer!.gossip!.pvtData!.pullRetryThreshold =
          pvtData.pullRetryThreshold;
      }

      if (pvtData.transientstoreMaxBlockRetention !== undefined) {
        this.log.debug(
          `Setting transientstore max block retention: ${pvtData.transientstoreMaxBlockRetention}`
        );
        this.config.peer!.gossip!.pvtData!.transientstoreMaxBlockRetention =
          pvtData.transientstoreMaxBlockRetention;
      }

      if (pvtData.pushAckTimeout !== undefined) {
        this.log.debug(`Setting push ack timeout: ${pvtData.pushAckTimeout}`);
        this.config.peer!.gossip!.pvtData!.pushAckTimeout =
          pvtData.pushAckTimeout;
      }

      if (pvtData.btlPullMargin !== undefined) {
        this.log.debug(`Setting btl pull margin: ${pvtData.btlPullMargin}`);
        this.config.peer!.gossip!.pvtData!.btlPullMargin =
          pvtData.btlPullMargin;
      }

      if (pvtData.reconcileBatchSize !== undefined) {
        this.log.debug(
          `Setting reconcile batch size: ${pvtData.reconcileBatchSize}`
        );
        this.config.peer!.gossip!.pvtData!.reconcileBatchSize =
          pvtData.reconcileBatchSize;
      }

      if (pvtData.reconcileSleepInterval !== undefined) {
        this.log.debug(
          `Setting reconcile sleep interval: ${pvtData.reconcileSleepInterval}`
        );
        this.config.peer!.gossip!.pvtData!.reconcileSleepInterval =
          pvtData.reconcileSleepInterval;
      }

      if (pvtData.reconciliationEnabled !== undefined) {
        this.log.debug(
          `Setting reconciliation enabled: ${pvtData.reconciliationEnabled}`
        );
        this.config.peer!.gossip!.pvtData!.reconciliationEnabled =
          pvtData.reconciliationEnabled;
      }

      if (pvtData.skipPullingInvalidTransactionsDuringCommit !== undefined) {
        this.log.debug(
          `Setting skip pulling invalid transactions during commit: ${pvtData.skipPullingInvalidTransactionsDuringCommit}`
        );
        this.config.peer!.gossip!.pvtData!.skipPullingInvalidTransactionsDuringCommit =
          pvtData.skipPullingInvalidTransactionsDuringCommit;
      }

      if (pvtData.implicitCollectionDisseminationPolicy !== undefined) {
        if (pvtData.implicitCollectionDisseminationPolicy !== undefined) {
          const imp = pvtData.implicitCollectionDisseminationPolicy;

          if (imp.maxPeerCount !== undefined) {
            this.log.debug(
              `Setting implicit collection dissemination policy max peer count: ${imp.maxPeerCount}`
            );
            this.config.peer!.gossip!.pvtData!.implicitCollectionDisseminationPolicy!.maxPeerCount =
              imp.maxPeerCount;
          }

          if (imp.requiredPeerCount !== undefined) {
            this.log.debug(
              `Setting implicit collection dissemination policy required peer count: ${imp.requiredPeerCount}`
            );
            this.config.peer!.gossip!.pvtData!.implicitCollectionDisseminationPolicy!.requiredPeerCount =
              imp.requiredPeerCount;
          }
        }
      }
    }

    if (gossip.state !== undefined) {
      const st = gossip.state;

      if (st.enabled !== undefined) {
        this.log.debug(`Setting state enabled: ${st.enabled}`);
        this.config.peer!.gossip!.state!.enabled = st.enabled;
      }

      if (st.checkInterval !== undefined) {
        this.log.debug(`Setting state check interval: ${st.checkInterval}`);
        this.config.peer!.gossip!.state!.checkInterval = st.checkInterval;
      }

      if (st.responseTimeout !== undefined) {
        this.log.debug(`Setting state response timeout: ${st.responseTimeout}`);
        this.config.peer!.gossip!.state!.responseTimeout = st.responseTimeout;
      }

      if (st.batchSize !== undefined) {
        this.log.debug(`Setting state batch size: ${st.batchSize}`);
        this.config.peer!.gossip!.state!.batchSize = st.batchSize;
      }

      if (st.blockBufferSize !== undefined) {
        this.log.debug(
          `Setting state block buffer size: ${st.blockBufferSize}`
        );
        this.config.peer!.gossip!.state!.blockBufferSize = st.blockBufferSize;
      }

      if (st.maxRetries !== undefined) {
        this.log.debug(`Setting state max retries: ${st.maxRetries}`);
        this.config.peer!.gossip!.state!.maxRetries = st.maxRetries;
      }
    }

    return this;
  }

  setTLS(tls?: TLSConfig): this {
    if (tls === undefined) return this;

    if (tls.enabled !== undefined) {
      this.log.debug(`Setting TLS enabled: ${tls.enabled}`);
      this.config.peer!.tls!.enabled = tls.enabled;
    }

    if (tls.clientAuthRequired !== undefined) {
      this.log.debug(
        `Setting client authentication required: ${tls.clientAuthRequired}`
      );
      this.config.peer!.tls!.clientAuthRequired = tls.clientAuthRequired;
    }

    if (tls.cert !== undefined) {
      if (tls.cert.file !== undefined) {
        this.log.debug(`Setting TLS cert file: ${tls.cert.file}`);
        this.config.peer!.tls!.cert!.file = tls.cert.file;
      }
    }

    if (tls.key !== undefined) {
      if (tls.key.file !== undefined) {
        this.log.debug(`Setting TLS key file: ${tls.key.file}`);
        this.config.peer!.tls!.key!.file = tls.key.file;
      }
    }

    if (tls.rootcert !== undefined) {
      if (tls.rootcert.file !== undefined) {
        this.log.debug(`Setting TLS rootcert file: ${tls.rootcert.file}`);
        this.config.peer!.tls!.rootcert!.file = tls.rootcert.file;
      }
    }

    if (tls.clientRootCAs !== undefined) {
      if (tls.clientRootCAs.files !== undefined) {
        this.log.debug(
          `Setting TLS client root CAs files: ${tls.clientRootCAs.files.join(", ")}`
        );
        this.config.peer!.tls!.clientRootCAs!.files = tls.clientRootCAs.files;
      }
    }

    if (tls.clientKey !== undefined) {
      if (tls.clientKey.file !== undefined) {
        this.log.debug(`Setting TLS client key file: ${tls.clientKey.file}`);
        this.config.peer!.tls!.clientKey!.file = tls.clientKey.file;
      }
    }

    if (tls.clientCert !== undefined) {
      if (tls.clientCert.file !== undefined) {
        this.log.debug(`Setting TLS client cert file: ${tls.clientCert.file}`);
        this.config.peer!.tls!.clientCert!.file = tls.clientCert.file;
      }
    }

    return this;
  }

  setAuthentication(authentication?: string): this {
    if (authentication === undefined) return this;

    this.log.debug(`Setting authentication time window: ${authentication}`);
    this.config.peer!.authentication!.timewindow = authentication;

    return this;
  }

  setKeepAlice(keepAlice?: KeepAliveConfig): this {
    if (keepAlice === undefined) return this;

    if (keepAlice.interval !== undefined) {
      this.log.debug(`Setting keep-alive interval: ${keepAlice.interval}`);
      this.config.peer!.keepalive!.interval = keepAlice.interval;
    }

    if (keepAlice.timeout !== undefined) {
      this.log.debug(`Setting keep-alive timeout: ${keepAlice.timeout}`);
      this.config.peer!.keepalive!.timeout = keepAlice.timeout;
    }

    if (keepAlice.minInterval !== undefined) {
      this.log.debug(
        `Setting minimum keep-alive interval: ${keepAlice.minInterval}`
      );
      this.config.peer!.keepalive!.minInterval = keepAlice.minInterval;
    }
    if (keepAlice.client !== undefined) {
      if (keepAlice.client.interval !== undefined) {
        this.log.debug(
          `Setting client keep-alive interval: ${keepAlice.client.interval}`
        );
        this.config.peer!.keepalive!.client!.interval =
          keepAlice.client.interval;
      }

      if (keepAlice.client.timeout !== undefined) {
        this.log.debug(
          `Setting client keep-alive timeout: ${keepAlice.client.timeout}`
        );
        this.config.peer!.keepalive!.client!.timeout = keepAlice.client.timeout;
      }
    }
    if (keepAlice.deliveryClient !== undefined) {
      if (keepAlice.deliveryClient.interval !== undefined) {
        this.log.debug(
          `Setting delivery client keep-alive interval: ${keepAlice.deliveryClient.interval}`
        );
        this.config.peer!.keepalive!.deliveryClient!.interval =
          keepAlice.deliveryClient.interval;
      }

      if (keepAlice.deliveryClient.timeout !== undefined) {
        this.log.debug(
          `Setting delivery client keep-alive timeout: ${keepAlice.deliveryClient.timeout}`
        );
        this.config.peer!.keepalive!.deliveryClient!.timeout =
          keepAlice.deliveryClient.timeout;
      }
    }

    return this;
  }

  setGateway(gateway?: GatewayConfig): this {
    if (gateway === undefined) return this;

    if (gateway.enabled !== undefined) {
      this.log.debug(`Setting gateway enabled: ${gateway.enabled}`);
      this.config.peer!.gateway!.enabled = gateway.enabled;
    }

    if (gateway.endorsementTimeout !== undefined) {
      this.log.debug(
        `Setting endorsement timeout: ${gateway.endorsementTimeout}`
      );
      this.config.peer!.gateway!.endorsementTimeout =
        gateway.endorsementTimeout;
    }

    if (gateway.broadcastTimeout !== undefined) {
      this.log.debug(`Setting broadcast timeout: ${gateway.broadcastTimeout}`);
      this.config.peer!.gateway!.broadcastTimeout = gateway.broadcastTimeout;
    }
    if (gateway.dialTimeout !== undefined) {
      this.log.debug(`Setting dial timeout: ${gateway.dialTimeout}`);
      this.config.peer!.gateway!.dialTimeout = gateway.dialTimeout;
    }
    return this;
  }

  setGeneral(general?: GeneralConfig): this {
    if (general === undefined) return this;

    if (general.validatorPoolSize !== undefined) {
      this.log.debug(
        `Setting validator pool size: ${general.validatorPoolSize}`
      );
      this.config.peer!.validatorPoolSize = general.validatorPoolSize;
    }

    if (general.fileSystemPath !== undefined) {
      this.log.debug(`Setting file system path: ${general.fileSystemPath}`);
      this.config.peer!.fileSystemPath = general.fileSystemPath;
    }
    if (general.id !== undefined) {
      this.log.debug(`Setting peer ID: ${general.id}`);
      this.config.peer!.id = general.id;
    }
    if (general.networkId !== undefined) {
      this.log.debug(`Setting network ID: ${general.networkId}`);
      this.config.peer!.networkId = general.networkId;
    }
    if (general.listenAddress !== undefined) {
      this.log.debug(`Setting listen address: ${general.listenAddress}`);
      this.config.peer!.listenAddress = general.listenAddress;
    }
    if (general.chaincodeListenAddress !== undefined) {
      this.log.debug(
        `Setting chaincode listen address: ${general.chaincodeListenAddress}`
      );
      this.config.peer!.chaincodeListenAddress = general.chaincodeListenAddress;
    }
    if (general.chaincodeAddress !== undefined) {
      this.log.debug(`Setting chaincode address: ${general.chaincodeAddress}`);
      this.config.peer!.chaincodeAddress = general.chaincodeAddress;
    }
    if (general.address !== undefined) {
      this.log.debug(`Setting peer address: ${general.address}`);
      this.config.peer!.address = general.address;
    }
    if (general.addressAutoDetect !== undefined) {
      this.log.debug(
        `Setting address auto-detect to ${general.addressAutoDetect}`
      );
      this.config.peer!.addressAutoDetect = general.addressAutoDetect;
    }

    return this;
  }

  setBCCSP(bccsp?: BCCSPConfig): this {
    if (bccsp !== undefined) {
      if (bccsp.Default !== undefined) {
        this.log.debug(`Setting BCCSP default to ${bccsp.Default}`);
        this.config.peer!.BCCSP!.Default = bccsp.Default;
      }
      if (bccsp.SW !== undefined) {
        if (bccsp.SW.Hash !== undefined) {
          this.log.debug(`Setting BCCSP SW hash to ${bccsp.SW.Hash}`);
          this.config.peer!.BCCSP!.SW!.Hash = bccsp.SW.Hash;
        }
        if (bccsp.SW.Security !== undefined) {
          this.log.debug(`Setting BCCSP SW security to ${bccsp.SW.Security}`);
          this.config.peer!.BCCSP!.SW!.Security = bccsp.SW.Security;
        }
        if (bccsp.SW.FileKeyStore !== undefined) {
          if (bccsp.SW.FileKeyStore.KeyStore !== undefined) {
            this.log.debug(
              `Setting BCCSP SW FileKeyStore key store to ${bccsp.SW.FileKeyStore.KeyStore}`
            );
            this.config.peer!.BCCSP!.SW!.FileKeyStore!.KeyStore =
              bccsp.SW.FileKeyStore.KeyStore;
          }
        }
      }

      if (bccsp.PKCS11 !== undefined) {
        if (bccsp.PKCS11.Library !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 library to ${bccsp.PKCS11.Library}`
          );
          this.config.peer!.BCCSP!.PKCS11!.Library = bccsp.PKCS11.Library;
        }
        if (bccsp.PKCS11.Label !== undefined) {
          this.log.debug(`Setting BCCSP PKCS11 label to ${bccsp.PKCS11.Label}`);
          this.config.peer!.BCCSP!.PKCS11!.Label = bccsp.PKCS11.Label;
        }
        if (bccsp.PKCS11.Pin !== undefined) {
          this.log.debug(`Setting BCCSP PKCS11 pin to ${bccsp.PKCS11.Pin}`);
          this.config.peer!.BCCSP!.PKCS11!.Pin = bccsp.PKCS11.Pin;
        }
        if (bccsp.PKCS11.Hash !== undefined) {
          this.log.debug(`Setting BCCSP PKCS11 hash to ${bccsp.PKCS11.Hash}`);
          this.config.peer!.BCCSP!.PKCS11!.Hash = bccsp.PKCS11.Hash;
        }
        if (bccsp.PKCS11.Security !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 security to ${bccsp.PKCS11.Security}`
          );
          this.config.peer!.BCCSP!.PKCS11!.Security = bccsp.PKCS11.Security;
        }

        if (bccsp.PKCS11.SoftwareVerify !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 software verify to ${bccsp.PKCS11.SoftwareVerify}`
          );
          this.config.peer!.BCCSP!.PKCS11!.SoftwareVerify =
            bccsp.PKCS11.SoftwareVerify;
        }
        if (bccsp.PKCS11.Immutable !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 immutable to ${bccsp.PKCS11.Immutable}`
          );
          this.config.peer!.BCCSP!.PKCS11!.Immutable = bccsp.PKCS11.Immutable;
        }
        if (bccsp.PKCS11.AltID !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 alt ID to ${bccsp.PKCS11.AltID}`
          );
          this.config.peer!.BCCSP!.PKCS11!.AltID = bccsp.PKCS11.AltID;
        }
        if (bccsp.PKCS11.KeyIds !== undefined) {
          this.log.debug(
            `Setting BCCSP PKCS11 key IDs to ${bccsp.PKCS11.KeyIds}`
          );
          this.config.peer!.BCCSP!.PKCS11!.KeyIds = bccsp.PKCS11.KeyIds;
        }
      }
    }

    return this;
  }

  setMspConfig(mspConfig?: MSPConfig): this {
    if (mspConfig === undefined) return this;

    if (mspConfig.localMspType !== undefined) {
      this.log.debug(`Setting local MSP type to ${mspConfig.localMspType}`);
      this.config.peer!.localMspType = mspConfig.localMspType;
    }
    if (mspConfig.mspConfigPath !== undefined) {
      this.log.debug(`Setting MSP config path to ${mspConfig.mspConfigPath}`);
      this.config.peer!.mspConfigPath = mspConfig.mspConfigPath;
    }
    if (mspConfig.localMspId !== undefined) {
      this.log.debug(`Setting local MSP ID to ${mspConfig.localMspId}`);
      this.config.peer!.localMspId = mspConfig.localMspId;
    }

    return this;
  }

  setConnTimeoutClient(connTimeoutClient?: string): this {
    if (connTimeoutClient !== undefined) {
      this.log.debug(
        `Setting connection timeout client to ${connTimeoutClient}`
      );
      this.config.peer!.client!.connTimeout = connTimeoutClient;
    }

    return this;
  }

  setDeliveryClient(deliveryClient?: DeliveryClientConfig): this {
    if (deliveryClient === undefined) return this;

    if (deliveryClient.addressOverrides !== undefined) {
      this.log.debug(
        `Setting address overrides: ${JSON.stringify(deliveryClient.addressOverrides)}`
      );
      this.config.peer!.deliveryclient!.addressOverrides =
        deliveryClient.addressOverrides;
    }

    if (deliveryClient.blockGossipEnabled !== undefined) {
      this.log.debug(
        `Setting block gossip enabled to ${deliveryClient.blockGossipEnabled}`
      );
      this.config.peer!.deliveryclient!.blockGossipEnabled =
        deliveryClient.blockGossipEnabled;
    }

    if (deliveryClient.reconnectTotalTimeThreshold !== undefined) {
      this.log.debug(
        `Setting reconnect total time threshold to ${deliveryClient.reconnectTotalTimeThreshold}`
      );
      this.config.peer!.deliveryclient!.reconnectTotalTimeThreshold =
        deliveryClient.reconnectTotalTimeThreshold;
    }

    if (deliveryClient.connTimeout !== undefined) {
      this.log.debug(
        `Setting connection timeout to ${deliveryClient.connTimeout}`
      );
      this.config.peer!.deliveryclient!.connTimeout =
        deliveryClient.connTimeout;
    }
    if (deliveryClient.reConnectBackoffThreshold !== undefined) {
      this.log.debug(
        `Setting reconnect backoff threshold to ${deliveryClient.reConnectBackoffThreshold}`
      );
      this.config.peer!.deliveryclient!.reConnectBackoffThreshold =
        deliveryClient.reConnectBackoffThreshold;
    }

    return this;
  }

  setProfile(profile?: ProfileConfig): this {
    if (profile === undefined) return this;

    if (profile.enabled !== undefined) {
      this.log.debug(`Setting profile to ${profile.enabled}`);
      this.config.peer!.profile = profile;
    }
    if (profile.listenAddress !== undefined) {
      this.log.debug(`Setting listen address to ${profile.listenAddress}`);
      this.config.peer!.profile!.listenAddress = profile.listenAddress;
    }

    return this;
  }

  setHandlers(handlers?: HandlersConfig): this {
    if (handlers === undefined) return this;

    if (handlers.authFilters !== undefined) {
      this.log.debug(
        `Setting auth filters: ${JSON.stringify(handlers.authFilters)}`
      );
      this.config.peer!.handlers!.authFilters = handlers.authFilters;
    }

    if (handlers.decorators !== undefined) {
      this.log.debug(
        `Setting decorators: ${JSON.stringify(handlers.decorators)}`
      );
      this.config.peer!.handlers!.decorators = handlers.decorators;
    }
    if (handlers.endorsers !== undefined) {
      const ecss = handlers.endorsers.escc;

      if (ecss !== undefined) {
        if (ecss.name !== undefined) {
          this.log.debug(`Setting ESCC name: ${ecss.name}`);
          this.config.peer!.handlers!.endorsers!.escc!.name = ecss.name;
        }
        if (ecss.library !== undefined) {
          this.log.debug(`Setting ESCC library: ${ecss.library}`);
          this.config.peer!.handlers!.endorsers!.escc!.library = ecss.library;
        }
      }
    }

    if (handlers.validators !== undefined) {
      const vscc = handlers.validators.vscc;

      if (vscc !== undefined) {
        if (vscc.name !== undefined) {
          this.log.debug(`Setting VSCC name: ${vscc.name}`);
          this.config.peer!.handlers!.validators!.vscc!.name = vscc.name;
        }
        if (vscc.library !== undefined) {
          this.log.debug(`Setting VSCC library: ${vscc.library}`);
          this.config.peer!.handlers!.validators!.vscc!.library = vscc.library;
        }
      }
    }

    return this;
  }

  setDiscovery(discovery?: DiscoveryConfig): this {
    if (discovery === undefined) return this;

    if (discovery.enabled !== undefined) {
      this.log.debug(`Setting discovery enabled: ${discovery.enabled}`);
      this.config.peer!.discovery!.enabled = discovery.enabled;
    }

    if (discovery.authCacheEnabled !== undefined) {
      this.log.debug(
        `Setting auth cache enabled: ${discovery.authCacheEnabled}`
      );
      this.config.peer!.discovery!.authCacheEnabled =
        discovery.authCacheEnabled;
    }

    if (discovery.authCacheMaxSize !== undefined) {
      this.log.debug(
        `Setting auth cache max size: ${discovery.authCacheMaxSize}`
      );
      this.config.peer!.discovery!.authCacheMaxSize =
        discovery.authCacheMaxSize;
    }
    if (discovery.authCachePurgeRetentionRatio !== undefined) {
      this.log.debug(
        `Setting auth cache purge retention ratio: ${discovery.authCachePurgeRetentionRatio}`
      );
      this.config.peer!.discovery!.authCachePurgeRetentionRatio =
        discovery.authCachePurgeRetentionRatio;
    }
    if (discovery.orgMembersAllowedAccess !== undefined) {
      this.log.debug(
        `Setting org members allowed access: ${discovery.orgMembersAllowedAccess}`
      );
      this.config.peer!.discovery!.orgMembersAllowedAccess =
        discovery.orgMembersAllowedAccess;
    }
    return this;
  }

  setLimits(limits?: LimitsConfig): this {
    if (limits === undefined) return this;

    if (limits.concurrency !== undefined) {
      const concurrency = limits.concurrency;

      if (concurrency.deliverService !== undefined) {
        this.log.debug(
          `Setting deliver service concurrency: ${concurrency.deliverService}`
        );
        this.config.peer!.limits!.concurrency!.deliverService =
          concurrency.deliverService;
      }
      if (concurrency.gatewayService !== undefined) {
        this.log.debug(
          `Setting gateway service concurrency: ${concurrency.gatewayService}`
        );
        this.config.peer!.limits!.concurrency!.gatewayService =
          concurrency.gatewayService;
      }

      if (concurrency.endorserService !== undefined) {
        this.log.debug(
          `Setting endorser service concurrency: ${concurrency.endorserService}`
        );
        this.config.peer!.limits!.concurrency!.endorserService =
          concurrency.endorserService;
      }
    }

    return this;
  }

  setMessageSize(size?: MSGSizeConfig): this {
    if (size === undefined) return this;

    if (size.maxRecvMsgSize !== undefined) {
      this.log.debug(
        `Setting max receive message size: ${size.maxRecvMsgSize}`
      );
      this.config.peer!.maxRecvMsgSize = size.maxRecvMsgSize;
    }

    if (size.maxSendMsgSize !== undefined) {
      this.log.debug(`Setting max send message size: ${size.maxSendMsgSize}`);
      this.config.peer!.maxSendMsgSize = size.maxSendMsgSize;
    }

    return this;
  }

  setChaincode(chaincode?: ChaincodeConfig): this {
    if (chaincode === undefined) return this;

    if (chaincode.id !== undefined) {
      if (chaincode.id.path !== undefined) {
        this.log.debug(`Setting chaincode path: ${chaincode.id.path}`);
        this.config.chaincode!.id!.path = chaincode.id.path;
      }

      if (chaincode.id.name !== undefined) {
        this.log.debug(`Setting chaincode name: ${chaincode.id.name}`);
        this.config.chaincode!.id!.name = chaincode.id.name;
      }
    }

    if (chaincode.builder !== undefined) {
      this.log.debug(`Setting chaincode builder: ${chaincode.builder}`);
      this.config.chaincode!.builder = chaincode.builder;
    }

    if (chaincode.pull !== undefined) {
      this.log.debug(`Setting chaincode pull: ${chaincode.pull}`);
      this.config.chaincode!.pull = chaincode.pull;
    }

    if (chaincode.golang !== undefined) {
      const golang = chaincode.golang;

      if (golang.runtime !== undefined) {
        this.log.debug(`Setting Go runtime: ${golang.runtime}`);
        this.config.chaincode!.golang!.runtime = golang.runtime;
      }

      if (golang.dynamicLink !== undefined) {
        this.log.debug(`Setting Go dynamic link: ${golang.dynamicLink}`);
        this.config.chaincode!.golang!.dynamicLink = golang.dynamicLink;
      }
    }

    if (chaincode.java !== undefined) {
      const java = chaincode.java;

      if (java.runtime !== undefined) {
        this.log.debug(`Setting Java runtime: ${java.runtime}`);
        this.config.chaincode!.java!.runtime = java.runtime;
      }
    }

    if (chaincode.node !== undefined) {
      const node = chaincode.node;

      if (node.runtime !== undefined) {
        this.log.debug(`Setting Node runtime: ${node.runtime}`);
        this.config.chaincode!.node!.runtime = node.runtime;
      }
    }

    if (chaincode.externalBuilders !== undefined) {
      this.log.debug(
        `Setting external builders: ${chaincode.externalBuilders.length}`
      );
      this.config.chaincode!.externalBuilders = chaincode.externalBuilders;
    }

    if (chaincode.installTimeout !== undefined) {
      this.log.debug(`Setting install timeout: ${chaincode.installTimeout}`);
      this.config.chaincode!.installTimeout = chaincode.installTimeout;
    }

    if (chaincode.startuptimeout !== undefined) {
      this.log.debug(`Setting startup timeout: ${chaincode.startuptimeout}`);
      this.config.chaincode!.startuptimeout = chaincode.startuptimeout;
    }

    if (chaincode.executetimeout !== undefined) {
      this.log.debug(`Setting execute timeout: ${chaincode.executetimeout}`);
      this.config.chaincode!.executetimeout = chaincode.executetimeout;
    }

    if (chaincode.mode !== undefined) {
      this.log.debug(`Setting chaincode mode: ${chaincode.mode}`);
      this.config.chaincode!.mode = chaincode.mode;
    }

    if (chaincode.keepalive !== undefined) {
      this.log.debug(`Setting chaincode keepalive: ${chaincode.keepalive}`);
      this.config.chaincode!.keepalive = chaincode.keepalive;
    }

    if (chaincode.system !== undefined) {
      const system = chaincode.system;

      if (system._lifecycle !== undefined) {
        this.log.debug(`Setting system lifecycle: ${system._lifecycle}`);
        this.config.chaincode!.system!._lifecycle = system._lifecycle;
      }

      if (system.cscc !== undefined) {
        this.log.debug(`Setting CSCC: ${system.cscc}`);
        this.config.chaincode!.system!._lifecycle = system.cscc;
      }

      if (system.lscc !== undefined) {
        this.log.debug(`Setting LSCC: ${system.lscc}`);
        this.config.chaincode!.system!._lifecycle = system.lscc;
      }

      if (system.qscc !== undefined) {
        this.log.debug(`Setting QSCC: ${system.qscc}`);
        this.config.chaincode!.system!._lifecycle = system.qscc;
      }
    }

    if (chaincode.logging !== undefined) {
      const logging = chaincode.logging;

      if (logging.level !== undefined) {
        this.log.debug(`Setting logging level: ${logging.level}`);
        this.config.chaincode!.logging!.level = logging.level;
      }

      if (logging.shim !== undefined) {
        this.log.debug(`Setting logging shim: ${logging.shim}`);
        this.config.chaincode!.logging!.shim = logging.shim;
      }

      if (logging.format !== undefined) {
        this.log.debug(`Setting logging format: ${logging.format}`);
        this.config.chaincode!.logging!.format = logging.format;
      }
    }
    return this;
  }

  setVMOptions(options?: VMConfig): this {
    if (options === undefined) return this;

    if (options.endpoint !== undefined) {
      this.log.debug(`Setting VM endpoint: ${options.endpoint}`);
      this.config.vm!.endpoint = options.endpoint;
    }

    if (options.docker != undefined) {
      const docker = options.docker;

      if (docker.tls !== undefined) {
        if (docker.tls.enabled !== undefined) {
          this.log.debug(`Setting TLS enabled: ${docker.tls.enabled}`);
          this.config.vm!.docker!.tls!.enabled = docker.tls.enabled;
        }

        if (docker.tls.ca !== undefined) {
          if (docker.tls.ca.file !== undefined) {
            this.log.debug(`Setting TLS CA file: ${docker.tls.ca.file}`);
            this.config.vm!.docker!.tls!.ca!.file = docker.tls.ca.file;
          }
        }

        if (docker.tls.cert !== undefined) {
          if (docker.tls.cert.file !== undefined) {
            this.log.debug(`Setting TLS cert file: ${docker.tls.cert.file}`);
            this.config.vm!.docker!.tls!.cert!.file = docker.tls.cert.file;
          }
        }

        if (docker.attachStdout !== undefined) {
          this.log.debug(`Setting attach stdout: ${docker.attachStdout}`);
          this.config.vm!.docker!.attachStdout = docker.attachStdout;
        }

        if (docker.hostConfig !== undefined) {
          const hostConfig = docker.hostConfig;

          if (hostConfig.NetworkMode !== undefined) {
            this.log.debug(`Setting NetworkMode: ${hostConfig.NetworkMode}`);
            this.config.vm!.docker!.hostConfig!.NetworkMode =
              hostConfig.NetworkMode;
          }

          if (hostConfig.Dns !== undefined && hostConfig.Dns.length > 0) {
            this.log.debug(`Setting DNS: ${hostConfig.Dns.join(", ")}`);
            this.config.vm!.docker!.hostConfig!.Dns = hostConfig.Dns;
          }

          if (hostConfig.Memory !== undefined) {
            this.log.debug(`Setting Memory: ${hostConfig.Memory}`);
            this.config.vm!.docker!.hostConfig!.Memory = hostConfig.Memory;
          }

          if (hostConfig.LogConfig !== undefined) {
            if (hostConfig.LogConfig.Type !== undefined) {
              this.log.debug(
                `Setting LogConfig Type: ${hostConfig.LogConfig.Type}`
              );
              this.config.vm!.docker!.hostConfig!.LogConfig!.Type =
                hostConfig.LogConfig.Type;
            }

            if (hostConfig.LogConfig.Config !== undefined) {
              if (hostConfig.LogConfig.Config["max-size"] !== undefined) {
                this.log.debug(
                  `Setting LogConfig max-size: ${hostConfig.LogConfig.Config["max-size"]}`
                );
                this.config.vm!.docker!.hostConfig!.LogConfig!.Config![
                  "max-size"
                ] = hostConfig.LogConfig.Config["max-size"];
              }

              if (hostConfig.LogConfig.Config["max-file"] !== undefined) {
                this.log.debug(
                  `Setting LogConfig max-file: ${hostConfig.LogConfig.Config["max-file"]}`
                );
                this.config.vm!.docker!.hostConfig!.LogConfig!.Config![
                  "max-file"
                ] = hostConfig.LogConfig.Config["max-file"];
              }
            }
          }
        }
      }
    }

    return this;
  }

  setLedgerState(state?: LedgerStateConfig): this {
    if (state === undefined) return this;

    if (state.stateDatabase !== undefined) {
      this.log.debug(`Setting state database: ${state.stateDatabase}`);
      this.config.ledger!.state!.stateDatabase = state.stateDatabase;
    }

    if (state.totalQueryLimit !== undefined) {
      this.log.debug(`Setting total query limit: ${state.totalQueryLimit}`);
      this.config.ledger!.state!.totalQueryLimit = state.totalQueryLimit;
    }

    if (state.couchDBConfig !== undefined) {
      const couchDB = state.couchDBConfig;

      if (couchDB.couchDBAddress !== undefined) {
        this.log.debug(`Setting CouchDB address: ${couchDB.couchDBAddress}`);
        this.config.ledger!.state!.couchDBConfig!.couchDBAddress =
          couchDB.couchDBAddress;
      }

      if (couchDB.username !== undefined) {
        this.log.debug(`Setting CouchDB user: ${couchDB.username}`);
        this.config.ledger!.state!.couchDBConfig!.username = couchDB.username;
      }

      if (couchDB.password !== undefined) {
        this.log.debug(`Setting CouchDB password: ${couchDB.password}`);
        this.config.ledger!.state!.couchDBConfig!.password = couchDB.password;
      }

      if (couchDB.maxRetries !== undefined) {
        this.log.debug(`Setting CouchDB max retries: ${couchDB.maxRetries}`);
        this.config.ledger!.state!.couchDBConfig!.maxRetries =
          couchDB.maxRetries;
      }

      if (couchDB.maxRetriesOnStartup !== undefined) {
        this.log.debug(
          `Setting CouchDB max retries on startup: ${couchDB.maxRetriesOnStartup}`
        );
        this.config.ledger!.state!.couchDBConfig!.maxRetriesOnStartup =
          couchDB.maxRetriesOnStartup;
      }

      if (couchDB.requestTimeout !== undefined) {
        this.log.debug(
          `Setting CouchDB request timeout: ${couchDB.requestTimeout}`
        );
        this.config.ledger!.state!.couchDBConfig!.requestTimeout =
          couchDB.requestTimeout;
      }

      if (couchDB.internalQueryLimit !== undefined) {
        this.log.debug(
          `Setting CouchDB internal query limit: ${couchDB.internalQueryLimit}`
        );
        this.config.ledger!.state!.couchDBConfig!.internalQueryLimit =
          couchDB.internalQueryLimit;
      }

      if (couchDB.maxBatchUpdateSize !== undefined) {
        this.log.debug(
          `Setting CouchDB maximum batch update size: ${couchDB.maxBatchUpdateSize}`
        );
        this.config.ledger!.state!.couchDBConfig!.maxBatchUpdateSize =
          couchDB.maxBatchUpdateSize;
      }

      if (couchDB.createGlobalChangesDB !== undefined) {
        this.log.debug(
          `Setting CouchDB create global changes database: ${couchDB.createGlobalChangesDB}`
        );
        this.config.ledger!.state!.couchDBConfig!.createGlobalChangesDB =
          couchDB.createGlobalChangesDB;
      }

      if (couchDB.cacheSize !== undefined) {
        this.log.debug(`Setting CouchDB cache size: ${couchDB.cacheSize}`);
        this.config.ledger!.state!.couchDBConfig!.cacheSize = couchDB.cacheSize;
      }
    }

    return this;
  }

  setLegerBlockchain(blockchain?: any): this {
    if (blockchain !== undefined) {
      this.log.debug(
        `Setting ledger blockchain: ${JSON.stringify(blockchain)}`
      );
      this.config.ledger!.blockchain = blockchain;
    }
    return this;
  }

  enableLedgerHistoryDatabase(enable?: boolean): this {
    if (enable !== undefined) {
      this.log.debug(`Setting ledger history database enabled: ${enable}`);
      this.config.ledger!.history!.enableHistoryDatabase = enable;
    }
    return this;
  }

  setLedgerPvtDataStore(pvtData?: PrivateDataStoreConfig) {
    if (pvtData === undefined) return this;

    if (pvtData.collElgProcDbBatchesInterval !== undefined) {
      this.log.debug(
        `Setting private data collection eligibility process database batches interval: ${pvtData.collElgProcDbBatchesInterval}`
      );
      this.config.ledger!.pvtdataStore!.collElgProcDbBatchesInterval =
        pvtData.collElgProcDbBatchesInterval;
    }

    if (pvtData.collElgProcMaxDbBatchSize !== undefined) {
      this.log.debug(
        `Setting private data collection eligibility process maximum database batch size: ${pvtData.collElgProcMaxDbBatchSize}`
      );
      this.config.ledger!.pvtdataStore!.collElgProcMaxDbBatchSize =
        pvtData.collElgProcMaxDbBatchSize;
    }

    if (pvtData.deprioritizedDataReconcilerInterval !== undefined) {
      this.log.debug(
        `Setting deprioritized data reconciliation interval: ${pvtData.deprioritizedDataReconcilerInterval}`
      );
      this.config.ledger!.pvtdataStore!.deprioritizedDataReconcilerInterval =
        pvtData.deprioritizedDataReconcilerInterval;
    }

    if (pvtData.purgeInterval !== undefined) {
      this.log.debug(`Setting ledger purge interval: ${pvtData.purgeInterval}`);
      this.config.ledger!.pvtdataStore!.purgeInterval = pvtData.purgeInterval;
    }

    if (pvtData.purgedKeyAuditLogging !== undefined) {
      this.log.debug(
        `Setting purged key audit logging: ${pvtData.purgedKeyAuditLogging}`
      );
      this.config.ledger!.pvtdataStore!.purgedKeyAuditLogging =
        pvtData.purgedKeyAuditLogging;
    }

    return this;
  }

  setLedgerSnapshotsRootDir(rootDir?: string): this {
    if (rootDir !== undefined) {
      this.log.debug(`Setting ledger snapshots root directory: ${rootDir}`);
      this.config.ledger!.snapshots!.rootDir = rootDir;
    }
    return this;
  }

  setOperations(operations?: OperationsConfig): this {
    if (operations === undefined) return this;

    if (operations.listenAddress !== undefined) {
      this.log.debug(
        `Setting operations listen address: ${operations.listenAddress}`
      );
      this.config.operations!.listenAddress = operations.listenAddress;
    }
    if (operations.tls !== undefined) {
      if (operations.tls.enabled !== undefined) {
        this.log.debug(
          `Setting operations TLS enabled: ${operations.tls.enabled}`
        );
        this.config.operations!.tls!.enabled = operations.tls.enabled;
      }
      if (operations.tls.cert !== undefined) {
        if (operations.tls.cert.file !== undefined) {
          this.log.debug(
            `Setting operations TLS cert file: ${operations.tls.cert.file}`
          );
          this.config.operations!.tls!.cert!.file = operations.tls.cert.file;
        }
      }
      if (operations.tls.key !== undefined) {
        if (operations.tls.key.file !== undefined) {
          this.log.debug(
            `Setting operations TLS key file: ${operations.tls.key.file}`
          );
          this.config.operations!.tls!.key!.file = operations.tls.key.file;
        }
      }
      if (operations.tls.clientAuthRequired !== undefined) {
        this.log.debug(
          `Setting operations TLS client authentication required: ${operations.tls.clientAuthRequired}`
        );
        this.config.operations!.tls!.clientAuthRequired =
          operations.tls.clientAuthRequired;
      }
      if (operations.tls.clientRootCAs !== undefined) {
        if (operations.tls.clientRootCAs.files !== undefined) {
          this.log.debug(
            `Setting operations TLS client root CAs files: ${operations.tls.clientRootCAs.files.join(
              ", "
            )}`
          );
          this.config.operations!.tls!.clientRootCAs!.files =
            operations.tls.clientRootCAs.files;
        }
      }
    }
    return this;
  }

  setMetrics(metrics?: MetricsConfig): this {
    if (metrics === undefined) return this;

    if (metrics.provider !== undefined) {
      this.log.debug(`Setting metrics provider: ${metrics.provider}`);
      this.config.metrics!.provider = metrics.provider;
    }

    if (metrics.statsd !== undefined) {
      if (metrics.statsd.network !== undefined) {
        this.log.debug(
          `Setting metrics statsd network: ${metrics.statsd.network}`
        );
        this.config.metrics!.statsd!.network = metrics.statsd.network;
      }
      if (metrics.statsd.address !== undefined) {
        this.log.debug(
          `Setting metrics statsd address: ${metrics.statsd.address}`
        );
        this.config.metrics!.statsd!.address = metrics.statsd.address;
      }
      if (metrics.statsd.writeInterval !== undefined) {
        this.log.debug(
          `Setting metrics statsd write interval: ${metrics.statsd.writeInterval}`
        );
        this.config.metrics!.statsd!.writeInterval =
          metrics.statsd.writeInterval;
      }
      if (metrics.statsd.prefix !== undefined) {
        this.log.debug(
          `Setting metrics statsd prefix: ${metrics.statsd.prefix}`
        );
        this.config.metrics!.statsd!.prefix = metrics.statsd.prefix;
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

    if (!cpath.endsWith(".yaml")) cpath = path.join(cpath, "core.yaml");

    this.log.debug(`Writing configuration to ${cpath}`);
    this.log.debug(`Config file: ${JSON.stringify(this.config, null, 2)}`);
    writeFileYaml(cpath, this.config);

    return this;
  }
}
