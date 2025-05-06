/**
 * @module fabric-general
 * @description General utilities and constants for Hyperledger Fabric
 * @summary This module serves as a collection of general-purpose utilities and constants used across the fabric-weaver project for Hyperledger Fabric operations. It centralizes common elements that are not specific to any particular Fabric component but are essential for various Fabric-related tasks.
 *
 * The module includes:
 * - Constants: Predefined values and enumerations used in Fabric operations, such as log levels, default ports, and standard configuration options.
 * - Utility functions: Helper functions for common Fabric-related tasks, such as parsing configuration files or formatting command-line arguments.
 *
 * By exporting these general-purpose elements, this module provides a consistent set of tools and values that can be used across different parts of the fabric-weaver library, ensuring uniformity and reducing code duplication.
 *
 * @example
 * import { FabricLogLevel, DEFAULT_FABRIC_PORT } from 'fabric-weaver/fabric/general';
 *
 * // Use Fabric constants
 * const logLevel = FabricLogLevel.INFO;
 * console.log(`Using default Fabric port: ${DEFAULT_FABRIC_PORT}`);
 */

export * from "./constants";
