import { FabricLogLevel } from "../general/constants";

/**
 * @description Configuration interface for Fabric CA Server.
 * @summary Defines the structure of the configuration object for a Fabric CA Server instance.
 * This interface includes all the necessary settings for configuring various aspects of the server,
 * including network settings, TLS configuration, CA details, database configuration, LDAP integration,
 * signing profiles, CSR settings, and more.
 * @interface FabricCAServerConfig
 * @memberOf module:fabric-ca-server
 */
export interface FabricCAServerConfig {
  /** @description Version of the Fabric CA Server configuration. */
  version: string;

  /** @description Port number on which the Fabric CA Server will listen. */
  port: number;

  /**
   * @description Cross-Origin Resource Sharing (CORS) settings.
   * @property {boolean} enabled - Whether CORS is enabled.
   * @property {string[]} origins - List of allowed origins for CORS.
   */
  cors: {
    enabled: boolean;
    origins: string[];
  };

  /** @description Whether debug mode is enabled. */
  debug: boolean;

  /** @description Size limit for the Certificate Revocation List (CRL). */
  crlsizelimit: number;

  /**
   * @description TLS (Transport Layer Security) configuration.
   * @property {boolean} enabled - Whether TLS is enabled.
   * @property {string} [certfile] - Path to the TLS certificate file.
   * @property {string} [keyfile] - Path to the TLS key file.
   * @property {Object} clientauth - Client authentication settings.
   * @property {string} clientauth.type - Type of client authentication.
   * @property {string[]} [clientauth.certfiles] - List of client certificate files for authentication.
   */
  tls: {
    enabled: boolean;
    certfile?: string;
    keyfile?: string;
    clientauth: {
      type: string;
      certfiles?: string[];
    };
  };

  /**
   * @description Certificate Authority (CA) configuration.
   * @property {string} [name] - Name of the CA.
   * @property {string} [keyfile] - Path to the CA's key file.
   * @property {string} [certfile] - Path to the CA's certificate file.
   * @property {string} [chainfile] - Path to the CA's chain file.
   * @property {boolean} reenrollIgnoreCertExpiry - Whether to ignore certificate expiry during re-enrollment.
   */
  ca?: {
    name?: string;
    keyfile?: string;
    certfile?: string;
    chainfile?: string;
    reenrollIgnoreCertExpiry?: boolean;
  };

  /**
   * @description Certificate Revocation List (CRL) settings.
   * @property {string} expiry - Expiration period for the CRL.
   */
  crl: {
    expiry: string;
  };

  /**
   * @description Registry configuration for managing identities.
   * @property {number} maxenrollments - Maximum number of enrollments allowed.
   * @property {Array<Object>} identities - List of pre-configured identities.
   */
  registry: {
    maxenrollments: number;
    identities: Array<{
      name: string;
      pass: string;
      type: string;
      affiliation: string;
      attrs: {
        [key: string]: string | boolean;
      };
    }>;
  };

  /**
   * @description Database configuration.
   * @property {string} type - Type of database (e.g., sqlite3, postgres, mysql).
   * @property {string} datasource - Database connection string.
   * @property {Object} tls - TLS settings for database connection.
   */
  db: {
    type: string;
    datasource: string;
    tls: {
      enabled: boolean;
      certfiles?: string[];
      client: {
        certfile?: string;
        keyfile?: string;
      };
    };
  };

  /**
   * @description LDAP configuration for external authentication.
   * @property {boolean} enabled - Whether LDAP authentication is enabled.
   * @property {string} url - URL of the LDAP server.
   * @property {Object} tls - TLS settings for LDAP connection.
   * @property {Object} attribute - LDAP attribute mapping configuration.
   */
  ldap: {
    enabled: boolean;
    url: string;
    tls: {
      certfiles?: string[];
      client: {
        certfile?: string;
        keyfile?: string;
      };
    };
    attribute: {
      names: string[];
      converters: Array<{
        name: string;
        value: string;
      }>;
      maps: {
        groups: Array<{
          name: string;
          value: string;
        }>;
      };
    };
  };

  /**
   * @description Affiliations configuration.
   * @property {[key: string]: string[]} - Map of affiliations to their sub-affiliations.
   */
  affiliations: {
    [key: string]: string[];
  };

  /**
   * @description Signing configuration for certificates.
   * @property {Object} default - Default signing profile.
   * @property {Object} profiles - Specific signing profiles for different certificate types.
   */
  signing: {
    default: {
      usage: string[];
      expiry: string;
    };
    profiles: {
      ca?: {
        usage: string[];
        expiry: string;
        caconstraint: {
          isca: boolean;
          maxpathlen: number;
        };
      };
      tls?: {
        usage: string[];
        expiry: string;
      };
    };
  };

  /**
   * @description Certificate Signing Request (CSR) configuration.
   * @property {string} cn - Common Name for the CSR.
   * @property {Object} keyrequest - Key generation request details.
   * @property {Array<Object>} names - Subject names for the CSR.
   * @property {string[]} hosts - Allowed hosts for the certificate.
   * @property {Object} ca - CA-specific CSR settings.
   */
  csr: {
    cn: string;
    keyrequest: {
      algo: string;
      size: number;
    };
    names: Array<{
      C: string;
      ST: string;
      L?: string;
      O: string;
      OU: string;
    }>;
    hosts: string[];
    ca: {
      expiry: string;
      pathlength: number;
    };
  };

  /**
   * @description Idemix issuer configuration.
   * @property {number} rhpoolsize - Size of the revocation handle pool.
   * @property {string} nonceexpiration - Expiration time for nonces.
   * @property {string} noncesweepinterval - Interval for sweeping expired nonces.
   * @property {string} curve - Elliptic curve used for Idemix.
   */
  idemix: {
    rhpoolsize: number;
    nonceexpiration: string;
    noncesweepinterval: string;
    curve: string;
  };

  /**
   * @description Blockchain Cryptographic Service Provider (BCCSP) configuration.
   * @property {string} default - Default BCCSP.
   * @property {Object} sw - Software-based BCCSP configuration.
   */
  bccsp: {
    default: string;
    sw: {
      hash: string;
      security: number;
      filekeystore: {
        keystore: string;
      };
    };
  };

  /** @description Number of CAs to run on this server. */
  cacount?: number;

  /** @description Paths to CA configuration files for multiple CAs. */
  cafiles?: string[];

  /**
   * @description Intermediate CA configuration.
   * @property {Object} parentserver - Parent CA server details.
   * @property {Object} enrollment - Enrollment settings for the intermediate CA.
   * @property {Object} tls - TLS settings for communication with the parent CA.
   */
  intermediate: {
    parentserver: {
      url?: string;
      caname?: string;
    };
    enrollment: {
      hosts?: string[];
      profile?: string;
      label?: string;
    };
    tls: {
      certfiles?: string[];
      client: {
        certfile?: string;
        keyfile?: string;
      };
    };
  };

  /**
   * @description Additional configuration settings.
   * @property {Object} identities - Identity-related settings.
   */
  cfg: {
    identities: {
      passwordattempts: number;
    };
  };

  /**
   * @description Operations service configuration.
   * @property {string} listenAddress - Address to listen on for operations requests.
   * @property {Object} tls - TLS settings for the operations service.
   */
  operations?: {
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
  };

  /**
   * @description Metrics configuration.
   * @property {string} provider - Metrics provider to use.
   * @property {Object} statsd - StatsD configuration for metrics.
   */
  metrics?: {
    provider?: string;
    statsd?: {
      network?: string;
      address?: string;
      writeInterval?: string;
      prefix?: string;
    };
  };
}

export type CAConfig = Partial<FabricCAServerConfig> & {
  bootstrapUser?: string;
  logLevel?: FabricLogLevel;
  noCA?: boolean;
  noTLS?: boolean;
};
