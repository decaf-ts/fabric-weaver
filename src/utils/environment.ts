import { Logger, Logging } from "@decaf-ts/logging";
export function setOrdererEnvironment(cpath: string) {
  const log: Logger = Logging.for(setOrdererEnvironment);
  log.info(`Setting environment variables for orderer`);

  const FABRIC_CFG_PATH = cpath;
  const ORDERER_YAML_FILE = `${cpath}/orderer.yaml`;

  log.info(`Setting FABRIC_CFG_PATH to ${FABRIC_CFG_PATH}`);
  log.info(`Setting ORDERER_YAML_FILE to ${ORDERER_YAML_FILE}`);

  process.env["FABRIC_CFG_PATH"] = FABRIC_CFG_PATH;
  process.env["ORDERER_YAML_FILE"] = ORDERER_YAML_FILE;
}
