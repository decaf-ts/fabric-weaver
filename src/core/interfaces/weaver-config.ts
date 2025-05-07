export interface WeaverConfig {
  orgs: WeaverOrg[];
}

export interface WeaverOrg {
  organization: WeaverOrgConfig;
}

export interface WeaverOrgConfig {
  name: string;
}
