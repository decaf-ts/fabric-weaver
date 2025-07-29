import { FabricCAClientCommand } from "../../fabric/constants/fabric-ca-client";
import { FabricAccountType } from "../../fabric/constants/fabric-general";

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
