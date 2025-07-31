import { Logging } from "@decaf-ts/logging";
import path from "path";

/**
 * Resolves a provided path to an absolute path.
 * If the input path is already absolute, it returns it unchanged.
 * If it's relative, it resolves it based on the current working directory.
 *
 * @param inputPath - The path to evaluate.
 * @returns An absolute path.
 */
export function resolvePath(inputPath: string): string {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(process.cwd(), inputPath);
}

/**
 * @summary Adds the Fabric bin directory to the system's `PATH` environment variable.
 *
 * This function dynamically determines the path to the Fabric bin directory (relative to the current file's
 * location) and appends it to the `PATH` environment variable. This allows command-line tools in the Fabric bin
 * folder to be accessible from anywhere within the environment.
 *
 * @description
 * The function calculates the path to the Fabric bin directory, which is located two levels up from the current
 * directory (`__dirname`) and inside a `bin` folder. After calculating the path, it logs the path being added
 * and updates the `PATH` environment variable so that executable files from the Fabric bin folder can be run
 * directly from the command line.
 *
 * This operation ensures that commands such as `fabric-ca-client`, `peer`, `orderer`, and other Fabric-related
 * binaries are available to execute globally, improving ease of access and functionality.
 *
 * @memberOf module:fabric-integration.Utils
 *
 * @example
 * // Example of adding Fabric bin path
 * addFabricToPath(); // Adds Fabric bin folder to PATH
 */
export function addFabricToPath(binPath?: string) {
  const log = Logging.for(addFabricToPath);
  const fabricBinPath: string = binPath || path.join(__dirname, "../../bin");

  log.info(`Adding Fabric bin folder to path. Path: ${fabricBinPath}`);

  process.env.PATH = `${fabricBinPath}:${process.env.PATH}`;
}
