import {
  ClientAuthType,
  FabricCAServerCurveName,
  FabricCAServerDBTypes,
  FabricCAServerEnrollmentType,
} from "../../constants/fabric-ca-server";
import { MetricsConfig, OperationsConfig } from "./general-configs";

/**
 * @description Configuration interface for the Fabric CA server.
 * @summary This interface defines the structure of the configuration file for the Fabric CA server.
 * It includes settings for server operation, TLS, CA details, registry, database, LDAP, affiliations,
 * signing profiles, CSR configuration, Idemix settings, BCCSP, multi-CA setup, intermediate CA,
 * operations, and metrics.
 * @interface FabricCAServerConfig
 * @memberOf module:fabric-ca-server
 */
export interface FabricCAServerConfig {
  /**
   * @description Version of the configuration file.
   */
  version?: string;

  /**
   * @description Server's listening port.
   */
  port?: number;

  /**
   * @description Cross-Origin Resource Sharing (CORS) settings.
   */
  cors?: CorsConfig;

  /**
   * @description Enables debug logging.
   */
  debug?: boolean;

  /**
   * @description Size limit of an acceptable CRL in bytes.
   */
  crlsizelimit?: number;

  /**
   * @description TLS configuration for the server's listening port.
   */
  tls?: ServerTLSConfig;

  /**
   * @description Certificate Authority (CA) configuration.
   */
  ca?: CAConfig;

  /**
   * @description Configuration for Certificate Revocation List (CRL) generation.
   */
  crl?: {
    /**
     * @description Expiration time for the generated CRL.
     */
    expiry?: string;
  };

  /**
   * @description Registry configuration for authentication and attribute retrieval.
   */
  registry?: {
    /**
     * @description Maximum number of times a password/secret can be reused for enrollment.
     */
    maxenrollments?: number;
    /**
     * @description List of identities in the registry.
     */
    identities?: Identity[];
  };

  /**
   * @description Database configuration.
   */
  db?: DBConfig;

  /**
   * @description LDAP configuration for authentication and attribute retrieval.
   */
  ldap?: LDAPConfig;

  /**
   * @description Affiliations configuration.
   */
  affiliations?: {
    [key: string]: string[];
  };

  /**
   * @description Signing configuration for different certificate types.
   */
  signing?: SigningConfig;

  /**
   * @description Certificate Signing Request (CSR) configuration.
   */
  csr?: CSRConfig;

  /**
   * @description Idemix issuer configuration.
   */
  idemix?: IdemixConfig;

  /**
   * @description BCCSP (BlockChain Crypto Service Provider) configuration.
   */
  bccsp?: BCCSPConfig;

  /**
   * @description Multi-CA configuration.
   */
  cacount?: number;
  cafiles?: string[];

  /**
   * @description Intermediate CA configuration.
   */
  intermediate?: IntermediateCAConfig;

  /**
   * @description CA-specific configuration.
   */
  cfg?: {
    identities?: {
      passwordattempts?: number;
    };
  };

  /**
   * @description Operations server configuration.
   */
  operations?: OperationsConfig;

  /**
   * @description Metrics configuration.
   */
  metrics?: MetricsConfig;
}

export interface Identity {
  name?: string;
  pass?: string;
  type?: string;
  affiliation?: string;
  attrs?: {
    [key: string]: string | boolean;
  };
}
export type CommadCSRConfig = Pick<CSRConfig, "cn" | "hosts"> & {
  keyrequest?: {
    algo?: string;
    size?: number;
    reusekey?: boolean;
  };
  serialnumber?: string;
};

export interface CSRConfig {
  cn?: string;
  keyrequest?: {
    algo?: string;
    size?: number;
  };
  names?: Array<{
    C?: string;
    ST?: string;
    L?: string;
    O?: string;
    OU?: string;
  }>;
  hosts?: string[];
  ca?: {
    expiry?: string;
    pathlength?: number;
  };
}

export interface CAConfig {
  /**
   * @description Name of this CA.
   */
  name?: string;
  /**
   * @description Path to the key file.
   */
  keyfile?: string;
  /**
   * @description Path to the certificate file.
   */
  certfile?: string;
  /**
   * @description Path to the chain file.
   */
  chainfile?: string;
  /**
   * @description Whether to ignore certificate expiration during re-enrollment.
   */
  reenrollIgnoreCertExpiry?: boolean;
}

export interface ServerTLSConfig {
  /**
   * @description Whether TLS is enabled.
   */
  enabled?: boolean;
  /**
   * @description Path to the TLS certificate file.
   */
  certfile?: string;
  /**
   * @description Path to the TLS key file.
   */
  keyfile?: string;
  /**
   * @description Client authentication settings for TLS.
   */
  clientauth?: {
    /**
     * @description Type of client authentication.
     */
    type?: ClientAuthType;
    /**
     * @description List of certificate files for client authentication.
     */
    certfiles?: string[];
  };
}

export interface CorsConfig {
  /**
   * @description Whether CORS is enabled.
   */
  enabled?: boolean;
  /**
   * @description Allowed origins for CORS.
   */
  origins?: string[];
}

export interface DBConfig {
  /**
   * @description Type of database (sqlite3, postgres, or mysql).
   */
  type?: FabricCAServerDBTypes;
  /**
   * @description Data source name.
   */
  datasource?: string;
  /**
   * @description TLS configuration for database connection.
   */
  tls?: {
    enabled?: boolean;
    certfiles?: string[];
    client?: {
      certfile?: string;
      keyfile?: string;
    };
  };
}

export type CommandLDAPConfig = Pick<LDAPConfig, "enabled" | "url" | "tls"> & {
  attribute?: Pick<NonNullable<LDAPConfig["attribute"]>, "names">;
  groupfilter?: string;
  userfilter?: string;
};
export interface LDAPConfig {
  /**
   * @description Whether LDAP is enabled.
   */
  enabled?: boolean;
  /**
   * @description URL of the LDAP server.
   */
  url?: string;
  /**
   * @description TLS configuration for LDAP connection.
   */
  tls?: {
    certfiles?: string[];
    client?: {
      certfile?: string;
      keyfile?: string;
    };
  };
  /**
   * @description Attribute mapping configuration.
   */
  attribute?: {
    names?: string[];
    converters?: Array<{
      name?: string;
      value?: string;
    }>;
    maps?: {
      groups?: Array<{
        name?: string;
        value?: string;
      }>;
    };
  };
}

export interface SigningConfig {
  default?: {
    usage?: string[];
    expiry?: string;
  };
  profiles?: {
    ca?: {
      usage?: string[];
      expiry?: string;
      caconstraint?: {
        isca?: boolean;
        maxpathlen?: number;
      };
    };
    tls?: {
      usage?: string[];
      expiry?: string;
    };
  };
}

export interface IdemixConfig {
  rhpoolsize?: number;
  nonceexpiration?: string;
  noncesweepinterval?: string;
  curve?: FabricCAServerCurveName;
}

export interface BCCSPConfig {
  default?: string;
  sw?: {
    hash?: string;
    security?: number;
    filekeystore?: {
      keystore?: string;
    };
  };
}

export interface IntermediateCAConfig {
  parentserver?: {
    url?: string;
    caname?: string;
  };
  enrollment?: {
    hosts?: string[];
    profile?: string;
    label?: string;
  };
  tls?: {
    certfiles?: string[];
    client?: {
      certfile?: string;
      keyfile?: string;
    };
  };
}

export type CommandIntermediateCAConfig = Pick<
  IntermediateCAConfig,
  "parentserver" | "tls"
> & {
  enrollment?: {
    profile?: string;
    label?: string;
    type?: FabricCAServerEnrollmentType;
  };
};
