import type { Logger } from "@decaf-ts/logging";
import { Logging } from "@decaf-ts/logging";

let log: Logger | undefined = undefined;

export function setLogger(logger?: Logger): Logger {
  if (!logger) logger = Logging.for("Fabric-Weaver");
  log = logger;
  return log;
}

export function getLogger(): Logger {
  if (!log) log = Logging.for("Fabric-Weaver");
  return log;
}
