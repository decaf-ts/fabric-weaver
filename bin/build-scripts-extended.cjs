#!/usr/bin/env node
'use strict';

var utils = require('@decaf-ts/utils');
var fs = require('fs');
var path = require('path');

/**
 * @module build-scripts
 * @description Custom build scripts for the fabric-weaver project.
 * @summary This module extends the BuildScripts class from @decaf-ts/utils to provide custom build functionality for the fabric-weaver project. It includes utilities for building command-line interfaces and handling different module formats (CommonJS and ES Modules).
 */
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
        const commands = fs.readdirSync(path.join(process.cwd() + "/src/bin"));
        for (const cmd of commands) {
            if (!cmd.endsWith(".ts"))
                continue;
            const commandName = cmd.replace(/\.ts$/, "");
            await this.bundle(Modes.CJS, true, true, `src/bin/${cmd}`, commandName);
            let data = utils.readFile(`bin/${commandName}.cjs`);
            data = "#!/usr/bin/env node\n" + data;
            utils.writeFile(`bin/${commandName}.cjs`, data);
            fs.chmodSync(`bin/${commandName}.cjs`, "755");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc2NyaXB0cy1leHRlbmRlZC5janMiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy1vbGQvYnVpbGQtc2NyaXB0cy50cyIsIi4uL3NyYy9iaW4vYnVpbGQtc2NyaXB0cy1leHRlbmRlZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBtb2R1bGUgYnVpbGQtc2NyaXB0c1xuICogQGRlc2NyaXB0aW9uIEN1c3RvbSBidWlsZCBzY3JpcHRzIGZvciB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0LlxuICogQHN1bW1hcnkgVGhpcyBtb2R1bGUgZXh0ZW5kcyB0aGUgQnVpbGRTY3JpcHRzIGNsYXNzIGZyb20gQGRlY2FmLXRzL3V0aWxzIHRvIHByb3ZpZGUgY3VzdG9tIGJ1aWxkIGZ1bmN0aW9uYWxpdHkgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuIEl0IGluY2x1ZGVzIHV0aWxpdGllcyBmb3IgYnVpbGRpbmcgY29tbWFuZC1saW5lIGludGVyZmFjZXMgYW5kIGhhbmRsaW5nIGRpZmZlcmVudCBtb2R1bGUgZm9ybWF0cyAoQ29tbW9uSlMgYW5kIEVTIE1vZHVsZXMpLlxuICovXG5cbmltcG9ydCB7IEJ1aWxkU2NyaXB0cywgcmVhZEZpbGUsIHdyaXRlRmlsZSB9IGZyb20gXCJAZGVjYWYtdHMvdXRpbHNcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIEVudW1lcmF0aW9uIG9mIG1vZHVsZSBtb2Rlcy5cbiAqIEBzdW1tYXJ5IERlZmluZXMgdGhlIGRpZmZlcmVudCBtb2R1bGUgZm9ybWF0cyBzdXBwb3J0ZWQgaW4gdGhlIGJ1aWxkIHByb2Nlc3MuXG4gKiBAZW51bSB7c3RyaW5nfVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyT2YgbW9kdWxlOmJ1aWxkLXNjcmlwdHNcbiAqL1xuZW51bSBNb2RlcyB7XG4gIC8qKiBDb21tb25KUyBtb2R1bGUgZm9ybWF0ICovXG4gIENKUyA9IFwiY29tbW9uanNcIixcbiAgLyoqIEVDTUFTY3JpcHQgbW9kdWxlIGZvcm1hdCAoRVMyMDIyKSAqL1xuICBFU00gPSBcImVzMjAyMlwiLFxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDdXN0b20gYnVpbGQgc2NyaXB0cyBmb3IgdGhlIGZhYnJpYy13ZWF2ZXIgcHJvamVjdC5cbiAqIEBzdW1tYXJ5IEV4dGVuZHMgdGhlIEJ1aWxkU2NyaXB0cyBjbGFzcyB0byBwcm92aWRlIHByb2plY3Qtc3BlY2lmaWMgYnVpbGQgZnVuY3Rpb25hbGl0eSwgaW5jbHVkaW5nIGNvbW1hbmQgYnVuZGxpbmcgYW5kIGZpbGUgbWFuaXB1bGF0aW9uLlxuICogQGNsYXNzIEJ1aWxkU2NyaXB0c0N1c3RvbVxuICogQGV4dGVuZHMgQnVpbGRTY3JpcHRzXG4gKi9cbmV4cG9ydCBjbGFzcyBCdWlsZFNjcmlwdHNDdXN0b20gZXh0ZW5kcyBCdWlsZFNjcmlwdHMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIEJ1aWxkcyBjb21tYW5kLWxpbmUgaW50ZXJmYWNlcyBmb3IgdGhlIHByb2plY3QuXG4gICAqIEBzdW1tYXJ5IFByb2Nlc3NlcyBlYWNoIGNvbW1hbmQgaW4gdGhlIENvbW1hbmRzIGFycmF5LCBidW5kbGluZyB0aGUgVHlwZVNjcmlwdCBmaWxlcywgYWRkaW5nIGEgc2hlYmFuZyBsaW5lLCBhbmQgc2V0dGluZyBhcHByb3ByaWF0ZSBwZXJtaXNzaW9ucy5cbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn1cbiAgICogQG1lcm1haWRcbiAgICogc2VxdWVuY2VEaWFncmFtXG4gICAqICAgcGFydGljaXBhbnQgQnVpbGRTY3JpcHRzQ3VzdG9tXG4gICAqICAgcGFydGljaXBhbnQgRmlsZVN5c3RlbVxuICAgKiAgIGxvb3AgRm9yIGVhY2ggY29tbWFuZFxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+QnVpbGRTY3JpcHRzQ3VzdG9tOiBidW5kbGUoTW9kZXMuQ0pTLCB0cnVlLCB0cnVlLCBgc3JjL2Jpbi8ke2NtZH0udHNgLCBjbWQpXG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5GaWxlU3lzdGVtOiByZWFkRmlsZShgYmluLyR7Y21kfS5janNgKVxuICAgKiAgICAgRmlsZVN5c3RlbS0tPj5CdWlsZFNjcmlwdHNDdXN0b206IGZpbGUgY29udGVudFxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+QnVpbGRTY3JpcHRzQ3VzdG9tOiBBZGQgc2hlYmFuZyB0byBmaWxlIGNvbnRlbnRcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkZpbGVTeXN0ZW06IHdyaXRlRmlsZShgYmluLyR7Y21kfS5janNgLCBtb2RpZmllZCBjb250ZW50KVxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+RmlsZVN5c3RlbTogY2htb2RTeW5jKGBiaW4vJHtjbWR9LmNqc2AsIFwiNzU1XCIpXG4gICAqICAgZW5kXG4gICAqL1xuICBvdmVycmlkZSBhc3luYyBidWlsZENvbW1hbmRzKCkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gZnMucmVhZGRpclN5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCkgKyBcIi9zcmMvYmluXCIpKTtcbiAgICBmb3IgKGNvbnN0IGNtZCBvZiBjb21tYW5kcykge1xuICAgICAgaWYgKCFjbWQuZW5kc1dpdGgoXCIudHNcIikpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGNtZC5yZXBsYWNlKC9cXC50cyQvLCBcIlwiKTtcbiAgICAgIGF3YWl0IHRoaXMuYnVuZGxlKE1vZGVzLkNKUywgdHJ1ZSwgdHJ1ZSwgYHNyYy9iaW4vJHtjbWR9YCwgY29tbWFuZE5hbWUpO1xuICAgICAgbGV0IGRhdGEgPSByZWFkRmlsZShgYmluLyR7Y29tbWFuZE5hbWV9LmNqc2ApO1xuICAgICAgZGF0YSA9IFwiIyEvdXNyL2Jpbi9lbnYgbm9kZVxcblwiICsgZGF0YTtcbiAgICAgIHdyaXRlRmlsZShgYmluLyR7Y29tbWFuZE5hbWV9LmNqc2AsIGRhdGEpO1xuICAgICAgZnMuY2htb2RTeW5jKGBiaW4vJHtjb21tYW5kTmFtZX0uY2pzYCwgXCI3NTVcIik7XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIEBtb2R1bGUgYnVpbGQtc2NyaXB0cy1leHRlbmRlZFxuICogQGRlc2NyaXB0aW9uIFNjcmlwdCBmb3IgYnVpbGRpbmcgZXh0ZW5kZWQgc2NyaXB0cyBpbiB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0XG4gKiBAc3VtbWFyeSBUaGlzIHNjcmlwdCBpcyByZXNwb25zaWJsZSBmb3IgZXhlY3V0aW5nIHRoZSBjdXN0b20gYnVpbGQgcHJvY2VzcyBmb3IgZXh0ZW5kZWQgc2NyaXB0cyBpbiB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0LiBJdCB1dGlsaXplcyB0aGUgQnVpbGRTY3JpcHRzQ3VzdG9tIGNsYXNzIHRvIHBlcmZvcm0gdGhlIGJ1aWxkIG9wZXJhdGlvbnMgYW5kIGhhbmRsZSBsb2dnaW5nLlxuICpcbiAqIFRoZSBzY3JpcHQgcGVyZm9ybXMgdGhlIGZvbGxvd2luZyBhY3Rpb25zOlxuICogMS4gSW1wb3J0cyB0aGUgQnVpbGRTY3JpcHRzQ3VzdG9tIGNsYXNzIGZyb20gdGhlIGJ1aWxkLXNjcmlwdHMgdXRpbGl0eS5cbiAqIDIuIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgQnVpbGRTY3JpcHRzQ3VzdG9tLlxuICogMy4gRXhlY3V0ZXMgdGhlIGJ1aWxkIHByb2Nlc3MuXG4gKiA0LiBMb2dzIHRoZSBzdWNjZXNzIG9yIGZhaWx1cmUgb2YgdGhlIGJ1aWxkIHByb2Nlc3MuXG4gKiA1LiBFeGl0cyB0aGUgcHJvY2VzcyB3aXRoIGFuIGVycm9yIGNvZGUgaWYgdGhlIGJ1aWxkIGZhaWxzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSdW4gdGhlIHNjcmlwdCBmcm9tIHRoZSBjb21tYW5kIGxpbmVcbiAqICQgbm9kZSBidWlsZC1zY3JpcHRzLWV4dGVuZGVkLmpzXG4gKlxuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBTY3JpcHQgYXMgYnVpbGQtc2NyaXB0cy1leHRlbmRlZFxuICogICBwYXJ0aWNpcGFudCBCdWlsZGVyIGFzIEJ1aWxkU2NyaXB0c0N1c3RvbVxuICogICBwYXJ0aWNpcGFudCBQcm9jZXNzIGFzIE5vZGUgUHJvY2Vzc1xuICogICBTY3JpcHQtPj5CdWlsZGVyOiBuZXcgQnVpbGRTY3JpcHRzQ3VzdG9tKClcbiAqICAgU2NyaXB0LT4+QnVpbGRlcjogZXhlY3V0ZSgpXG4gKiAgIGFsdCBCdWlsZCBTdWNjZXNzZnVsXG4gKiAgICAgQnVpbGRlci0tPj5TY3JpcHQ6IFByb21pc2UgcmVzb2x2ZWRcbiAqICAgICBTY3JpcHQtPj5CdWlsZGVyOiBsb2cuaW5mbyhcIlNjcmlwdHMgYnVpbHQgc3VjY2Vzc2Z1bGx5LlwiKVxuICogICBlbHNlIEJ1aWxkIEZhaWxlZFxuICogICAgIEJ1aWxkZXItLT4+U2NyaXB0OiBQcm9taXNlIHJlamVjdGVkXG4gKiAgICAgU2NyaXB0LT4+QnVpbGRlcjogbG9nLmVycm9yKFwiRXJyb3IgYnVpbGRpbmcgc2NyaXB0czogLi4uXCIpXG4gKiAgICAgU2NyaXB0LT4+UHJvY2VzczogZXhpdCgxKVxuICogICBlbmRcbiAqXG4gKiBAbWVtYmVyT2YgbW9kdWxlOmZhYnJpYy13ZWF2ZXJcbiAqL1xuXG5pbXBvcnQgeyBCdWlsZFNjcmlwdHNDdXN0b20gfSBmcm9tIFwiLi4vdXRpbHMtb2xkL2J1aWxkLXNjcmlwdHNcIjtcblxubmV3IEJ1aWxkU2NyaXB0c0N1c3RvbSgpXG4gIC5leGVjdXRlKClcbiAgLnRoZW4oKCkgPT4gQnVpbGRTY3JpcHRzQ3VzdG9tLmxvZy5pbmZvKFwiU2NyaXB0cyBidWlsdCBzdWNjZXNzZnVsbHkuXCIpKVxuICAuY2F0Y2goKGU6IHVua25vd24pID0+IHtcbiAgICBCdWlsZFNjcmlwdHNDdXN0b20ubG9nLmVycm9yKGBFcnJvciBidWlsZGluZyBzY3JpcHRzOiAke2V9YCk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9KTtcbiJdLCJuYW1lcyI6WyJCdWlsZFNjcmlwdHMiLCJyZWFkRmlsZSIsIndyaXRlRmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFJRztBQU1IOzs7Ozs7QUFNRztBQUNILElBQUssS0FLSjtBQUxELENBQUEsVUFBSyxLQUFLLEVBQUE7O0FBRVIsSUFBQSxLQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsVUFBZ0I7O0FBRWhCLElBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxHQUFBLFFBQWM7QUFDaEIsQ0FBQyxFQUxJLEtBQUssS0FBTCxLQUFLLEdBS1QsRUFBQSxDQUFBLENBQUE7QUFFRDs7Ozs7QUFLRztBQUNHLE1BQU8sa0JBQW1CLFNBQVFBLGtCQUFZLENBQUE7QUFDbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkc7QUFDTSxJQUFBLE1BQU0sYUFBYSxHQUFBO0FBQzFCLFFBQUEsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztBQUN0RSxRQUFBLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFO0FBQzFCLFlBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUFFO1lBRTFCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztBQUM1QyxZQUFBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBVyxRQUFBLEVBQUEsR0FBRyxFQUFFLEVBQUUsV0FBVyxDQUFDO1lBQ3ZFLElBQUksSUFBSSxHQUFHQyxjQUFRLENBQUMsT0FBTyxXQUFXLENBQUEsSUFBQSxDQUFNLENBQUM7QUFDN0MsWUFBQSxJQUFJLEdBQUcsdUJBQXVCLEdBQUcsSUFBSTtBQUNyQyxZQUFBQyxlQUFTLENBQUMsQ0FBTyxJQUFBLEVBQUEsV0FBVyxNQUFNLEVBQUUsSUFBSSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQSxJQUFBLEVBQU8sV0FBVyxDQUFNLElBQUEsQ0FBQSxFQUFFLEtBQUssQ0FBQzs7O0FBR2xEOztBQzdERDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNHO0FBSUgsSUFBSSxrQkFBa0I7QUFDbkIsS0FBQSxPQUFPO0FBQ1AsS0FBQSxJQUFJLENBQUMsTUFBTSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDO0FBQ3JFLEtBQUEsS0FBSyxDQUFDLENBQUMsQ0FBVSxLQUFJO0lBQ3BCLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBMkIsd0JBQUEsRUFBQSxDQUFDLENBQUUsQ0FBQSxDQUFDO0FBQzVELElBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakIsQ0FBQyxDQUFDOzsifQ==
