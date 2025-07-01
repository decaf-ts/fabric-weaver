/**
 * @module build-scripts-extended
 * @description Script for building extended scripts in the fabric-weaver project
 * @summary This script is responsible for executing the custom build process for extended scripts in the fabric-weaver project. It utilizes the BuildScriptsCustom class to perform the build operations and handle logging.
 *
 * The script performs the following actions:
 * 1. Imports the BuildScriptsCustom class from the build-scripts utility.
 * 2. Creates a new instance of BuildScriptsCustom.
 * 3. Executes the build process.
 * 4. Logs the success or failure of the build process.
 * 5. Exits the process with an error code if the build fails.
 *
 * @example
 * // Run the script from the command line
 * $ node build-scripts-extended.js
 *
 * @mermaid
 * sequenceDiagram
 *   participant Script as build-scripts-extended
 *   participant Builder as BuildScriptsCustom
 *   participant Process as Node Process
 *   Script->>Builder: new BuildScriptsCustom()
 *   Script->>Builder: execute()
 *   alt Build Successful
 *     Builder-->>Script: Promise resolved
 *     Script->>Builder: log.info("Scripts built successfully.")
 *   else Build Failed
 *     Builder-->>Script: Promise rejected
 *     Script->>Builder: log.error("Error building scripts: ...")
 *     Script->>Process: exit(1)
 *   end
 *
 * @memberOf module:fabric-weaver
 */

import { BuildScriptsCustom } from "../utils-old/build-scripts";

new BuildScriptsCustom()
  .execute()
  .then(() => BuildScriptsCustom.log.info("Scripts built successfully."))
  .catch((e: unknown) => {
    BuildScriptsCustom.log.error(`Error building scripts: ${e}`);
    process.exit(1);
  });
