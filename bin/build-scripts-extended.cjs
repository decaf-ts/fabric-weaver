#!/usr/bin/env node
'use strict';

var utils = require('@decaf-ts/utils');
var fs = require('fs');

/**
 * @module build-scripts
 * @description Custom build scripts for the fabric-weaver project.
 * @summary This module extends the BuildScripts class from @decaf-ts/utils to provide custom build functionality for the fabric-weaver project. It includes utilities for building command-line interfaces and handling different module formats (CommonJS and ES Modules).
 */
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
var Modes;
(function (Modes) {
    /** CommonJS module format */
    Modes["CJS"] = "commonjs";
    /** ECMAScript module format (ES2022) */
    Modes["ESM"] = "es2022";
})(Modes || (Modes = {}));
/**
 * @description Custom build scripts for the fabric-weaver project.
 * @summary Extends the BuildScripts class to provide project-specific build functionality, including command bundling and file manipulation.
 * @class BuildScriptsCustom
 * @extends BuildScripts
 */
class BuildScriptsCustom extends utils.BuildScripts {
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
            let data = utils.readFile(`bin/${cmd}.cjs`);
            data = "#!/usr/bin/env node\n" + data;
            utils.writeFile(`bin/${cmd}.cjs`, data);
            fs.chmodSync(`bin/${cmd}.cjs`, "755");
        }
    }
}

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
new BuildScriptsCustom()
    .execute()
    .then(() => BuildScriptsCustom.log.info("Scripts built successfully."))
    .catch((e) => {
    BuildScriptsCustom.log.error(`Error building scripts: ${e}`);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc2NyaXB0cy1leHRlbmRlZC5janMiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy1vbGQvYnVpbGQtc2NyaXB0cy50cyIsIi4uL3NyYy9iaW4vYnVpbGQtc2NyaXB0cy1leHRlbmRlZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBtb2R1bGUgYnVpbGQtc2NyaXB0c1xuICogQGRlc2NyaXB0aW9uIEN1c3RvbSBidWlsZCBzY3JpcHRzIGZvciB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0LlxuICogQHN1bW1hcnkgVGhpcyBtb2R1bGUgZXh0ZW5kcyB0aGUgQnVpbGRTY3JpcHRzIGNsYXNzIGZyb20gQGRlY2FmLXRzL3V0aWxzIHRvIHByb3ZpZGUgY3VzdG9tIGJ1aWxkIGZ1bmN0aW9uYWxpdHkgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuIEl0IGluY2x1ZGVzIHV0aWxpdGllcyBmb3IgYnVpbGRpbmcgY29tbWFuZC1saW5lIGludGVyZmFjZXMgYW5kIGhhbmRsaW5nIGRpZmZlcmVudCBtb2R1bGUgZm9ybWF0cyAoQ29tbW9uSlMgYW5kIEVTIE1vZHVsZXMpLlxuICovXG5cbmltcG9ydCB7IEJ1aWxkU2NyaXB0cywgcmVhZEZpbGUsIHdyaXRlRmlsZSB9IGZyb20gXCJAZGVjYWYtdHMvdXRpbHNcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gTGlzdCBvZiBjb21tYW5kIG5hbWVzIHRvIGJlIGJ1aWx0LlxuICogQHN1bW1hcnkgRGVmaW5lcyB0aGUgY29tbWFuZC1saW5lIGludGVyZmFjZXMgdGhhdCB3aWxsIGJlIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGJ1aWxkIHByb2Nlc3MuXG4gKiBAY29uc3Qge3N0cmluZ1tdfSBDb21tYW5kc1xuICogQG1lbWJlck9mIG1vZHVsZTpidWlsZC1zY3JpcHRzXG4gKi9cbmNvbnN0IENvbW1hbmRzID0gW1wiZmFicmljXCIsIFwiYnVpbGQtc2NyaXB0cy1leHRlbmRlZFwiXTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRW51bWVyYXRpb24gb2YgbW9kdWxlIG1vZGVzLlxuICogQHN1bW1hcnkgRGVmaW5lcyB0aGUgZGlmZmVyZW50IG1vZHVsZSBmb3JtYXRzIHN1cHBvcnRlZCBpbiB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKiBAcmVhZG9ubHlcbiAqIEBtZW1iZXJPZiBtb2R1bGU6YnVpbGQtc2NyaXB0c1xuICovXG5lbnVtIE1vZGVzIHtcbiAgLyoqIENvbW1vbkpTIG1vZHVsZSBmb3JtYXQgKi9cbiAgQ0pTID0gXCJjb21tb25qc1wiLFxuICAvKiogRUNNQVNjcmlwdCBtb2R1bGUgZm9ybWF0IChFUzIwMjIpICovXG4gIEVTTSA9IFwiZXMyMDIyXCIsXG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIEN1c3RvbSBidWlsZCBzY3JpcHRzIGZvciB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0LlxuICogQHN1bW1hcnkgRXh0ZW5kcyB0aGUgQnVpbGRTY3JpcHRzIGNsYXNzIHRvIHByb3ZpZGUgcHJvamVjdC1zcGVjaWZpYyBidWlsZCBmdW5jdGlvbmFsaXR5LCBpbmNsdWRpbmcgY29tbWFuZCBidW5kbGluZyBhbmQgZmlsZSBtYW5pcHVsYXRpb24uXG4gKiBAY2xhc3MgQnVpbGRTY3JpcHRzQ3VzdG9tXG4gKiBAZXh0ZW5kcyBCdWlsZFNjcmlwdHNcbiAqL1xuZXhwb3J0IGNsYXNzIEJ1aWxkU2NyaXB0c0N1c3RvbSBleHRlbmRzIEJ1aWxkU2NyaXB0cyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gQnVpbGRzIGNvbW1hbmQtbGluZSBpbnRlcmZhY2VzIGZvciB0aGUgcHJvamVjdC5cbiAgICogQHN1bW1hcnkgUHJvY2Vzc2VzIGVhY2ggY29tbWFuZCBpbiB0aGUgQ29tbWFuZHMgYXJyYXksIGJ1bmRsaW5nIHRoZSBUeXBlU2NyaXB0IGZpbGVzLCBhZGRpbmcgYSBzaGViYW5nIGxpbmUsIGFuZCBzZXR0aW5nIGFwcHJvcHJpYXRlIHBlcm1pc3Npb25zLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHZvaWQ+fVxuICAgKiBAbWVybWFpZFxuICAgKiBzZXF1ZW5jZURpYWdyYW1cbiAgICogICBwYXJ0aWNpcGFudCBCdWlsZFNjcmlwdHNDdXN0b21cbiAgICogICBwYXJ0aWNpcGFudCBGaWxlU3lzdGVtXG4gICAqICAgbG9vcCBGb3IgZWFjaCBjb21tYW5kXG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5CdWlsZFNjcmlwdHNDdXN0b206IGJ1bmRsZShNb2Rlcy5DSlMsIHRydWUsIHRydWUsIGBzcmMvYmluLyR7Y21kfS50c2AsIGNtZClcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkZpbGVTeXN0ZW06IHJlYWRGaWxlKGBiaW4vJHtjbWR9LmNqc2ApXG4gICAqICAgICBGaWxlU3lzdGVtLS0+PkJ1aWxkU2NyaXB0c0N1c3RvbTogZmlsZSBjb250ZW50XG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5CdWlsZFNjcmlwdHNDdXN0b206IEFkZCBzaGViYW5nIHRvIGZpbGUgY29udGVudFxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+RmlsZVN5c3RlbTogd3JpdGVGaWxlKGBiaW4vJHtjbWR9LmNqc2AsIG1vZGlmaWVkIGNvbnRlbnQpXG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5GaWxlU3lzdGVtOiBjaG1vZFN5bmMoYGJpbi8ke2NtZH0uY2pzYCwgXCI3NTVcIilcbiAgICogICBlbmRcbiAgICovXG4gIGFzeW5jIGJ1aWxkQ29tbWFuZHMoKSB7XG4gICAgZm9yIChjb25zdCBjbWQgb2YgQ29tbWFuZHMpIHtcbiAgICAgIGF3YWl0IHRoaXMuYnVuZGxlKE1vZGVzLkNKUywgdHJ1ZSwgdHJ1ZSwgYHNyYy9iaW4vJHtjbWR9LnRzYCwgY21kKTtcbiAgICAgIGxldCBkYXRhID0gcmVhZEZpbGUoYGJpbi8ke2NtZH0uY2pzYCk7XG4gICAgICBkYXRhID0gXCIjIS91c3IvYmluL2VudiBub2RlXFxuXCIgKyBkYXRhO1xuICAgICAgd3JpdGVGaWxlKGBiaW4vJHtjbWR9LmNqc2AsIGRhdGEpO1xuICAgICAgZnMuY2htb2RTeW5jKGBiaW4vJHtjbWR9LmNqc2AsIFwiNzU1XCIpO1xuICAgIH1cbiAgfVxufSIsIi8qKlxuICogQG1vZHVsZSBidWlsZC1zY3JpcHRzLWV4dGVuZGVkXG4gKiBAZGVzY3JpcHRpb24gU2NyaXB0IGZvciBidWlsZGluZyBleHRlbmRlZCBzY3JpcHRzIGluIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3RcbiAqIEBzdW1tYXJ5IFRoaXMgc2NyaXB0IGlzIHJlc3BvbnNpYmxlIGZvciBleGVjdXRpbmcgdGhlIGN1c3RvbSBidWlsZCBwcm9jZXNzIGZvciBleHRlbmRlZCBzY3JpcHRzIGluIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuIEl0IHV0aWxpemVzIHRoZSBCdWlsZFNjcmlwdHNDdXN0b20gY2xhc3MgdG8gcGVyZm9ybSB0aGUgYnVpbGQgb3BlcmF0aW9ucyBhbmQgaGFuZGxlIGxvZ2dpbmcuXG4gKlxuICogVGhlIHNjcmlwdCBwZXJmb3JtcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XG4gKiAxLiBJbXBvcnRzIHRoZSBCdWlsZFNjcmlwdHNDdXN0b20gY2xhc3MgZnJvbSB0aGUgYnVpbGQtc2NyaXB0cyB1dGlsaXR5LlxuICogMi4gQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBCdWlsZFNjcmlwdHNDdXN0b20uXG4gKiAzLiBFeGVjdXRlcyB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIDQuIExvZ3MgdGhlIHN1Y2Nlc3Mgb3IgZmFpbHVyZSBvZiB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIDUuIEV4aXRzIHRoZSBwcm9jZXNzIHdpdGggYW4gZXJyb3IgY29kZSBpZiB0aGUgYnVpbGQgZmFpbHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFJ1biB0aGUgc2NyaXB0IGZyb20gdGhlIGNvbW1hbmQgbGluZVxuICogJCBub2RlIGJ1aWxkLXNjcmlwdHMtZXh0ZW5kZWQuanNcbiAqXG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IFNjcmlwdCBhcyBidWlsZC1zY3JpcHRzLWV4dGVuZGVkXG4gKiAgIHBhcnRpY2lwYW50IEJ1aWxkZXIgYXMgQnVpbGRTY3JpcHRzQ3VzdG9tXG4gKiAgIHBhcnRpY2lwYW50IFByb2Nlc3MgYXMgTm9kZSBQcm9jZXNzXG4gKiAgIFNjcmlwdC0+PkJ1aWxkZXI6IG5ldyBCdWlsZFNjcmlwdHNDdXN0b20oKVxuICogICBTY3JpcHQtPj5CdWlsZGVyOiBleGVjdXRlKClcbiAqICAgYWx0IEJ1aWxkIFN1Y2Nlc3NmdWxcbiAqICAgICBCdWlsZGVyLS0+PlNjcmlwdDogUHJvbWlzZSByZXNvbHZlZFxuICogICAgIFNjcmlwdC0+PkJ1aWxkZXI6IGxvZy5pbmZvKFwiU2NyaXB0cyBidWlsdCBzdWNjZXNzZnVsbHkuXCIpXG4gKiAgIGVsc2UgQnVpbGQgRmFpbGVkXG4gKiAgICAgQnVpbGRlci0tPj5TY3JpcHQ6IFByb21pc2UgcmVqZWN0ZWRcbiAqICAgICBTY3JpcHQtPj5CdWlsZGVyOiBsb2cuZXJyb3IoXCJFcnJvciBidWlsZGluZyBzY3JpcHRzOiAuLi5cIilcbiAqICAgICBTY3JpcHQtPj5Qcm9jZXNzOiBleGl0KDEpXG4gKiAgIGVuZFxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6ZmFicmljLXdlYXZlclxuICovXG5cbmltcG9ydCB7IEJ1aWxkU2NyaXB0c0N1c3RvbSB9IGZyb20gXCIuLi91dGlscy1vbGQvYnVpbGQtc2NyaXB0c1wiO1xuXG5uZXcgQnVpbGRTY3JpcHRzQ3VzdG9tKClcbiAgLmV4ZWN1dGUoKVxuICAudGhlbigoKSA9PiBCdWlsZFNjcmlwdHNDdXN0b20ubG9nLmluZm8oXCJTY3JpcHRzIGJ1aWx0IHN1Y2Nlc3NmdWxseS5cIikpXG4gIC5jYXRjaCgoZTogdW5rbm93bikgPT4ge1xuICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS5sb2cuZXJyb3IoYEVycm9yIGJ1aWxkaW5nIHNjcmlwdHM6ICR7ZX1gKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH0pO1xuIl0sIm5hbWVzIjpbIkJ1aWxkU2NyaXB0cyIsInJlYWRGaWxlIiwid3JpdGVGaWxlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7O0FBSUc7QUFLSDs7Ozs7QUFLRztBQUNILE1BQU0sUUFBUSxHQUFHLENBQUMsUUFBUSxFQUFFLHdCQUF3QixDQUFDO0FBRXJEOzs7Ozs7QUFNRztBQUNILElBQUssS0FLSjtBQUxELENBQUEsVUFBSyxLQUFLLEVBQUE7O0FBRVIsSUFBQSxLQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsVUFBZ0I7O0FBRWhCLElBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLFFBQWM7QUFDaEIsQ0FBQyxFQUxJLEtBQUssS0FBTCxLQUFLLEdBS1QsRUFBQSxDQUFBLENBQUE7QUFFRDs7Ozs7QUFLRztBQUNHLE1BQU8sa0JBQW1CLFNBQVFBLGtCQUFZLENBQUE7QUFDbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkc7QUFDSCxJQUFBLE1BQU0sYUFBYSxHQUFBO0FBQ2pCLFFBQUEsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDMUIsWUFBQSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQVcsUUFBQSxFQUFBLEdBQUcsS0FBSyxFQUFFLEdBQUcsQ0FBQztZQUNsRSxJQUFJLElBQUksR0FBR0MsY0FBUSxDQUFDLE9BQU8sR0FBRyxDQUFBLElBQUEsQ0FBTSxDQUFDO0FBQ3JDLFlBQUEsSUFBSSxHQUFHLHVCQUF1QixHQUFHLElBQUk7QUFDckMsWUFBQUMsZUFBUyxDQUFDLENBQU8sSUFBQSxFQUFBLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQztZQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUEsSUFBQSxFQUFPLEdBQUcsQ0FBTSxJQUFBLENBQUEsRUFBRSxLQUFLLENBQUM7OztBQUcxQzs7QUNoRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlDRztBQUlILElBQUksa0JBQWtCO0FBQ25CLEtBQUEsT0FBTztBQUNQLEtBQUEsSUFBSSxDQUFDLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztBQUNyRSxLQUFBLEtBQUssQ0FBQyxDQUFDLENBQVUsS0FBSTtJQUNwQixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQTJCLHdCQUFBLEVBQUEsQ0FBQyxDQUFFLENBQUEsQ0FBQztBQUM1RCxJQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUMsQ0FBQzs7In0=
