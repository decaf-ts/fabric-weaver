import { Logger, Logging } from "@decaf-ts/logging";
import { ConfigtxgenCommandBuilder } from "../../fabric/configtxgen/configtxgen";

export async function configtxgen(
  asOrg?: string,
  channelCreateTxBaseProfile?: string,
  channelID?: string,
  cpath?: string,
  inspectBlock?: string,
  inspectChannelCreateTx?: string,
  outputAnchorPeersUpdate?: string,
  outputBlock?: string,
  outputCreateChannelTx?: string,
  printOrg?: string,
  profile?: string,
  showVersion?: boolean
) {
  const log: Logger = Logging.for(configtxgen);
  log.info(`Running configtxgen command...`);

  const builder = new ConfigtxgenCommandBuilder();

  builder
    .setAsOrg(asOrg)
    .setChannelCreateTxBaseProfile(channelCreateTxBaseProfile)
    .setChannelID(channelID)
    .setConfigPath(cpath)
    .setInspectBlock(inspectBlock)
    .setInspectChannelCreateTx(inspectChannelCreateTx)
    .setOutputAnchorPeersUpdate(outputAnchorPeersUpdate)
    .setOutputBlock(outputBlock)
    .setOutputCreateChannelTx(outputCreateChannelTx)
    .setPrintOrg(printOrg)
    .setProfile(profile)
    .setVersion(showVersion);

  builder.execute();

  log.info(`Command runned successfully...`);
}
