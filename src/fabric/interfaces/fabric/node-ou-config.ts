/**
 * Represents the complete nodeOu configuration for a Fabric organization
 */
export interface NodeOUConfig {
  NodeOUs: {
    /**
     * Enables the Node OU feature
     */
    Enable: boolean;
    /**
     * Path to the client certificate
     */
    ClientOUIdentifier?: OUIdentifier;
    /**
     * Path to the peer certificate
     */
    PeerOUIdentifier?: OUIdentifier;
    /**
     * Path to the admin certificate
     */
    AdminOUIdentifier?: OUIdentifier;
    /**
     * Path to the orderer certificate
     */
    OrdererOUIdentifier?: OUIdentifier;
  };
}

/**
 * Represents an Organizational Unit Identifier
 */
interface OUIdentifier {
  /**
   * Path to the certificate file
   */
  Certificate: string;
  /**
   * The Organizational Unit Identifier
   */
  OrganizationalUnitIdentifier: string;
}
