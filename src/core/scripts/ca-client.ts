import { Logger } from "@decaf-ts/logging";
import { FabricCAClientCommandBuilder } from "../../fabric/fabric-ca-client/fabric-ca-client-command-builder";
import { EnrollmentType } from "../constants/enrollment-request";
import {
  CommadCSRConfig,
  EnrollmentConfig,
  IdentityConfig,
  TLSConfig,
} from "../../fabric/interfaces/fabric/fabric-ca-client-config";
import { FabricCAServerCurveName } from "../../fabric/constants";

// export function processEnrollmentRequest(request: EnrollmentRequest, debug: boolean = false){
//     pipeline([
//         [runCommand, Object.entries(request.request as {[x: string]: any}).reduce((accum, value) => {
//             if(value[0] === 'id.attrs')
//                 return accum + ' --' + value[0] + ` '${value[1]}'`;
//             return accum + ' --' + value.join(" ");
//         }, `fabric-ca-client ${request.type}${debug ? " -d" : ""}`)],

//         request.copykey ? [copyKeyFile, `${request.request.mspdir}/keystore`,  `/fabric/server/msp/keystore`]: [info, "Skipping key copy..."],

//         request.changeKeyName ? [changeKeyName, `/${request.request.mspdir}/keystore`] : [info, "Skipping key name change..."]

//     ]).execAll()

// }

// export function processEnrollmentRequests(requests: EnrollmentRequest[], debug: boolean = false){
//     pipeline(
//         requests.map((request: EnrollmentRequest) => [processEnrollmentRequest, request, debug])
//     ).execAll()
// }

export function clientEnrollment(
  logger: Logger,
  command: EnrollmentType,
  csr: CommadCSRConfig,
  home?: string,
  caName?: string,
  url?: string,
  enrollment?: EnrollmentConfig,
  identity?: IdentityConfig,
  idemixCurve?: string,
  mspdir?: string,
  myHost?: string,
  tls?: TLSConfig,
  destinationDir?: string,
  changeKeyName?: boolean
) {
  const builder = new FabricCAClientCommandBuilder(logger);

  //TODO: implement
  //setHelp()
  //setLogLevel()
  //setRevoke()

  builder
    .setCommand(command)
    .setCSR(csr)
    .setHome(home)
    .setCAName(caName)
    .setUrl(url)
    .setEnrollment(enrollment)
    .setIdentity(identity)
    .setIdemixCurve(idemixCurve as FabricCAServerCurveName)
    .setMspdir(mspdir)
    .setMyHost(myHost)
    .setTLS(tls)
    .copyKey(mspdir, destinationDir)
    .execute();

  // We need to change the key name after the command is executed so the files are present
  builder.changeKeyName(mspdir, changeKeyName);
}
