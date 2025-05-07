export interface WeaverConfig {
  global: WeaverGlobalConfig;
  orgs: WeaverOrg[];
}

export interface WeaverGlobalConfig {
  image: string;
}

export interface WeaverOrg {
  organization: WeaverOrgConfig;
}

export interface WeaverOrgConfig {
  name: string;
}
