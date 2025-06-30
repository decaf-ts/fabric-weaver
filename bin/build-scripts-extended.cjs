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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc2NyaXB0cy1leHRlbmRlZC5janMiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy9idWlsZC1zY3JpcHRzLnRzIiwiLi4vc3JjL2Jpbi9idWlsZC1zY3JpcHRzLWV4dGVuZGVkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQG1vZHVsZSBidWlsZC1zY3JpcHRzXG4gKiBAZGVzY3JpcHRpb24gQ3VzdG9tIGJ1aWxkIHNjcmlwdHMgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuXG4gKiBAc3VtbWFyeSBUaGlzIG1vZHVsZSBleHRlbmRzIHRoZSBCdWlsZFNjcmlwdHMgY2xhc3MgZnJvbSBAZGVjYWYtdHMvdXRpbHMgdG8gcHJvdmlkZSBjdXN0b20gYnVpbGQgZnVuY3Rpb25hbGl0eSBmb3IgdGhlIGZhYnJpYy13ZWF2ZXIgcHJvamVjdC4gSXQgaW5jbHVkZXMgdXRpbGl0aWVzIGZvciBidWlsZGluZyBjb21tYW5kLWxpbmUgaW50ZXJmYWNlcyBhbmQgaGFuZGxpbmcgZGlmZmVyZW50IG1vZHVsZSBmb3JtYXRzIChDb21tb25KUyBhbmQgRVMgTW9kdWxlcykuXG4gKi9cblxuaW1wb3J0IHsgQnVpbGRTY3JpcHRzLCByZWFkRmlsZSwgd3JpdGVGaWxlIH0gZnJvbSBcIkBkZWNhZi10cy91dGlsc1wiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBMaXN0IG9mIGNvbW1hbmQgbmFtZXMgdG8gYmUgYnVpbHQuXG4gKiBAc3VtbWFyeSBEZWZpbmVzIHRoZSBjb21tYW5kLWxpbmUgaW50ZXJmYWNlcyB0aGF0IHdpbGwgYmUgZ2VuZXJhdGVkIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIEBjb25zdCB7c3RyaW5nW119IENvbW1hbmRzXG4gKiBAbWVtYmVyT2YgbW9kdWxlOmJ1aWxkLXNjcmlwdHNcbiAqL1xuY29uc3QgQ29tbWFuZHMgPSBbXCJmYWJyaWNcIiwgXCJidWlsZC1zY3JpcHRzLWV4dGVuZGVkXCJdO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbnVtZXJhdGlvbiBvZiBtb2R1bGUgbW9kZXMuXG4gKiBAc3VtbWFyeSBEZWZpbmVzIHRoZSBkaWZmZXJlbnQgbW9kdWxlIGZvcm1hdHMgc3VwcG9ydGVkIGluIHRoZSBidWlsZCBwcm9jZXNzLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1lbWJlck9mIG1vZHVsZTpidWlsZC1zY3JpcHRzXG4gKi9cbmVudW0gTW9kZXMge1xuICAvKiogQ29tbW9uSlMgbW9kdWxlIGZvcm1hdCAqL1xuICBDSlMgPSBcImNvbW1vbmpzXCIsXG4gIC8qKiBFQ01BU2NyaXB0IG1vZHVsZSBmb3JtYXQgKEVTMjAyMikgKi9cbiAgRVNNID0gXCJlczIwMjJcIixcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ3VzdG9tIGJ1aWxkIHNjcmlwdHMgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuXG4gKiBAc3VtbWFyeSBFeHRlbmRzIHRoZSBCdWlsZFNjcmlwdHMgY2xhc3MgdG8gcHJvdmlkZSBwcm9qZWN0LXNwZWNpZmljIGJ1aWxkIGZ1bmN0aW9uYWxpdHksIGluY2x1ZGluZyBjb21tYW5kIGJ1bmRsaW5nIGFuZCBmaWxlIG1hbmlwdWxhdGlvbi5cbiAqIEBjbGFzcyBCdWlsZFNjcmlwdHNDdXN0b21cbiAqIEBleHRlbmRzIEJ1aWxkU2NyaXB0c1xuICovXG5leHBvcnQgY2xhc3MgQnVpbGRTY3JpcHRzQ3VzdG9tIGV4dGVuZHMgQnVpbGRTY3JpcHRzIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBCdWlsZHMgY29tbWFuZC1saW5lIGludGVyZmFjZXMgZm9yIHRoZSBwcm9qZWN0LlxuICAgKiBAc3VtbWFyeSBQcm9jZXNzZXMgZWFjaCBjb21tYW5kIGluIHRoZSBDb21tYW5kcyBhcnJheSwgYnVuZGxpbmcgdGhlIFR5cGVTY3JpcHQgZmlsZXMsIGFkZGluZyBhIHNoZWJhbmcgbGluZSwgYW5kIHNldHRpbmcgYXBwcm9wcmlhdGUgcGVybWlzc2lvbnMuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZD59XG4gICAqIEBtZXJtYWlkXG4gICAqIHNlcXVlbmNlRGlhZ3JhbVxuICAgKiAgIHBhcnRpY2lwYW50IEJ1aWxkU2NyaXB0c0N1c3RvbVxuICAgKiAgIHBhcnRpY2lwYW50IEZpbGVTeXN0ZW1cbiAgICogICBsb29wIEZvciBlYWNoIGNvbW1hbmRcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkJ1aWxkU2NyaXB0c0N1c3RvbTogYnVuZGxlKE1vZGVzLkNKUywgdHJ1ZSwgdHJ1ZSwgYHNyYy9iaW4vJHtjbWR9LnRzYCwgY21kKVxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+RmlsZVN5c3RlbTogcmVhZEZpbGUoYGJpbi8ke2NtZH0uY2pzYClcbiAgICogICAgIEZpbGVTeXN0ZW0tLT4+QnVpbGRTY3JpcHRzQ3VzdG9tOiBmaWxlIGNvbnRlbnRcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkJ1aWxkU2NyaXB0c0N1c3RvbTogQWRkIHNoZWJhbmcgdG8gZmlsZSBjb250ZW50XG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5GaWxlU3lzdGVtOiB3cml0ZUZpbGUoYGJpbi8ke2NtZH0uY2pzYCwgbW9kaWZpZWQgY29udGVudClcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkZpbGVTeXN0ZW06IGNobW9kU3luYyhgYmluLyR7Y21kfS5janNgLCBcIjc1NVwiKVxuICAgKiAgIGVuZFxuICAgKi9cbiAgYXN5bmMgYnVpbGRDb21tYW5kcygpIHtcbiAgICBmb3IgKGNvbnN0IGNtZCBvZiBDb21tYW5kcykge1xuICAgICAgYXdhaXQgdGhpcy5idW5kbGUoTW9kZXMuQ0pTLCB0cnVlLCB0cnVlLCBgc3JjL2Jpbi8ke2NtZH0udHNgLCBjbWQpO1xuICAgICAgbGV0IGRhdGEgPSByZWFkRmlsZShgYmluLyR7Y21kfS5janNgKTtcbiAgICAgIGRhdGEgPSBcIiMhL3Vzci9iaW4vZW52IG5vZGVcXG5cIiArIGRhdGE7XG4gICAgICB3cml0ZUZpbGUoYGJpbi8ke2NtZH0uY2pzYCwgZGF0YSk7XG4gICAgICBmcy5jaG1vZFN5bmMoYGJpbi8ke2NtZH0uY2pzYCwgXCI3NTVcIik7XG4gICAgfVxuICB9XG59IiwiLyoqXG4gKiBAbW9kdWxlIGJ1aWxkLXNjcmlwdHMtZXh0ZW5kZWRcbiAqIEBkZXNjcmlwdGlvbiBTY3JpcHQgZm9yIGJ1aWxkaW5nIGV4dGVuZGVkIHNjcmlwdHMgaW4gdGhlIGZhYnJpYy13ZWF2ZXIgcHJvamVjdFxuICogQHN1bW1hcnkgVGhpcyBzY3JpcHQgaXMgcmVzcG9uc2libGUgZm9yIGV4ZWN1dGluZyB0aGUgY3VzdG9tIGJ1aWxkIHByb2Nlc3MgZm9yIGV4dGVuZGVkIHNjcmlwdHMgaW4gdGhlIGZhYnJpYy13ZWF2ZXIgcHJvamVjdC4gSXQgdXRpbGl6ZXMgdGhlIEJ1aWxkU2NyaXB0c0N1c3RvbSBjbGFzcyB0byBwZXJmb3JtIHRoZSBidWlsZCBvcGVyYXRpb25zIGFuZCBoYW5kbGUgbG9nZ2luZy5cbiAqXG4gKiBUaGUgc2NyaXB0IHBlcmZvcm1zIHRoZSBmb2xsb3dpbmcgYWN0aW9uczpcbiAqIDEuIEltcG9ydHMgdGhlIEJ1aWxkU2NyaXB0c0N1c3RvbSBjbGFzcyBmcm9tIHRoZSBidWlsZC1zY3JpcHRzIHV0aWxpdHkuXG4gKiAyLiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIEJ1aWxkU2NyaXB0c0N1c3RvbS5cbiAqIDMuIEV4ZWN1dGVzIHRoZSBidWlsZCBwcm9jZXNzLlxuICogNC4gTG9ncyB0aGUgc3VjY2VzcyBvciBmYWlsdXJlIG9mIHRoZSBidWlsZCBwcm9jZXNzLlxuICogNS4gRXhpdHMgdGhlIHByb2Nlc3Mgd2l0aCBhbiBlcnJvciBjb2RlIGlmIHRoZSBidWlsZCBmYWlscy5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUnVuIHRoZSBzY3JpcHQgZnJvbSB0aGUgY29tbWFuZCBsaW5lXG4gKiAkIG5vZGUgYnVpbGQtc2NyaXB0cy1leHRlbmRlZC5qc1xuICpcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgU2NyaXB0IGFzIGJ1aWxkLXNjcmlwdHMtZXh0ZW5kZWRcbiAqICAgcGFydGljaXBhbnQgQnVpbGRlciBhcyBCdWlsZFNjcmlwdHNDdXN0b21cbiAqICAgcGFydGljaXBhbnQgUHJvY2VzcyBhcyBOb2RlIFByb2Nlc3NcbiAqICAgU2NyaXB0LT4+QnVpbGRlcjogbmV3IEJ1aWxkU2NyaXB0c0N1c3RvbSgpXG4gKiAgIFNjcmlwdC0+PkJ1aWxkZXI6IGV4ZWN1dGUoKVxuICogICBhbHQgQnVpbGQgU3VjY2Vzc2Z1bFxuICogICAgIEJ1aWxkZXItLT4+U2NyaXB0OiBQcm9taXNlIHJlc29sdmVkXG4gKiAgICAgU2NyaXB0LT4+QnVpbGRlcjogbG9nLmluZm8oXCJTY3JpcHRzIGJ1aWx0IHN1Y2Nlc3NmdWxseS5cIilcbiAqICAgZWxzZSBCdWlsZCBGYWlsZWRcbiAqICAgICBCdWlsZGVyLS0+PlNjcmlwdDogUHJvbWlzZSByZWplY3RlZFxuICogICAgIFNjcmlwdC0+PkJ1aWxkZXI6IGxvZy5lcnJvcihcIkVycm9yIGJ1aWxkaW5nIHNjcmlwdHM6IC4uLlwiKVxuICogICAgIFNjcmlwdC0+PlByb2Nlc3M6IGV4aXQoMSlcbiAqICAgZW5kXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtd2VhdmVyXG4gKi9cblxuaW1wb3J0IHsgQnVpbGRTY3JpcHRzQ3VzdG9tIH0gZnJvbSBcIi4uL3V0aWxzL2J1aWxkLXNjcmlwdHNcIjtcblxubmV3IEJ1aWxkU2NyaXB0c0N1c3RvbSgpXG4gIC5leGVjdXRlKClcbiAgLnRoZW4oKCkgPT4gQnVpbGRTY3JpcHRzQ3VzdG9tLmxvZy5pbmZvKFwiU2NyaXB0cyBidWlsdCBzdWNjZXNzZnVsbHkuXCIpKVxuICAuY2F0Y2goKGU6IHVua25vd24pID0+IHtcbiAgICBCdWlsZFNjcmlwdHNDdXN0b20ubG9nLmVycm9yKGBFcnJvciBidWlsZGluZyBzY3JpcHRzOiAke2V9YCk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9KTtcbiJdLCJuYW1lcyI6WyJCdWlsZFNjcmlwdHMiLCJyZWFkRmlsZSIsIndyaXRlRmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7OztBQUlHO0FBS0g7Ozs7O0FBS0c7QUFDSCxNQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsRUFBRSx3QkFBd0IsQ0FBQztBQUVyRDs7Ozs7O0FBTUc7QUFDSCxJQUFLLEtBS0o7QUFMRCxDQUFBLFVBQUssS0FBSyxFQUFBOztBQUVSLElBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLFVBQWdCOztBQUVoQixJQUFBLEtBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxRQUFjO0FBQ2hCLENBQUMsRUFMSSxLQUFLLEtBQUwsS0FBSyxHQUtULEVBQUEsQ0FBQSxDQUFBO0FBRUQ7Ozs7O0FBS0c7QUFDRyxNQUFPLGtCQUFtQixTQUFRQSxrQkFBWSxDQUFBO0FBQ2xEOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JHO0FBQ0gsSUFBQSxNQUFNLGFBQWEsR0FBQTtBQUNqQixRQUFBLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFO0FBQzFCLFlBQUEsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFXLFFBQUEsRUFBQSxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUM7WUFDbEUsSUFBSSxJQUFJLEdBQUdDLGNBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQSxJQUFBLENBQU0sQ0FBQztBQUNyQyxZQUFBLElBQUksR0FBRyx1QkFBdUIsR0FBRyxJQUFJO0FBQ3JDLFlBQUFDLGVBQVMsQ0FBQyxDQUFPLElBQUEsRUFBQSxHQUFHLE1BQU0sRUFBRSxJQUFJLENBQUM7WUFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFBLElBQUEsRUFBTyxHQUFHLENBQU0sSUFBQSxDQUFBLEVBQUUsS0FBSyxDQUFDOzs7QUFHMUM7O0FDaEVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ0c7QUFJSCxJQUFJLGtCQUFrQjtBQUNuQixLQUFBLE9BQU87QUFDUCxLQUFBLElBQUksQ0FBQyxNQUFNLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUM7QUFDckUsS0FBQSxLQUFLLENBQUMsQ0FBQyxDQUFVLEtBQUk7SUFDcEIsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUEyQix3QkFBQSxFQUFBLENBQUMsQ0FBRSxDQUFBLENBQUM7QUFDNUQsSUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQixDQUFDLENBQUM7OyJ9
