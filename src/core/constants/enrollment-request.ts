import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";
import { FabricAccountType } from "../../fabric/general-utils/fabric-account-types";

export type EnrollmentType =
  | FabricCAClientCommand.ENROLL
  | FabricCAClientCommand.REGISTER;

export type EnrollmentRequest = {
  type: EnrollmentType;
  request: {
    url?: string;
    idName?: string;
    idSecret?: string;
    tlsCertfiles?: string;
    mspdir?: string;
    idType?: FabricAccountType;
    idAttrs?: string;
    home?: string;
    csrHosts?: string[];
    //     "enrollment.profile"?: string;
  };
  copykey?: boolean;
  changeKeyName?: boolean;
};
