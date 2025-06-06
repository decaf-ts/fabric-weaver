import { spawn } from "child_process";
import { Logger, Logging } from "@decaf-ts/logging";

export async function runCommand(
  command: string,
  args: string[] = [],
  options: { [indexer: string]: string } = {},
  logMatch?: RegExp
) {
  return new Promise((resolve, reject) => {
    const log: Logger = Logging.for(runCommand);

    log.info(`Running command: ${command} ${args.join(" ")}`);
    const child = spawn(command, args, options);
    const regex = logMatch;

    child.stdout.on("data", (data: any) => {
      console.log(`${data}`);
      if (!regex) return resolve(child);

      if (regex.test(data.toString())) {
        resolve(child);
      }
    });

    child.stderr.on("data", (data: any) => {
      console.error(`${data}`);
      if (!regex) return resolve(child);
      if (regex.test(data.toString())) {
        resolve(child);
      }
    });

    child.on("error", (err: any) => {
      reject(err);
    });

    child.on("close", (code: any) => {
      reject(new Error(`Process exited with code ${code}`));
    });
  });
}
