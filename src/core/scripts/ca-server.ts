import path from "path";
import fs from "fs";
import { Logger, Logging } from "@decaf-ts/logging";
import { FabricCAServerCommandBuilder } from "../../fabric/fabric-ca-server-old/fabric-ca-server";
import { FabricCAServerCommand } from "../../fabric/fabric-ca-server-old/constants";
import { CAConfig } from "../../fabric/fabric-ca-server-old/fabric-ca-server-config";
import { FabricCAServerConfigBuilder } from "../../fabric/fabric-ca-server/fabric-ca-server-config-builder";

export async function bootCAServer(
  logger: Logger,
  homeDir: string,
  caConfig: CAConfig,
  bootFileLocation?: string
) {
  if (hasCAInitialized(bootFileLocation))
    return startCAServer(homeDir, caConfig);

  issueCA(logger, homeDir, caConfig);
  await startCAServer(homeDir, caConfig);
}

export async function startCAServer(homeDir: string, caConfig: CAConfig) {
  const builder: FabricCAServerCommandBuilder =
    new FabricCAServerCommandBuilder();

  const command = builder
    .setCommand(FabricCAServerCommand.START)
    .setHomeDirectory(homeDir)
    .setPort(caConfig.port)
    .enableDebug(caConfig.debug)
    .setLogLevel(caConfig.logLevel)
    .setBootstrapAdmin(caConfig.bootstrapUser)
    .setCAName(caConfig.ca?.name)
    .setOperationsListenAddress(caConfig.operations?.listenAddress)
    .setMetricsListenAddress(caConfig.metrics?.statsd?.address);

  await command.execute();
}

export function issueCA(logger: Logger, homeDir: string, caConfig: CAConfig) {
  const builder = new FabricCAServerConfigBuilder(logger);

  builder.setPort(caConfig.port).enableDebug(caConfig.debug).save(homeDir);

  const builder1 = new FabricCAServerCommandBuilder();
  builder1
    // .setCommand(FabricCAServerCommand.START)
    // .setHomeDirectory(homeDir)
    // .setPort(caConfig.port)
    .enableDebug(caConfig.debug)
    .setLogLevel(caConfig.logLevel)
    .setBootstrapAdmin(caConfig.bootstrapUser)
    .setCAName(caConfig.ca?.name)
    .setOperationsListenAddress(caConfig.operations?.listenAddress)
    .setMetricsListenAddress(caConfig.metrics?.statsd?.address)
    .saveConfig(homeDir);
}

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

export function issueCAServerConfig(
  logger: Logger,
  version?: string,
  port?: number
) {
  const builder = new FabricCAServerConfigBuilder(logger);

  builder.setVersion(version).setPort(port);
}
