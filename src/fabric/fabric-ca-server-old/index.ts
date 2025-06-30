/**
 * @module fabric-ca-server
 * @description Fabric Certificate Authority (CA) Server module
 * @summary This module provides functionality for interacting with and managing Hyperledger Fabric Certificate Authority (CA) servers. It exports constants, classes, and utilities specifically designed for Fabric CA server operations within the fabric-weaver project.
 *
 * The module includes:
 * - Constants: Predefined values and enumerations specific to Fabric CA server configuration and operations.
 * - FabricCAServerCommandBuilder: A class for building and managing Fabric CA server commands.
 * - Utility functions: Helper functions for common Fabric CA server tasks, such as generating certificates or managing identities.
 *
 * This module centralizes all Fabric CA server-related functionality, making it easier for developers to work with Fabric CA servers in a consistent and efficient manner.
 *
 * @example
 * import { FabricCAServerCommandBuilder, FabricCAServerCommand } from 'fabric-weaver/fabric/fabric-ca-server';
 *
 * const caBuilder = new FabricCAServerCommandBuilder();
 * const startCommand = caBuilder
 *   .setCommand(FabricCAServerCommand.START)
 *   .setPort(7054)
 *   .enableTLS(true)
 *   .build();
 *
 * console.log(`Fabric CA Server start command: ${startCommand}`);
 */

export * from "./constants";
export * from "./fabric-ca-server";
