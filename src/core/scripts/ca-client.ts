// export function processEnrollmentRequest(request: EnrollmentRequest, debug: boolean = false){
//     pipeline([
//         [runCommand, Object.entries(request.request as {[x: string]: any}).reduce((accum, value) => {
//             if(value[0] === 'id.attrs')
//                 return accum + ' --' + value[0] + ` '${value[1]}'`;

import { Logging } from "@decaf-ts/logging";
import { EnrollmentRequest } from "../constants/enrollment-request";
import { FabricCAClientCommandBuilder } from "../../fabric/fabric-ca-client/fabric-ca-client";

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

export function processEnrollmentRequest(
  request: EnrollmentRequest,
  debug: boolean = false
) {
  const log = Logging.for(processEnrollmentRequest);

  const builder: FabricCAClientCommandBuilder =
    new FabricCAClientCommandBuilder();

  builder
    .setCommand(request.type)
    .setURL(request.request.url)
    .setTLSCertFiles(
      request.request.tlsCertfiles
        ? request.request.tlsCertfiles.split(",")
        : undefined
    )
    .setMSPDir(request.request.mspdir)
    .setIdName(request.request.idName)
    .setIdSecret(request.request.idSecret);

  log.info(`Debug mode: ${debug}`);
}
