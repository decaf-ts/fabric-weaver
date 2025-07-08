import { Logging } from "@decaf-ts/logging";
import { writeFileYaml } from "../../utils/yaml";
import path from "path";
import fs from "fs";
import { FabricAccountType } from "../constants/fabric-general";
import { NodeOUConfig } from "../interfaces/fabric/node-ou-config";

export function getCertName(mspdir: string): string {
  const log = Logging.for(getCertName);
  try {
    const directory = mspdir;
    const certFolder = path.join(directory, "cacerts");

    const dirInfo = fs.readdirSync(certFolder);

    const files = dirInfo.filter((file) => {
      const filePath = path.join(certFolder, file);
      return fs.statSync(filePath).isFile();
    });

    return files[0] || "ca-cert.pem";
  } catch (e) {
    log.error("Error reading local MSP directory: " + e);
    return "ca-cert.pem";
  }
}

export function createNodeOU(
  enable: boolean = false,
  pathFromMSPDir: string = "cacerts",
  mspdir: string = "msp",
  cert?: string
) {
  const log = Logging.for(createNodeOU);
  if (!cert) cert = getCertName(mspdir);

  const nodeOU: NodeOUConfig = {
    NodeOUs: {
      Enable: enable,
      ClientOUIdentifier: {
        Certificate: `${pathFromMSPDir}/${cert}`,
        OrganizationalUnitIdentifier: FabricAccountType.CLIENT,
      },
      AdminOUIdentifier: {
        Certificate: `${pathFromMSPDir}/${cert}`,
        OrganizationalUnitIdentifier: FabricAccountType.ADMIN,
      },
      OrdererOUIdentifier: {
        Certificate: `${pathFromMSPDir}/${cert}`,
        OrganizationalUnitIdentifier: FabricAccountType.ORDERER,
      },
      PeerOUIdentifier: {
        Certificate: `${pathFromMSPDir}/${cert}`,
        OrganizationalUnitIdentifier: FabricAccountType.PEER,
      },
    },
  };

  try {
    const location = path.join(mspdir, "config.yaml");

    log.info(`Writing node OU configuration to ${location}`);
    writeFileYaml<NodeOUConfig>(location, nodeOU);
  } catch (e) {
    log.error(`Error writing node OU configuration: ${e}`);
    throw e;
  }
}
