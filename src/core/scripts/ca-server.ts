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
import { FabricCAServerCommandBuilder } from "../../fabric/fabric-ca-server/fabric-ca-server-command-builder";
import {
  DEFAULT_CA_CERT_PATH,
  FabricCAServerCommand,
} from "../../fabric/constants/fabric-ca-server";

export function hasCAInitialized(
  fileLocation: string = DEFAULT_CA_CERT_PATH
): boolean {
  const log: Logger = Logging.for(hasCAInitialized);

  log.debug(`Checking CA initialization at: ${fileLocation}`);

  const isInitialized = fs.existsSync(fileLocation);

  log.debug(`CA initialization status: ${isInitialized}`);

  return isInitialized;
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

export async function startCA(logger: Logger) {
  const builder: FabricCAServerCommandBuilder =
    new FabricCAServerCommandBuilder(logger);

  const command = builder.setCommand(FabricCAServerCommand.START);

  await command.execute();
}

export async function bootCA(
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
  metrics?: MetricsConfig,
  bootFile?: string
) {
  if (!hasCAInitialized(bootFile))
    issueCA(
      logger,
      caDir,
      version,
      port,
      cors,
      debug,
      crlSizeLimit,
      serverTLS,
      caConfig,
      identities,
      noTLS,
      noCA,
      csrConfig,
      operations,
      metrics
    );

  await startCA(logger);
}
