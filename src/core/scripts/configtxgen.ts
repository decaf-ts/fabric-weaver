import { Logger, Logging } from "@decaf-ts/logging";
import { ConfigtxgenCommandBuilder } from "../../fabric/configtxgen/configtxgen";

export async function createGenesisBlock(
  cpath?: string,
  profile?: string,
  channelID?: string,
  outputBlock?: string
) {
  const log: Logger = Logging.for(createGenesisBlock);
  log.debug(`Creating genesis block...`);

  const builder = new ConfigtxgenCommandBuilder();

  builder
    .setConfigPath(cpath)
    .setProfile(profile)
    .setChannelID(channelID)
    .setOutputBlock(outputBlock);

  await builder.execute();

  log.debug(`Genesis block created...`);
}
