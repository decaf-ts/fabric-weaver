import { spawn, ChildProcess, execSync } from "child_process";
import { Logger, Logging } from "@decaf-ts/logging";

export async function runCommand(
  command: string,
  args: string[] = [],
  options: { [indexer: string]: string } = { stdio: "inherit" },
  logMatch?: RegExp
): Promise<ChildProcess | void | Buffer> {
  const log: Logger = Logging.for(runCommand);
  log.info(`Running command: ${command} ${args.join(" ")}`);

  if (!logMatch) return execSync([command, ...args].join(" "), options);

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdoutData = "";
    let stderrData = "";

    const checkMatch = (data: string) => {
      if (logMatch && logMatch.test(data)) {
        resolve(child);
      }
    };

    child.stdout.on("data", (data: Buffer) => {
      const strData = data.toString();
      console.log(strData);
      stdoutData += strData;
      checkMatch(strData);
    });

    child.stderr.on("data", (data: Buffer) => {
      const strData = data.toString();
      console.error(strData);
      stderrData += strData;
      checkMatch(strData);
    });

    child.on("error", (err: Error) => {
      reject(err);
    });

    child.on("close", (code: number) => {
      if (code === 0) {
        resolve(child);
      } else {
        reject(
          new Error(
            `Process exited with code ${code}\nStdout: ${stdoutData}\nStderr: ${stderrData}`
          )
        );
      }
    });
  });
}
