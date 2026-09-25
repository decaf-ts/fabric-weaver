import { GIT_CLONE_DEPTH } from "./constants";
import { runProcess } from "./process";
import type {
  ImageBuildDependencies,
  ProcessResult,
  ProcessSpec,
} from "./types";

export function gitCloneSpec(input: {
  repository: string;
  ref: string;
  destination: string;
  depth?: number;
}): ProcessSpec {
  return {
    command: "git",
    args: [
      "clone",
      "--depth",
      String(input.depth ?? GIT_CLONE_DEPTH),
      "--branch",
      input.ref,
      input.repository,
      input.destination,
    ],
  };
}

export async function gitClone(
  input: {
    repository: string;
    ref: string;
    destination: string;
    depth?: number;
  },
  deps: ImageBuildDependencies = {}
): Promise<ProcessResult> {
  return runProcess(gitCloneSpec(input), undefined, deps.executor);
}
