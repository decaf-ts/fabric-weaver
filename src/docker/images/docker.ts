import { runProcess } from "./process";
import type {
  ImageBuildDependencies,
  ProcessResult,
  ProcessSpec,
} from "./types";

export function dockerPullSpec(reference: string): ProcessSpec {
  return { command: "docker", args: ["pull", reference] };
}

export function dockerBuildSpec(input: {
  dockerfile: string;
  context: string;
  sourceImage: string;
  sourceTag: string;
  target: string;
  tags: string[];
  platform?: string;
  pull?: boolean;
  noCache?: boolean;
}): ProcessSpec {
  const args = [
    "build",
    "--file",
    input.dockerfile,
    "--target",
    input.target,
    "--build-arg",
    `SOURCE_IMAGE=${input.sourceImage}`,
    "--build-arg",
    `SOURCE_TAG=${input.sourceTag}`,
  ];
  if (input.platform) {
    args.push("--platform", input.platform);
  }
  if (input.pull) {
    args.push("--pull");
  }
  if (input.noCache) {
    args.push("--no-cache");
  }
  for (const tag of input.tags) {
    args.push("-t", tag);
  }
  args.push(input.context);
  return { command: "docker", args };
}

export function dockerTagSpec(input: {
  source: string;
  target: string;
}): ProcessSpec {
  return { command: "docker", args: ["tag", input.source, input.target] };
}

export function dockerPushSpec(reference: string): ProcessSpec {
  return { command: "docker", args: ["push", reference] };
}

export async function dockerPull(
  spec: ProcessSpec,
  deps: ImageBuildDependencies = {}
): Promise<ProcessResult> {
  return runProcess(spec, undefined, deps.executor);
}

export async function dockerBuild(
  spec: ProcessSpec,
  deps: ImageBuildDependencies = {}
): Promise<ProcessResult> {
  return runProcess(spec, undefined, deps.executor);
}

export async function dockerTag(
  spec: ProcessSpec,
  deps: ImageBuildDependencies = {}
): Promise<ProcessResult> {
  return runProcess(spec, undefined, deps.executor);
}

export async function dockerPush(
  spec: ProcessSpec,
  deps: ImageBuildDependencies = {}
): Promise<ProcessResult> {
  return runProcess(spec, undefined, deps.executor);
}
