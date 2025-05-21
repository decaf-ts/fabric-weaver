import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";

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
    //     "id.type"?: ACCOUNT_TYPE;
    //     "enrollment.profile"?: string;
    //     "csr.hosts"?: string;
    //     "id.attrs"?: string;
    //     home?: string;
  };
  copykey?: boolean;
  changeKeyName?: boolean;
};
