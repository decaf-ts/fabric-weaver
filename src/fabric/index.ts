/**
 * @module fabric
 * @description Fabric module for Hyperledger Fabric integration
 * @summary This module serves as the main entry point for Fabric-related functionality in the fabric-weaver project. It aggregates and exports components from the fabric-ca-server and general submodules, providing a centralized access point for Fabric operations and utilities.
 *
 * The module includes:
 * - Fabric CA Server components: Tools and utilities for managing Fabric Certificate Authorities.
 * - General Fabric utilities: Common functions and types used across various Fabric operations.
 *
 * By centralizing these exports, this module simplifies the import process for consumers of the fabric-weaver library, allowing them to access all Fabric-related functionality through a single import statement.
 *
 * @example
 * import { FabricCAServerCommandBuilder, FabricLogLevel } from 'fabric-weaver/fabric';
 *
 * // Use Fabric CA Server components
 * const caBuilder = new FabricCAServerCommandBuilder();
 *
 * // Use general Fabric utilities
 * const logLevel = FabricLogLevel.INFO;
 */

export * from "./fabric-ca-server";
export * from "./general";
