import { Command, DefaultCommandOptions, UserInput } from "@decaf-ts/utils";
import type {
  CommandOptions,
  DefaultCommandValues,
  ParseArgsOptionsConfig,
} from "@decaf-ts/utils";
import { Logger, LoggingConfig } from "@decaf-ts/logging";
import { VERSION } from "../../version";
import { buildImages, formatPlan } from "./image-builder";
import {
  DEFAULT_CA_VERSION,
  DEFAULT_COMPONENT,
  DEFAULT_FABRIC_VERSION,
  DEFAULT_REGISTRY,
  DEFAULT_REPOSITORY,
  DEFAULT_VARIANT,
} from "./constants";
import type {
  BuildImagesOptions,
  ComponentSelection,
  ImageBuildResult,
  ImageVariant,
} from "./types";

export const weaverImagesOptions = {
  ...DefaultCommandOptions,
  variant: {
    type: "string",
    short: "t",
    default: DEFAULT_VARIANT,
  },
  component: {
    type: "string",
    short: "c",
    default: DEFAULT_COMPONENT,
  },
  "image-version": {
    type: "string",
  },
  "fabric-version": {
    type: "string",
    default: DEFAULT_FABRIC_VERSION,
  },
  "ca-version": {
    type: "string",
    default: DEFAULT_CA_VERSION,
  },
  registry: {
    type: "string",
    default: DEFAULT_REGISTRY,
  },
  repository: {
    type: "string",
    default: DEFAULT_REPOSITORY,
  },
  platform: {
    type: "string",
  },
  publish: {
    type: "boolean",
    default: false,
  },
  pull: {
    type: "boolean",
    default: false,
  },
  "no-cache": {
    type: "boolean",
    default: false,
  },
  "dry-run": {
    type: "boolean",
    default: false,
  },
  "keep-workdir": {
    type: "boolean",
    default: false,
  },
  latest: {
    type: "boolean",
    default: false,
  },
} as const;

function readString(
  values: Record<string, unknown>,
  key: string
): string | undefined {
  const value = values[key];
  return typeof value === "string" ? value : undefined;
}

function readBoolean(
  values: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = values[key];
  return typeof value === "boolean" ? value : undefined;
}

export function toBuildImagesOptions(
  values: Record<string, unknown>
): BuildImagesOptions {
  const options: BuildImagesOptions = {};
  const variant = readString(values, "variant") as ImageVariant | undefined;
  const component = readString(values, "component") as
    | ComponentSelection
    | undefined;
  const imageVersion = readString(values, "image-version");
  const fabricVersion = readString(values, "fabric-version");
  const caVersion = readString(values, "ca-version");
  const registry = readString(values, "registry");
  const repository = readString(values, "repository");
  const platform = readString(values, "platform");
  const publish = readBoolean(values, "publish");
  const pull = readBoolean(values, "pull");
  const noCache = readBoolean(values, "no-cache");
  const dryRun = readBoolean(values, "dry-run");
  const keepWorkdir = readBoolean(values, "keep-workdir");
  const includeLatest = readBoolean(values, "latest");

  if (variant !== undefined) options.variant = variant;
  if (component !== undefined) options.component = component;
  if (imageVersion !== undefined) options.imageVersion = imageVersion;
  if (fabricVersion !== undefined) options.fabricVersion = fabricVersion;
  if (caVersion !== undefined) options.caVersion = caVersion;
  if (registry !== undefined) options.registry = registry;
  if (repository !== undefined) options.repository = repository;
  if (platform !== undefined) options.platform = platform;
  if (publish !== undefined) options.publish = publish;
  if (pull !== undefined) options.pull = pull;
  if (noCache !== undefined) options.noCache = noCache;
  if (dryRun !== undefined) options.dryRun = dryRun;
  if (keepWorkdir !== undefined) options.keepWorkdir = keepWorkdir;
  if (includeLatest !== undefined) options.includeLatest = includeLatest;

  return options;
}

function printCommandHelp(
  log: Logger,
  commandName: string,
  summary: string,
  usage: string,
  options: {
    flag: string;
    description: string;
    defaultValue?: string;
  }[],
  notes: string[] = [],
  examples: string[] = []
): void {
  log.info(`${commandName}`);
  log.info(summary);
  log.info(`Usage: ${usage}`);
  log.info("Options:");

  for (const option of options) {
    const suffix = option.defaultValue
      ? ` (default: ${option.defaultValue})`
      : "";
    log.info(`  ${option.flag}  ${option.description}${suffix}`);
  }

  if (notes.length > 0) {
    log.info("Notes:");
    for (const note of notes) {
      log.info(`  ${note}`);
    }
  }

  if (examples.length > 0) {
    log.info("Examples:");
    for (const example of examples) {
      log.info(`  ${example}`);
    }
  }
}

export class WeaverImagesCommand extends Command<
  typeof weaverImagesOptions,
  ImageBuildResult | void
> {
  constructor() {
    super(
      "WeaverImagesCommand",
      weaverImagesOptions as unknown as CommandOptions<
        typeof weaverImagesOptions
      >
    );
  }

  override async execute(): Promise<ImageBuildResult | string | void> {
    const argv = process.argv;
    if (argv[2] === "build") {
      process.argv = [argv[0], argv[1], ...argv.slice(3)];
    }
    try {
      const args = UserInput.parseArgs(
        this.inputs as unknown as ParseArgsOptionsConfig
      );
      if (args.values.version === true) {
        return VERSION;
      }
      return super.execute();
    } finally {
      process.argv = argv;
    }
  }

  protected override help(): void {
    printCommandHelp(
      this.log,
      "weaver-images",
      "Build and publish Weaver Fabric/CA Docker images.",
      "weaver-images [options]",
      [
        {
          flag: "-t, --variant <variant>",
          description: "Image variant to build (clean or softhsm)",
          defaultValue: DEFAULT_VARIANT,
        },
        {
          flag: "-c, --component <component>",
          description: "Fabric component to build (ca, peer, orderer, all)",
          defaultValue: DEFAULT_COMPONENT,
        },
        {
          flag: "--image-version <version>",
          description:
            "Version tag for the generated images; defaults to the consumer package version",
        },
        {
          flag: "--fabric-version <version>",
          description: "Fabric version to build from",
          defaultValue: DEFAULT_FABRIC_VERSION,
        },
        {
          flag: "--ca-version <version>",
          description: "Fabric CA version to build from",
          defaultValue: DEFAULT_CA_VERSION,
        },
        {
          flag: "--registry <registry>",
          description: "Container registry namespace",
          defaultValue: DEFAULT_REGISTRY,
        },
        {
          flag: "--repository <repository>",
          description: "Repository under the registry",
          defaultValue: DEFAULT_REPOSITORY,
        },
        {
          flag: "--platform <platform>",
          description: "Target platform for docker build",
        },
        {
          flag: "--publish",
          description: "Push built images to the registry",
          defaultValue: "false",
        },
        {
          flag: "--pull",
          description: "Pull upstream base images before building",
          defaultValue: "false",
        },
        {
          flag: "--no-cache",
          description: "Disable the Docker build cache",
          defaultValue: "false",
        },
        {
          flag: "--dry-run",
          description:
            "Resolve the configuration and print the plan without building",
          defaultValue: "false",
        },
        {
          flag: "--keep-workdir",
          description: "Keep the temporary workspace after the build",
          defaultValue: "false",
        },
        {
          flag: "--latest",
          description: "Also tag built images as latest",
          defaultValue: "false",
        },
        {
          flag: "-v, --version",
          description: "Show the CLI version and exit",
        },
        {
          flag: "-h, --help",
          description: "Show this help text and exit",
        },
      ],
      [
        "latest is never used as a version; pass --image-version or run from a package with a version.",
        "--publish requires an authenticated Docker session for the target registry.",
      ],
      [
        "weaver-images --dry-run --image-version 3.4.7",
        "weaver-images build --variant softhsm --component peer --image-version 3.4.7 --fabric-version 2.5.16 --ca-version 1.5.22 --publish",
      ]
    );
  }

  protected override async run<R>(
    answers: LoggingConfig &
      typeof DefaultCommandValues & {
        [k in keyof typeof weaverImagesOptions]: unknown;
      }
  ): Promise<R | string | void> {
    const options = toBuildImagesOptions(
      answers as unknown as Record<string, unknown>
    );
    if (answers["dry-run"] === true) {
      const result = await buildImages(options);
      if (result.plan) {
        formatPlan(result.plan).forEach((line) => this.log.info(line));
      }
      return result as unknown as R;
    }
    const result = await buildImages(options);
    this.log.info(`Built ${result.images.length} image(s)`);
    if (result.pushed.length) {
      this.log.info(`Pushed ${result.pushed.length} image reference(s)`);
    }
    return result as unknown as R;
  }
}
