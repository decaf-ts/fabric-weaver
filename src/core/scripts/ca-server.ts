import path from "path";
import fs from "fs";
import { Logger, Logging } from "@decaf-ts/logging";
import { FabricCAServerConfigBuilder } from "../../fabric/fabric-ca-server/fabric-ca-server-config-builder";
import {
  CAConfig,
  CorsConfig,
  CSRConfig,
  Identity,
  MetricsConfig,
  OperationsConfig,
  ServerTLSConfig,
} from "../../fabric/interfaces/fabric/fabric-ca-server-config";

// export async function bootCAServer(
//   logger: Logger,
//   homeDir: string,
//   caConfig: any,
//   bootFileLocation?: string
// ) {
//   if (hasCAInitialized(bootFileLocation))
//     return startCAServer(homeDir, caConfig);

//   issueCA(logger, homeDir, caConfig);
//   await startCAServer(homeDir, caConfig);
// }

// export async function startCAServer(homeDir: string, caConfig: cfg) {
//   const builder: FabricCAServerCommandBuilder =
//     new FabricCAServerCommandBuilder();

//   const command = builder
//     .setCommand(FabricCAServerCommand.START)
//     .setHomeDirectory(homeDir)
//     .setPort(caConfig.port)
//     .enableDebug(caConfig.debug)
//     .setLogLevel(caConfig.logLevel)
//     .setBootstrapAdmin(caConfig.bootstrapUser)
//     .setCAName(caConfig.ca?.name)
//     .setOperationsListenAddress(caConfig.operations?.listenAddress)
//     .setMetricsListenAddress(caConfig.metrics?.statsd?.address);

//   await command.execute();
// }

export function hasCAInitialized(fileLocation?: string): boolean {
  const log: Logger = Logging.for(hasCAInitialized);

  const defaultFileLocation = path.join(
    __dirname,
    "../../../server/ca-cert.pem"
  );

  if (!fileLocation) {
    log.debug(
      `No file location provided, using default file location: ${defaultFileLocation}`
    );
    fileLocation = defaultFileLocation;
  } else {
    log.debug(`Using provided file location: ${fileLocation}`);
  }

  const booted = fs.existsSync(fileLocation);

  log.debug(`CA has been booted: ${booted}`);

  return booted;
}

export function issueCA(
  logger: Logger,
  caDir: string,
  version?: string,
  port?: number,
  cors?: CorsConfig,
  debug?: boolean,
  crlSizeLimit?: number,
  serverTLS?: ServerTLSConfig,
  caConfig?: CAConfig,
  identities?: Identity[],
  noTLS?: boolean,
  noCA?: boolean,
  csrConfig?: CSRConfig,
  operations?: OperationsConfig,
  metrics?: MetricsConfig
) {
  const builder = new FabricCAServerConfigBuilder(logger);

  builder
    .setVersion(version)
    .setPort(port)
    .setCors(cors)
    .enableDebug(debug)
    .setCrlSizeLimit(crlSizeLimit)
    .setServerTLS(serverTLS)
    .setCA(caConfig)
    .setIdentities(identities)
    .removeUnusedProfiles(noTLS, noCA)
    .setCSR(csrConfig)
    .setOperations(operations)
    .setMetrics(metrics)
    .save(caDir);
}
