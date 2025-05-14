import { FabricCAClientCommand } from "../../fabric/fabric-ca-client/constants";

export type EnrollmentType =
  | FabricCAClientCommand.ENROLL
  | FabricCAClientCommand.REGISTER;

export type EnrollmentRequest = {
  type: EnrollmentType;
  //   request: {
  //     url?: string;
  //     "id.name"?: string;
  //     "id.secret"?: string;
  //     "id.type"?: ACCOUNT_TYPE;
  //     "tls.certfiles"?: string;
  //     mspdir?: string;
  //     "enrollment.profile"?: string;
  //     "csr.hosts"?: string;
  //     "id.attrs"?: string;
  //     home?: string;
  //   };
  copykey?: boolean;
  changeKeyName?: boolean;
};
