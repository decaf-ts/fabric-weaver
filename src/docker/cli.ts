import { Command } from "commander";
import { VERSION } from "../index";
import { generateDockerComposeFile } from "./docker-compose-generator";
import { safeParseJSON } from "../utils-old/parsers";

const program: Command = new Command();

program
  .name("weaver-docker")
  .description("CLI for docker utility")
  .version(VERSION)
  .hook("preAction", () => {});

program
  .command("generate-compose")
  .description("creates docker composes given a config file")
  .requiredOption(
    "--config <WeaverConfig>",
    "JSON stringified config file",
    safeParseJSON,
    {}
  )
  .action((args: any) => {
    generateDockerComposeFile(args.config);
  });

program.parse(process.argv);
