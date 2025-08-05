import { Logging } from "@decaf-ts/logging";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { cwd } from "process";

const program = new Command();

program
  .command("add-node-shebang")
  .description("Adds a shebang to the provided script")
  .option("--file <string>", "Path to the script file")
  .action(async (options) => {
    const log = Logging.for("She-Bang");
    const filePath = path.join(cwd(), options.file);
    let content = fs.readFileSync(filePath, "utf8");

    const shebang = "#!/usr/bin/env node";

    if (!content.startsWith(shebang)) {
      content = `${shebang}\n${content}`;
      fs.writeFileSync(filePath, content, "utf8");
      log.info(`Shebang added to ${filePath}`);
    } else {
      log.error(`Shebang already present in ${filePath}`);
    }
  });

program.parse(process.argv);
