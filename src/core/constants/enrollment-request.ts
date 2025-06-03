import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";
import { FabricAccountType } from "../../fabric/general/fabric-account-types";

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

    //     "enrollment.profile"?: string;
    //     "csr.hosts"?: string;
    //
    //     home?: string;
  };
  copykey?: boolean;
  changeKeyName?: boolean;
};
