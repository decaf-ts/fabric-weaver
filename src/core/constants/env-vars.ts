/**
 * @enum {string}
 * @description Enumeration of environment variables used in the Fabric Weaver project
 * @summary This enum provides a centralized list of environment variable names used across the project.
 * It helps maintain consistency and prevents typos when referencing these variables in different parts of the code.
 *
 * @example
 * import { EnvVars } from '../core/constants/env-vars';
 *
 * const binFolder = process.env[EnvVars.FABRIC_BIN_FOLDER];
 */
export enum EnvVars {
  /** The path to the Fabric binary folder */
  FABRIC_BIN_FOLDER = "FABRIC_BIN_FOLDER",
}
