import { runCommand } from "@decaf-ts/utils";
import { WeaverImagesError } from "./errors";
import type {
  ProcessExecutor,
  ProcessOptions,
  ProcessResult,
  ProcessSpec,
} from "./types";

const SAFE_ARGUMENT = /^[A-Za-z0-9_@%+=:,./-]+$/;

function quoteArgument(argument: string): string {
  if (argument === "") {
    return "''";
  }
  if (SAFE_ARGUMENT.test(argument)) {
    return argument;
  }
  return `'${argument.replace(/'/g, "'\\''")}'`;
}

export function quoteCommand(spec: ProcessSpec): string {
  return [spec.command, ...spec.args].map(quoteArgument).join(" ");
}

export const defaultProcessExecutor: ProcessExecutor = async (
  spec,
  options
) => {
  const result = await runCommand<string>(quoteCommand(spec), {
    cwd: options?.cwd,
    env: options?.env,
  }).promise;
  return { command: spec.command, args: spec.args, stdout: result };
};

export async function runProcess(
  spec: ProcessSpec,
  options?: ProcessOptions,
  executor: ProcessExecutor = defaultProcessExecutor
): Promise<ProcessResult> {
  try {
    return await executor(spec, options);
  } catch (error) {
    throw new WeaverImagesError(
      `Failed to run command: ${quoteCommand(spec)}`,
      { operation: "runProcess", command: spec.command, cause: error }
    );
  }
}
