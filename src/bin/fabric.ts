/**
 * @module fabric-cli
 * @description Command-line interface for Fabric setup and update operations
 * @summary This module provides a CLI for managing Hyperledger Fabric installations.
 * It exposes commands for updating the Fabric install script and setting up Fabric
 * components. The module uses the Commander.js library to parse command-line
 * arguments and execute the appropriate actions.
 *
 * Key exports:
 * - {@link updateFabric}: Function to update the Fabric install script
 * - {@link setupFabric}: Function to set up Fabric components
 *
 * @example
 * // Update Fabric install script
 * node fabric.js update
 *
 * // Setup Fabric components
 * node fabric.js setup --fabric-version 2.5.12 --ca-version 1.5.15 --components binary docker
 *
 * @mermaid
 * sequenceDiagram
 *   participant User
 *   participant CLI
 *   participant UpdateFabric
 *   participant SetupFabric
 *   User->>CLI: Run command
 *   CLI->>CLI: Parse arguments
 *   alt update command
 *     CLI->>UpdateFabric: Call updateFabric()
 *     UpdateFabric->>UpdateFabric: Download install script
 *     UpdateFabric->>UpdateFabric: Make script executable
 *   else setup command
 *     CLI->>SetupFabric: Call setupFabric(config)
 *     SetupFabric->>SetupFabric: Install components
 *   end
 *   CLI->>User: Display result
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import { execSync } from "child_process";
import { Command } from "commander";
import { VERSION } from "../index";

const INSTALL_SCRIPT = path.join(__dirname, "..", "bin", "install-fabric.sh");

// Default configuration
const defaultConfig = {
  fabricVersion: "2.5.12",
  caVersion: "1.5.15",
  components: ["binary"],
};

const program = new Command();

program
  .version(VERSION)
  .description("Fabric setup and update utility")
  .option(
    "-f, --fabric-version <version>",
    "Fabric version",
    defaultConfig.fabricVersion
  )
  .option(
    "-c, --ca-version <version>",
    "Fabric CA version",
    defaultConfig.caVersion
  )
  .option(
    "--components <components...>",
    "Components to install (binary, docker, podman, samples)",
    defaultConfig.components
  );

program
  .command("update")
  .description("Update the Fabric install script")
  .action(async () => {
    await updateFabric();
  });

program
  .command("setup")
  .description("Set up Fabric components")
  .action(async (options) => {
    const config = {
      ...defaultConfig,
      fabricVersion: options.fabricVersion || program.opts().fabricVersion,
      caVersion: options.caVersion || program.opts().caVersion,
      components: options.components || program.opts().components,
    };
    await setupFabric(config);
  });

program.parse(process.argv);

/**
 * @function updateFabric
 * @description Updates the Fabric install script by downloading the latest version
 * @summary This function removes the existing install script (if present), downloads
 * the latest version from the Hyperledger Fabric GitHub repository, and makes it executable.
 * @returns {Promise<void>}
 * @throws {Error} If the download fails or file operations encounter issues
 * @memberOf module:fabric-cli
 *
 * @example
 * await updateFabric();
 *
 * @mermaid
 * sequenceDiagram
 *   participant Function
 *   participant FileSystem
 *   participant GitHub
 *   Function->>FileSystem: Check if script exists
 *   alt Script exists
 *     Function->>FileSystem: Remove existing script
 *   end
 *   Function->>GitHub: Download latest script
 *   GitHub-->>Function: Return script content
 *   Function->>FileSystem: Write new script
 *   Function->>FileSystem: Make script executable
 */
async function updateFabric(): Promise<void> {
  console.log("Executing update...");
  const SCRIPT_URL =
    "https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh";

  // Remove the existing file if it exists
  if (fs.existsSync(INSTALL_SCRIPT)) {
    console.log("Removing existing install-fabric.sh...");
    fs.unlinkSync(INSTALL_SCRIPT);
  }

  // Download the new file
  console.log("Downloading new install-fabric.sh...");
  try {
    const response = await axios.get(SCRIPT_URL, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(INSTALL_SCRIPT, response.data);
    console.log("Download successful.");

    // Make the file executable
    fs.chmodSync(INSTALL_SCRIPT, "755");
    console.log("Made install-fabric.sh executable.");
  } catch (error: unknown) {
    console.error("Error: Failed to download the file.");
    console.error(error);
    process.exit(1);
  }
}

/**
 * @function setupFabric
 * @description Sets up Fabric components based on the provided configuration
 * @summary This function installs the specified Fabric components using the
 * install-fabric.sh script. It iterates through the components list and executes
 * the script for each component with the specified Fabric and CA versions.
 * @param {Object} config - Configuration object for Fabric setup
 * @param {string} config.fabricVersion - Fabric version to install
 * @param {string} config.caVersion - Fabric CA version to install
 * @param {string[]} config.components - List of components to install
 * @returns {Promise<void>}
 * @throws {Error} If the install script is not found or component installation fails
 * @memberOf module:fabric-cli
 *
 * @example
 * const config = {
 *   fabricVersion: "2.5.12",
 *   caVersion: "1.5.15",
 *   components: ["binary", "docker"]
 * };
 * await setupFabric(config);
 *
 * @mermaid
 * sequenceDiagram
 *   participant Function
 *   participant FileSystem
 *   participant InstallScript
 *   Function->>FileSystem: Check if install script exists
 *   alt Script not found
 *     Function->>Function: Log error and exit
 *   else Script found
 *     loop For each component
 *       Function->>InstallScript: Execute install script
 *       InstallScript-->>Function: Installation result
 *       alt Installation failed
 *         Function->>Function: Log error and exit
 *       end
 *     end
 *   end
 *   Function->>Function: Log success message
 */
async function setupFabric(config: typeof defaultConfig): Promise<void> {
  console.log("Executing setup...");
  if (fs.existsSync(INSTALL_SCRIPT)) {
    console.log("Executing install-fabric.sh...");

    for (const component of config.components) {
      console.log(`Installing component: ${component}`);
      try {
        execSync(
          `bash "${INSTALL_SCRIPT}" "${component}" -f "${config.fabricVersion}" -c "${config.caVersion}"`,
          { stdio: "inherit" }
        );
      } catch (error) {
        console.error(`Error installing component: ${component}`);
        console.error(error);
        process.exit(1);
      }
    }
    console.log("All components installed successfully.");
  } else {
    console.error(
      "Error: install-fabric.sh not found. Please run the update command first."
    );
    console.error(INSTALL_SCRIPT);
    process.exit(1);
  }
}
