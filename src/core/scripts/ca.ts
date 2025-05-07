import path from "path";
import fs from "fs";
import { Logger, Logging } from "@decaf-ts/logging";
import { FabricCAServerCommandBuilder } from "../../fabric/fabric-ca-server/fabric-ca-server";
import { FabricCAServerCommand } from "../../fabric/fabric-ca-server/constants";
import { runCommand } from "../../utils/child-process";

export async function bootCAServer(homeDir: string, bootFileLocation?: string) {
  if (hasCAInitialized(bootFileLocation)) return startCAServer();

  issueCA(homeDir);
  await startCAServer();
}

export async function startCAServer() {
  const builder: FabricCAServerCommandBuilder =
    new FabricCAServerCommandBuilder();

  const command = builder.setCommand(FabricCAServerCommand.START).build();

  const regex = /\[\s*INFO\s*\] Listening on http/;

  await runCommand(command, [], {}, regex);
}

export function issueCA(homeDir: string) {
  const builder: FabricCAServerCommandBuilder =
    new FabricCAServerCommandBuilder();

  builder.setCommand(FabricCAServerCommand.START).saveConfig(homeDir);
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
