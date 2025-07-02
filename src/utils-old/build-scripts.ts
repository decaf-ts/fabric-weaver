/**
 * @module build-scripts
 * @description Custom build scripts for the fabric-weaver project.
 * @summary This module extends the BuildScripts class from @decaf-ts/utils to provide custom build functionality for the fabric-weaver project. It includes utilities for building command-line interfaces and handling different module formats (CommonJS and ES Modules).
 */

import { BuildScripts, readFile, writeFile } from "@decaf-ts/utils";
import fs from "fs";

/**
 * @description List of command names to be built.
 * @summary Defines the command-line interfaces that will be generated during the build process.
 * @const {string[]} Commands
 * @memberOf module:build-scripts
 */
const Commands = ["fabric", "build-scripts-extended"];

/**
 * @description Enumeration of module modes.
 * @summary Defines the different module formats supported in the build process.
 * @enum {string}
 * @readonly
 * @memberOf module:build-scripts
 */
enum Modes {
  /** CommonJS module format */
  CJS = "commonjs",
  /** ECMAScript module format (ES2022) */
  ESM = "es2022",
}

/**
 * @description Custom build scripts for the fabric-weaver project.
 * @summary Extends the BuildScripts class to provide project-specific build functionality, including command bundling and file manipulation.
 * @class BuildScriptsCustom
 * @extends BuildScripts
 */
export class BuildScriptsCustom extends BuildScripts {
  /**
   * @description Builds command-line interfaces for the project.
   * @summary Processes each command in the Commands array, bundling the TypeScript files, adding a shebang line, and setting appropriate permissions.
   * @return {Promise<void>}
   * @mermaid
   * sequenceDiagram
   *   participant BuildScriptsCustom
   *   participant FileSystem
   *   loop For each command
   *     BuildScriptsCustom->>BuildScriptsCustom: bundle(Modes.CJS, true, true, `src/bin/${cmd}.ts`, cmd)
   *     BuildScriptsCustom->>FileSystem: readFile(`bin/${cmd}.cjs`)
   *     FileSystem-->>BuildScriptsCustom: file content
   *     BuildScriptsCustom->>BuildScriptsCustom: Add shebang to file content
   *     BuildScriptsCustom->>FileSystem: writeFile(`bin/${cmd}.cjs`, modified content)
   *     BuildScriptsCustom->>FileSystem: chmodSync(`bin/${cmd}.cjs`, "755")
   *   end
   */
  async buildCommands() {
    for (const cmd of Commands) {
      await this.bundle(Modes.CJS, true, true, `src/bin/${cmd}.ts`, cmd);
      let data = readFile(`bin/${cmd}.cjs`);
      data = "#!/usr/bin/env node\n" + data;
      writeFile(`bin/${cmd}.cjs`, data);
      fs.chmodSync(`bin/${cmd}.cjs`, "755");
    }
  }
}