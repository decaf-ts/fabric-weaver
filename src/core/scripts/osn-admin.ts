import { Logger } from "@decaf-ts/logging";
import { FabricOSNAdminCommandBuilder } from "../../fabric/orderer";
import { OSN_ADMIN_SUBCOMMANDS } from "../../fabric/constants/fabric-orderer";

export function osnAdminJoin(
  logger: Logger,
  channelID?: string,
  configBlock?: string,
  adminAddress?: string,
  caFile?: string,
  clientCert?: string,
  clientKey?: string,
  noStatus?: boolean,
  help?: boolean
) {
  const builder = new FabricOSNAdminCommandBuilder(logger);

  builder
    .setCommand(OSN_ADMIN_SUBCOMMANDS.JOIN)
    .setHelp(help)
    .setOrdererAddress(adminAddress)
    .setCAFile(caFile)
    .setClientCert(clientCert)
    .setClientKey(clientKey)
    .setNoStatus(noStatus)
    .setChannelID(channelID)
    .setConfigBlock(configBlock)
    .execute();
}
