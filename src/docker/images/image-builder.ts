import {
  DEFAULT_COMPONENT,
  DEFAULT_INCLUDE_LATEST,
  DEFAULT_VARIANT,
} from "./constants";
import { dockerPushSpec } from "./docker";
import { WeaverImagesError } from "./errors";
import { buildComponent, buildComponentPlan, pushImage } from "./fabric";
import { quoteCommand } from "./process";
import {
  resolveComponents,
  resolveImageReference,
  resolveRegistry,
  resolveRepository,
} from "./registry";
import type {
  BuildImagesOptions,
  BuiltImage,
  FabricComponent,
  ImageBuildDependencies,
  ImageBuildPlan,
  ImageBuildResult,
  PlannedOperation,
  ResolvedImageConfig,
  SofthsmSource,
} from "./types";
import {
  hostPlatform,
  normalizePlatform,
  resolveCaVersion,
  resolveFabricVersion,
  resolveImageVersion,
  toFabricCADockerTag,
  toFabricCAGitRef,
  toFabricDockerTag,
  toFabricGitRef,
} from "./versions";
import { defaultWorkspaceFactory } from "./workspace";

export function resolveImageConfig(
  options: BuildImagesOptions = {},
  deps: ImageBuildDependencies = {}
): ResolvedImageConfig {
  const cwd = options.cwd ?? deps.cwd ?? process.cwd();
  const variant = options.variant ?? DEFAULT_VARIANT;
  if (variant !== "clean" && variant !== "softhsm") {
    throw new WeaverImagesError(
      `Unsupported image variant "${variant}"; expected "clean" or "softhsm"`,
      { operation: "resolveImageConfig", variant }
    );
  }
  const fabricVersion = resolveFabricVersion(options.fabricVersion);
  const caVersion = resolveCaVersion(options.caVersion);
  const imageVersion = resolveImageVersion({
    explicit: options.imageVersion,
    cwd,
  });
  const registry = resolveRegistry(options.registry);
  const repository = resolveRepository(options.repository);
  const components = resolveComponents(options.component ?? DEFAULT_COMPONENT);
  const platform = normalizePlatform(options.platform);
  if (variant === "softhsm" && platform && platform !== hostPlatform()) {
    throw new WeaverImagesError(
      `Cross-platform PKCS#11 builds are not supported: requested platform "${platform}" differs from host platform "${hostPlatform()}"; the upstream make targets compile for the host architecture`,
      { operation: "resolveImageConfig", variant }
    );
  }
  return {
    registry,
    repository,
    imageVersion,
    fabricVersion,
    caVersion,
    fabricGitRef: toFabricGitRef(fabricVersion),
    caGitRef: toFabricCAGitRef(caVersion),
    fabricDockerTag: toFabricDockerTag(fabricVersion),
    caDockerTag: toFabricCADockerTag(caVersion),
    variant,
    components,
    platform,
    publish: options.publish ?? false,
    pull: options.pull ?? false,
    noCache: options.noCache ?? false,
    dryRun: options.dryRun ?? false,
    keepWorkdir: options.keepWorkdir ?? false,
    includeLatest: options.includeLatest ?? DEFAULT_INCLUDE_LATEST,
    cwd,
  };
}

export function planImages(config: ResolvedImageConfig): ImageBuildPlan {
  const images = config.components.map((component) =>
    resolveImageReference(config, component)
  );
  const operations: PlannedOperation[] = [];
  for (const component of config.components) {
    operations.push(...buildComponentPlan(config, component));
  }
  if (config.publish) {
    for (const image of images) {
      for (const reference of image.references) {
        operations.push({
          kind: "docker-push",
          description: `Push ${reference}`,
          spec: dockerPushSpec(reference),
        });
      }
    }
  }
  return { images, operations };
}

export function formatPlan(plan: ImageBuildPlan): string[] {
  const lines: string[] = [];
  for (const operation of plan.operations) {
    lines.push(`[${operation.kind}] ${operation.description}`);
    lines.push(`  ${quoteCommand(operation.spec)}`);
  }
  return lines;
}

export async function buildImages(
  options: BuildImagesOptions = {},
  deps: ImageBuildDependencies = {}
): Promise<ImageBuildResult> {
  const config = resolveImageConfig(options, deps);
  const plan = planImages(config);

  if (config.dryRun) {
    return { images: plan.images, pushed: [], plan };
  }

  const workspace = await (deps.workspaceFactory ?? defaultWorkspaceFactory)({
    keepWorkdir: config.keepWorkdir,
  });
  try {
    const sources = new Map<FabricComponent, SofthsmSource>();
    const images: BuiltImage[] = [];
    for (const component of config.components) {
      images.push(
        await buildComponent(config, component, workspace, { ...deps, sources })
      );
    }
    const pushed: string[] = [];
    if (config.publish) {
      for (const image of images) {
        pushed.push(...(await pushImage(image, deps)));
      }
    }
    return {
      images,
      pushed,
      workdir: config.keepWorkdir ? workspace.path : undefined,
    };
  } finally {
    await workspace.cleanup();
  }
}
