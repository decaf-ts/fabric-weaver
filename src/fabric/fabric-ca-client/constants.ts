/**
 * @enum {string}
 * @description Enumeration of available Fabric CA Client affiliation subcommands.
 * @summary This enum represents all the possible subcommands for managing affiliations using the Fabric CA Client.
 */
export enum FabricCAClientAffiliationSubcommand {
  /** Add affiliation */
  ADD = "add",

  /** List affiliations */
  LIST = "list",

  /** Modify affiliation */
  MODIFY = "modify",

  /** Remove affiliation */
  REMOVE = "remove",
}
