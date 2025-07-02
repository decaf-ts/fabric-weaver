import { Logging } from "@decaf-ts/logging";
import * as path from "path";

/**
 * @summary Determines if a given file path is an absolute path on a Linux system.
 *
 * @description On Linux (and other POSIX-compliant systems), an absolute path always starts
 * with a forward slash (`/`). This function checks for that condition.
 *
 * @param {string} path - The file path to evaluate.
 * @returns {boolean} - Returns `true` if the path is absolute, `false` otherwise.
 *
 * @memberOf module:fabric-integration.Utils
 *
 * @example
 * isAbsolutePath('/home/user/file.txt'); // true
 * isAbsolutePath('./relative/path.txt'); // false
 * isAbsolutePath('relative/path.txt');   // false
 */
export function isAbsolutePath(path: string) {
  // On Linux, an absolute path starts with "/"
  return path.startsWith("/");
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
