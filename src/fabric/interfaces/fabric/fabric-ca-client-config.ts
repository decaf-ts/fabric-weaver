import { FabricCAServerEnrollmentType } from "../../constants/fabric-ca-server";
import { FabricAccountType } from "../../constants/fabric-general";
import { CSRConfig } from "./fabric-ca-server-config";

export type CommadCSRConfig = Pick<CSRConfig, "cn" | "hosts" | "names"> & {
  keyrequest?: {
    algo?: string;
    size?: number;
    reusekey?: boolean;
  };
  serialnumber?: string;
};

export type EnrollmentConfig = {
  attrs?: string[];
  label?: string;
  profile?: string;
  type?: FabricCAServerEnrollmentType;
};

export type IdentityConfig = {
  affiliation?: string;
  maxenrollments?: number;
  name?: string;
  secret?: string;
  type?: FabricAccountType;
  attrs?: string;
};

export type RevokeConfig = {
  aki?: string;
  name?: string;
  reason?: string;
  serial?: string;
};

export type TLSConfig = {
  certfiles?: string[];
  client?: {
    certfile?: string;
    keyfile?: string;
  };
};
