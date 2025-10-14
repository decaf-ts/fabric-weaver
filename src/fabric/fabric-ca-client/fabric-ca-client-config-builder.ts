import { Logger, Logging } from "@decaf-ts/logging";
import { readFileYaml, writeFileYaml } from "../../utils/yaml";
import path from "path";
import fs from "fs";

export class FabricCAClientConfigBuilder {
  private log: Logger;

  private config: any = readFileYaml(
    path.join(__dirname, "../../../config/fabric-ca-client-config.yaml")
  ) as any;

  constructor(logger?: Logger) {
    if (!logger) this.log = Logging.for(FabricCAClientConfigBuilder);
    else this.log = logger.for(FabricCAClientConfigBuilder.name);
  }

  setCustom(key: string, value: any) {
    this.config.key = value;
  }
  deleteBCCSP() {
    delete this.config.bccsp;
  }

  /**
   * @description Saves the current configuration to a file.
   * @summary Writes the current Fabric CA Server configuration to a YAML file at the specified path. If the directory doesn't exist, it will be created.
   * @param {string} cpath - The path where the configuration file should be saved.
   * @return {this} The current instance of the builder for method chaining.
   * @example
   * const builder = new FabricCAServerCommandBuilder();
   * builder.save('/path/to/config/fabric-ca-server.yaml');
   *
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Builder as FabricCAServerCommandBuilder
   *   participant FileSystem as File System
   *   Client->>Builder: saveConfig('/path/to/config/fabric-ca-server.yaml')
   *   Builder->>Builder: Check if cpath is defined
   *   alt cpath is defined
   *     Builder->>FileSystem: Check if directory exists
   *     alt Directory doesn't exist
   *       Builder->>FileSystem: Create directory
   *     end
   *     Builder->>Builder: Log debug message
   *     Builder->>FileSystem: Write YAML configuration to file
   *   end
   *   Builder-->>Client: Return this
   */
  save(cpath?: string): this {
    if (cpath === undefined) return this;

    let destination = cpath;
    if (!destination.endsWith(".yaml"))
      destination = path.join(destination, "fabric-ca-client-config.yaml");

    const directory = path.dirname(destination);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    this.log.debug(`Writing configuration to ${destination}`);
    this.log.debug(`Config file: ${JSON.stringify(this.config, null, 2)}`);
    writeFileYaml(destination, this.config);

    return this;
  }
}
