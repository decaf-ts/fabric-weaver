import { Logging } from "@decaf-ts/logging";
import { FabricBinaries } from "../general/constants";
import { OrdererCommand } from "./constants";
import { OrdererConfig } from "./orderer-config";
import path from "path";
import { readFileYaml } from "../../utils/yaml";

export class OrdererCommandBuilder {
  private log = Logging.for(OrdererCommandBuilder);

  private binName: FabricBinaries = FabricBinaries.ORDERER;

  private args: Map<string, string | boolean | number | string[]> = new Map();
  private command: OrdererCommand = OrdererCommand.START;

  private config: OrdererConfig = readFileYaml(
    path.join(__dirname, "../../../config/orderer.yaml")
  ) as OrdererConfig;
}
