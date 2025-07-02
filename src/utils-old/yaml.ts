import fs from "fs";
import yaml from "js-yaml";
import { Logging } from "@decaf-ts/logging";

const logger = Logging.for("yaml");

/**
 * @description Reads and parses a YAML file, optionally retrieving a specific property.
 * @summary This function reads a YAML file from the given path, parses its content, and returns either the entire parsed YAML object or a specific property value based on the provided path.
 *
 * @function readFileYaml
 * @template T - The type of the returned value when a specific property is requested.
 * @param {string} yamlFilePath - The path to the YAML file to be read.
 * @param {string} [variable] - Optional. A dot-notated path string that specifies the property to retrieve from the parsed YAML.
 * @return {Record<string, any> | T} Returns the entire parsed YAML object if no `variable` is provided, or the value of the specified property if `variable` is provided.
 *
 * @memberOf module:fabric-weaver.Utils
 *
 * @example
 * // Example 1: Read the entire YAML file
 * const config = readFileYaml("config/settings.yaml");
 * console.log(config);
 *
 * @example
 * // Example 2: Retrieve a specific property from the YAML file
 * const dbHost = readFileYaml("config/settings.yaml", "database.host");
 * console.log(dbHost);
 *
 * @example
 * // Example 3: Handle an error if the property does not exist
 * const invalidProperty = readFileYaml("config/settings.yaml", "server.port");
 *
 * @mermaid
 * sequenceDiagram
 *   participant Caller
 *   participant readFileYaml
 *   participant logger
 *   participant fs
 *   participant yaml
 *
 *   Caller->>readFileYaml: Call with yamlFilePath and optional variable
 *   readFileYaml->>logger: Log verbose message (Reading YAML file)
 *   readFileYaml->>fs: Read file content
 *   readFileYaml->>logger: Log verbose message (Parsed YAML content)
 *   readFileYaml->>yaml: Parse YAML content
 *   readFileYaml->>logger: Log verbose message (Parsed YAML object)
 *   alt variable is provided
 *     readFileYaml->>readFileYaml: Navigate through parsed YAML using variable path
 *     alt Property exists
 *       readFileYaml-->>Caller: Return specific property value
 *     else Property doesn't exist
 *       readFileYaml->>logger: Log error message
 *       readFileYaml-->>Caller: Return error
 *     end
 *   else variable is not provided
 *     readFileYaml-->>Caller: Return entire parsed YAML object
 *   end
 */
export function readFileYaml<T>(
  yamlFilePath: string,
  variable?: string
): Record<string, any> | T {
  const log = logger.for(readFileYaml);

  log.verbose(`Reading YAML file: ${yamlFilePath}`, 3);
  const content = fs.readFileSync(yamlFilePath, "utf8");

  log.verbose(`Parsed YAML content: ${content}`, 3);
  const parsedYAML = yaml.load(content) as Record<string, any>;

  log.verbose(`Parsed YAML object: ${JSON.stringify(parsedYAML)}`, 3);

  log.info(
    `Returning ${variable ? `property '${variable}'` : "the entire parsed YAML object"}`
  );
  if (!variable) return parsedYAML;

  const variablePath = variable.split(".");
  return variablePath.reduce((acc, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!acc.hasOwnProperty(key)) {
      // Log an error if the property does not exist in the YAML structure
      return log.error(
        `Unable to locate a property named '${key}' from path '${variable}' in file: \n> ${yamlFilePath}`
      );
    }
    return typeof acc[key] === "string" ? acc[key].trim() : acc[key];
  }, parsedYAML);
}

/**
 * @description Writes a JSON object to a YAML file.
 * @summary This function takes a JSON object and writes it to a specified file path in YAML format.
 * It uses js-yaml to convert the JSON to YAML, and then writes the content to the file.
 *
 * @function writeFileYaml
 * @template T - The type of the JSON object to be written.
 * @param {string} path - The file path where the YAML content will be written.
 * @param {T} json - The JSON object to be converted to YAML and written to the file.
 * @return {void}
 *
 * @memberOf module:fabric-weaver.Utils
 *
 * @example
 * const config = { database: { host: 'localhost', port: 5432 } };
 * writeFileYaml('config/settings.yaml', config);
 *
 * @mermaid
 * sequenceDiagram
 *   participant Caller
 *   participant writeFileYaml
 *   participant logger
 *   participant yaml
 *   participant fs
 *
 *   Caller->>writeFileYaml: Call with path and JSON
 *   writeFileYaml->>logger: Log verbose message (Writing YAML file)
 *   writeFileYaml->>logger: Log verbose message (Writing YAML content)
 *   writeFileYaml->>yaml: Convert JSON to YAML
 *   writeFileYaml->>logger: Log verbose message (Writing YAML content to file)
 *   writeFileYaml->>fs: Write YAML content to file
 *   writeFileYaml-->>Caller: Return (void)
 */
export function writeFileYaml<T>(path: string, json: T) {
  const log = logger.for(writeFileYaml);

  log.verbose(`Writing YAML file: ${path}`, 3);
  log.verbose(`Writing YAML content: ${JSON.stringify(json)}`, 3);
  const content = yaml.dump(json, { indent: 2, lineWidth: -1 });

  log.verbose(`Writing YAML content to file: ${content}`, 3);
  fs.writeFileSync(path, content.replace(/ null$/gm, ""), "utf8");
}
