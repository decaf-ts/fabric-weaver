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
            await this.bundle(Modes.CJS, true, true, `src/bin/${cmd}`, cmd);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc2NyaXB0cy1leHRlbmRlZC5janMiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy1vbGQvYnVpbGQtc2NyaXB0cy50cyIsIi4uL3NyYy9iaW4vYnVpbGQtc2NyaXB0cy1leHRlbmRlZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBtb2R1bGUgYnVpbGQtc2NyaXB0c1xuICogQGRlc2NyaXB0aW9uIEN1c3RvbSBidWlsZCBzY3JpcHRzIGZvciB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0LlxuICogQHN1bW1hcnkgVGhpcyBtb2R1bGUgZXh0ZW5kcyB0aGUgQnVpbGRTY3JpcHRzIGNsYXNzIGZyb20gQGRlY2FmLXRzL3V0aWxzIHRvIHByb3ZpZGUgY3VzdG9tIGJ1aWxkIGZ1bmN0aW9uYWxpdHkgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuIEl0IGluY2x1ZGVzIHV0aWxpdGllcyBmb3IgYnVpbGRpbmcgY29tbWFuZC1saW5lIGludGVyZmFjZXMgYW5kIGhhbmRsaW5nIGRpZmZlcmVudCBtb2R1bGUgZm9ybWF0cyAoQ29tbW9uSlMgYW5kIEVTIE1vZHVsZXMpLlxuICovXG5cbmltcG9ydCB7IEJ1aWxkU2NyaXB0cywgcmVhZEZpbGUsIHdyaXRlRmlsZSB9IGZyb20gXCJAZGVjYWYtdHMvdXRpbHNcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIEVudW1lcmF0aW9uIG9mIG1vZHVsZSBtb2Rlcy5cbiAqIEBzdW1tYXJ5IERlZmluZXMgdGhlIGRpZmZlcmVudCBtb2R1bGUgZm9ybWF0cyBzdXBwb3J0ZWQgaW4gdGhlIGJ1aWxkIHByb2Nlc3MuXG4gKiBAZW51bSB7c3RyaW5nfVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyT2YgbW9kdWxlOmJ1aWxkLXNjcmlwdHNcbiAqL1xuZW51bSBNb2RlcyB7XG4gIC8qKiBDb21tb25KUyBtb2R1bGUgZm9ybWF0ICovXG4gIENKUyA9IFwiY29tbW9uanNcIixcbiAgLyoqIEVDTUFTY3JpcHQgbW9kdWxlIGZvcm1hdCAoRVMyMDIyKSAqL1xuICBFU00gPSBcImVzMjAyMlwiLFxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDdXN0b20gYnVpbGQgc2NyaXB0cyBmb3IgdGhlIGZhYnJpYy13ZWF2ZXIgcHJvamVjdC5cbiAqIEBzdW1tYXJ5IEV4dGVuZHMgdGhlIEJ1aWxkU2NyaXB0cyBjbGFzcyB0byBwcm92aWRlIHByb2plY3Qtc3BlY2lmaWMgYnVpbGQgZnVuY3Rpb25hbGl0eSwgaW5jbHVkaW5nIGNvbW1hbmQgYnVuZGxpbmcgYW5kIGZpbGUgbWFuaXB1bGF0aW9uLlxuICogQGNsYXNzIEJ1aWxkU2NyaXB0c0N1c3RvbVxuICogQGV4dGVuZHMgQnVpbGRTY3JpcHRzXG4gKi9cbmV4cG9ydCBjbGFzcyBCdWlsZFNjcmlwdHNDdXN0b20gZXh0ZW5kcyBCdWlsZFNjcmlwdHMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIEJ1aWxkcyBjb21tYW5kLWxpbmUgaW50ZXJmYWNlcyBmb3IgdGhlIHByb2plY3QuXG4gICAqIEBzdW1tYXJ5IFByb2Nlc3NlcyBlYWNoIGNvbW1hbmQgaW4gdGhlIENvbW1hbmRzIGFycmF5LCBidW5kbGluZyB0aGUgVHlwZVNjcmlwdCBmaWxlcywgYWRkaW5nIGEgc2hlYmFuZyBsaW5lLCBhbmQgc2V0dGluZyBhcHByb3ByaWF0ZSBwZXJtaXNzaW9ucy5cbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn1cbiAgICogQG1lcm1haWRcbiAgICogc2VxdWVuY2VEaWFncmFtXG4gICAqICAgcGFydGljaXBhbnQgQnVpbGRTY3JpcHRzQ3VzdG9tXG4gICAqICAgcGFydGljaXBhbnQgRmlsZVN5c3RlbVxuICAgKiAgIGxvb3AgRm9yIGVhY2ggY29tbWFuZFxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+QnVpbGRTY3JpcHRzQ3VzdG9tOiBidW5kbGUoTW9kZXMuQ0pTLCB0cnVlLCB0cnVlLCBgc3JjL2Jpbi8ke2NtZH0udHNgLCBjbWQpXG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5GaWxlU3lzdGVtOiByZWFkRmlsZShgYmluLyR7Y21kfS5janNgKVxuICAgKiAgICAgRmlsZVN5c3RlbS0tPj5CdWlsZFNjcmlwdHNDdXN0b206IGZpbGUgY29udGVudFxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+QnVpbGRTY3JpcHRzQ3VzdG9tOiBBZGQgc2hlYmFuZyB0byBmaWxlIGNvbnRlbnRcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkZpbGVTeXN0ZW06IHdyaXRlRmlsZShgYmluLyR7Y21kfS5janNgLCBtb2RpZmllZCBjb250ZW50KVxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+RmlsZVN5c3RlbTogY2htb2RTeW5jKGBiaW4vJHtjbWR9LmNqc2AsIFwiNzU1XCIpXG4gICAqICAgZW5kXG4gICAqL1xuICBhc3luYyBidWlsZENvbW1hbmRzKCkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gZnMucmVhZGRpclN5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCkgKyBcIi9zcmMvYmluXCIpKTtcbiAgICBmb3IgKGNvbnN0IGNtZCBvZiBjb21tYW5kcykge1xuICAgICAgaWYgKCFjbWQuZW5kc1dpdGgoXCIudHNcIikpIGNvbnRpbnVlO1xuXG4gICAgICBhd2FpdCB0aGlzLmJ1bmRsZShNb2Rlcy5DSlMsIHRydWUsIHRydWUsIGBzcmMvYmluLyR7Y21kfWAsIGNtZCk7XG4gICAgICBsZXQgZGF0YSA9IHJlYWRGaWxlKGBiaW4vJHtjbWR9LmNqc2ApO1xuICAgICAgZGF0YSA9IFwiIyEvdXNyL2Jpbi9lbnYgbm9kZVxcblwiICsgZGF0YTtcbiAgICAgIHdyaXRlRmlsZShgYmluLyR7Y21kfS5janNgLCBkYXRhKTtcbiAgICAgIGZzLmNobW9kU3luYyhgYmluLyR7Y21kfS5janNgLCBcIjc1NVwiKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogQG1vZHVsZSBidWlsZC1zY3JpcHRzLWV4dGVuZGVkXG4gKiBAZGVzY3JpcHRpb24gU2NyaXB0IGZvciBidWlsZGluZyBleHRlbmRlZCBzY3JpcHRzIGluIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3RcbiAqIEBzdW1tYXJ5IFRoaXMgc2NyaXB0IGlzIHJlc3BvbnNpYmxlIGZvciBleGVjdXRpbmcgdGhlIGN1c3RvbSBidWlsZCBwcm9jZXNzIGZvciBleHRlbmRlZCBzY3JpcHRzIGluIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuIEl0IHV0aWxpemVzIHRoZSBCdWlsZFNjcmlwdHNDdXN0b20gY2xhc3MgdG8gcGVyZm9ybSB0aGUgYnVpbGQgb3BlcmF0aW9ucyBhbmQgaGFuZGxlIGxvZ2dpbmcuXG4gKlxuICogVGhlIHNjcmlwdCBwZXJmb3JtcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XG4gKiAxLiBJbXBvcnRzIHRoZSBCdWlsZFNjcmlwdHNDdXN0b20gY2xhc3MgZnJvbSB0aGUgYnVpbGQtc2NyaXB0cyB1dGlsaXR5LlxuICogMi4gQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBCdWlsZFNjcmlwdHNDdXN0b20uXG4gKiAzLiBFeGVjdXRlcyB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIDQuIExvZ3MgdGhlIHN1Y2Nlc3Mgb3IgZmFpbHVyZSBvZiB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIDUuIEV4aXRzIHRoZSBwcm9jZXNzIHdpdGggYW4gZXJyb3IgY29kZSBpZiB0aGUgYnVpbGQgZmFpbHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFJ1biB0aGUgc2NyaXB0IGZyb20gdGhlIGNvbW1hbmQgbGluZVxuICogJCBub2RlIGJ1aWxkLXNjcmlwdHMtZXh0ZW5kZWQuanNcbiAqXG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IFNjcmlwdCBhcyBidWlsZC1zY3JpcHRzLWV4dGVuZGVkXG4gKiAgIHBhcnRpY2lwYW50IEJ1aWxkZXIgYXMgQnVpbGRTY3JpcHRzQ3VzdG9tXG4gKiAgIHBhcnRpY2lwYW50IFByb2Nlc3MgYXMgTm9kZSBQcm9jZXNzXG4gKiAgIFNjcmlwdC0+PkJ1aWxkZXI6IG5ldyBCdWlsZFNjcmlwdHNDdXN0b20oKVxuICogICBTY3JpcHQtPj5CdWlsZGVyOiBleGVjdXRlKClcbiAqICAgYWx0IEJ1aWxkIFN1Y2Nlc3NmdWxcbiAqICAgICBCdWlsZGVyLS0+PlNjcmlwdDogUHJvbWlzZSByZXNvbHZlZFxuICogICAgIFNjcmlwdC0+PkJ1aWxkZXI6IGxvZy5pbmZvKFwiU2NyaXB0cyBidWlsdCBzdWNjZXNzZnVsbHkuXCIpXG4gKiAgIGVsc2UgQnVpbGQgRmFpbGVkXG4gKiAgICAgQnVpbGRlci0tPj5TY3JpcHQ6IFByb21pc2UgcmVqZWN0ZWRcbiAqICAgICBTY3JpcHQtPj5CdWlsZGVyOiBsb2cuZXJyb3IoXCJFcnJvciBidWlsZGluZyBzY3JpcHRzOiAuLi5cIilcbiAqICAgICBTY3JpcHQtPj5Qcm9jZXNzOiBleGl0KDEpXG4gKiAgIGVuZFxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6ZmFicmljLXdlYXZlclxuICovXG5cbmltcG9ydCB7IEJ1aWxkU2NyaXB0c0N1c3RvbSB9IGZyb20gXCIuLi91dGlscy1vbGQvYnVpbGQtc2NyaXB0c1wiO1xuXG5uZXcgQnVpbGRTY3JpcHRzQ3VzdG9tKClcbiAgLmV4ZWN1dGUoKVxuICAudGhlbigoKSA9PiBCdWlsZFNjcmlwdHNDdXN0b20ubG9nLmluZm8oXCJTY3JpcHRzIGJ1aWx0IHN1Y2Nlc3NmdWxseS5cIikpXG4gIC5jYXRjaCgoZTogdW5rbm93bikgPT4ge1xuICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS5sb2cuZXJyb3IoYEVycm9yIGJ1aWxkaW5nIHNjcmlwdHM6ICR7ZX1gKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH0pO1xuIl0sIm5hbWVzIjpbIkJ1aWxkU2NyaXB0cyIsInJlYWRGaWxlIiwid3JpdGVGaWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUlHO0FBTUg7Ozs7OztBQU1HO0FBQ0gsSUFBSyxLQUtKO0FBTEQsQ0FBQSxVQUFLLEtBQUssRUFBQTs7QUFFUixJQUFBLEtBQUEsQ0FBQSxLQUFBLENBQUEsR0FBQSxVQUFnQjs7QUFFaEIsSUFBQSxLQUFBLENBQUEsS0FBQSxDQUFBLEdBQUEsUUFBYztBQUNoQixDQUFDLEVBTEksS0FBSyxLQUFMLEtBQUssR0FLVCxFQUFBLENBQUEsQ0FBQTtBQUVEOzs7OztBQUtHO0FBQ0csTUFBTyxrQkFBbUIsU0FBUUEsa0JBQVksQ0FBQTtBQUNsRDs7Ozs7Ozs7Ozs7Ozs7OztBQWdCRztBQUNILElBQUEsTUFBTSxhQUFhLEdBQUE7QUFDakIsUUFBQSxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ3RFLFFBQUEsS0FBSyxNQUFNLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDMUIsWUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQUU7QUFFMUIsWUFBQSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQVcsUUFBQSxFQUFBLEdBQUcsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUMvRCxJQUFJLElBQUksR0FBR0MsY0FBUSxDQUFDLE9BQU8sR0FBRyxDQUFBLElBQUEsQ0FBTSxDQUFDO0FBQ3JDLFlBQUEsSUFBSSxHQUFHLHVCQUF1QixHQUFHLElBQUk7QUFDckMsWUFBQUMsZUFBUyxDQUFDLENBQU8sSUFBQSxFQUFBLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQztZQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUEsSUFBQSxFQUFPLEdBQUcsQ0FBTSxJQUFBLENBQUEsRUFBRSxLQUFLLENBQUM7OztBQUcxQzs7QUM1REQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlDRztBQUlILElBQUksa0JBQWtCO0FBQ25CLEtBQUEsT0FBTztBQUNQLEtBQUEsSUFBSSxDQUFDLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztBQUNyRSxLQUFBLEtBQUssQ0FBQyxDQUFDLENBQVUsS0FBSTtJQUNwQixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQTJCLHdCQUFBLEVBQUEsQ0FBQyxDQUFFLENBQUEsQ0FBQztBQUM1RCxJQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUMsQ0FBQzs7In0=
