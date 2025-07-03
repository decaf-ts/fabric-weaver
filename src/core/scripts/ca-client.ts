// import { Logging } from "@decaf-ts/logging";
// import { EnrollmentRequest } from "../constants/enrollment-request";
// import { FabricCAClientCommandBuilder } from "../../fabric/fabric-ca-client/fabric-ca-client";

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

// export async function processEnrollmentRequest(
//   request: EnrollmentRequest,
//   debug: boolean = false
// ) {
//   const log = Logging.for(processEnrollmentRequest);

//   const builder: FabricCAClientCommandBuilder =
//     new FabricCAClientCommandBuilder();

//   log.info(`Debug mode: ${debug}`);

//   await builder
//     .setCommand(request.type)
//     .setURL(request.request.url)
//     .setTLSCertFiles(
//       request.request.tlsCertfiles
//         ? request.request.tlsCertfiles.split(",")
//         : undefined
//     )
//     .setMSPDir(request.request.mspdir)
//     .setIdName(request.request.idName)
//     .setIdSecret(request.request.idSecret)
//     .setIdType(request.request.idType)
//     .setIdAttributes(request.request.idAttrs)
//     .setCSRHosts(request.request.csrHosts)
//     .setHome(request.request.home)
//     .execute();

//   builder.changeKeyName(
//     request.changeKeyName
//       ? request.request.mspdir
//         ? request.request.mspdir
//         : undefined
//       : undefined
//   );

//   log.info(`Enrollment request processed successfully.`);
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
  tls?: TLSConfig
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
    .execute();
}
