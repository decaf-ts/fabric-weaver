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
