// export function processEnrollmentRequest(request: EnrollmentRequest, debug: boolean = false){
//     pipeline([
//         [runCommand, Object.entries(request.request as {[x: string]: any}).reduce((accum, value) => {
//             if(value[0] === 'id.attrs')
//                 return accum + ' --' + value[0] + ` '${value[1]}'`;

import { Logging } from "@decaf-ts/logging";
import { EnrollmentRequest } from "../constants/enrollment-request";

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

  log.info(`Processing enrollment request: ${JSON.stringify(request)}`);
  log.info(`Debug mode: ${debug}`);
}
