/**
 * @module fabric-weaver
 * @description This module serves as the main entry point for the fabric-weaver library, providing TypeScript integration with Hyperledger Fabric.
 * @summary Aggregates and exports functionality for managing Hyperledger Fabric infrastructures.
 *
 * The module includes:
 * 1. Utility functions and types from the "./utils" directory:
 *    - Helper functions for interacting with Fabric binaries.
 *    - Utilities for generating and managing Docker Compose files.
 *    - Functions to assist in creating, maintaining, and updating Hyperledger Fabric networks.
 *
 * 2. Core functionality from the "./core" directory:
 *    - TypeScript interfaces and classes representing Fabric concepts.
 *    - Implementation of Fabric operations and interactions.
 *
 * 3. A VERSION constant:
 *    - Represents the current version of the fabric-weaver module.
 *    - Useful for version checking and compatibility purposes.
 *
 * This structure provides a comprehensive toolkit for working with Hyperledger Fabric in TypeScript,
 * allowing developers to easily set up, manage, and interact with Fabric networks and components.
 */

export * from "./utils-old";
export * from "./fabric";
export * from "./utils";

/**
 * @const VERSION
 * @name VERSION
 * @description Represents the current version of the fabric-weaver module.
 * @summary The actual version number is replaced during the build process.
 * @type {string}
 */
export const VERSION = "##VERSION##";
