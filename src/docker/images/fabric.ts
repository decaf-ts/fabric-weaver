import { existsSync } from "node:fs";
import path from "node:path";
import {
  CLEAN_STAGE,
  COMPONENT_CONFIG,
  GO_TAGS,
  INTERMEDIATE_SUFFIX,
  SOFTHSM_STAGE,
} from "./constants";
import {
  dockerBuild,
  dockerBuildSpec,
  dockerPull,
  dockerPullSpec,
  dockerPush,
  dockerPushSpec,
  dockerTag,
  dockerTagSpec,
} from "./docker";
import { dockerfileFor, dockerfileName } from "./dockerfiles";
import { WeaverImagesError } from "./errors";
import { gitClone, gitCloneSpec } from "./git";
import { runProcess } from "./process";
import { resolveImageReference } from "./registry";
import type {
  BuiltImage,
  FabricComponent,
  ImageBuildDependencies,
  PlannedOperation,
  ProcessOptions,
  ProcessSpec,
  ResolvedImageConfig,
  SofthsmSource,
  Workspace,
} from "./types";
import { writeWorkspaceFile } from "./workspace";

const WORKSPACE_PLACEHOLDER = "<workspace>";

function intermediateNamespace(config: ResolvedImageConfig): string {
  return `${config.registry}/${config.repository}/${INTERMEDIATE_SUFFIX}`;
}

function componentDockerTag(
  config: ResolvedImageConfig,
  component: FabricComponent
): string {
  return component === "ca" ? config.caDockerTag : config.fabricDockerTag;
}

function componentVersion(
  config: ResolvedImageConfig,
  component: FabricComponent
): string {
  return config[COMPONENT_CONFIG[component].versionKey];
}

function fabricGroup(config: ResolvedImageConfig): FabricComponent[] {
  return config.components.filter(
    (component) => component === "peer" || component === "orderer"
  );
}

function intermediateSource(
  config: ResolvedImageConfig,
  component: FabricComponent
): string {
  const namespace = intermediateNamespace(config);
  if (component === "ca") {
    return `${namespace}/fabric-ca:${config.caDockerTag}`;
  }
  return `${namespace}/fabric-${component}:latest`;
}

function intermediateTarget(
  config: ResolvedImageConfig,
  component: FabricComponent
): string {
  return `${intermediateNamespace(config)}/${component}-${INTERMEDIATE_SUFFIX}:${componentDockerTag(config, component)}`;
}

interface MakeCommand {
  spec: ProcessSpec;
  options: ProcessOptions;
}

function makeEnvironment(
  config: ResolvedImageConfig
): NodeJS.ProcessEnv | undefined {
  const env: NodeJS.ProcessEnv = {};
  if (config.platform) {
    env.DOCKER_DEFAULT_PLATFORM = config.platform;
  }
  const flags: string[] = [];
  if (config.pull) {
    flags.push("--pull");
  }
  if (config.noCache) {
    flags.push("--no-cache");
  }
  if (flags.length > 0) {
    env.DOCKER_BUILD_FLAGS = flags.join(" ");
  }
  return Object.keys(env).length > 0 ? env : undefined;
}

function makeOptions(
  config: ResolvedImageConfig,
  destination: string
): ProcessOptions {
  const env = makeEnvironment(config);
  return env ? { cwd: destination, env } : { cwd: destination };
}

function caMakeSpec(
  config: ResolvedImageConfig,
  workspacePath: string
): MakeCommand {
  return {
    spec: {
      command: "make",
      args: ["docker", `DOCKER_NS=${intermediateNamespace(config)}`],
    },
    options: makeOptions(config, path.join(workspacePath, "fabric-ca")),
  };
}

function fabricMakeSpec(
  config: ResolvedImageConfig,
  components: FabricComponent[],
  workspacePath: string
): MakeCommand {
  return {
    spec: {
      command: "make",
      args: [
        ...components.map((component) => `${component}-docker`),
        `GO_TAGS=${GO_TAGS}`,
        `DOCKER_NS=${intermediateNamespace(config)}`,
      ],
    },
    options: makeOptions(config, path.join(workspacePath, "fabric")),
  };
}

async function ensureGoAvailable(
  config: ResolvedImageConfig,
  component: FabricComponent,
  deps: ImageBuildDependencies
): Promise<void> {
  try {
    await runProcess(
      { command: "go", args: ["version"] },
      undefined,
      deps.executor
    );
  } catch (error) {
    throw new WeaverImagesError(
      "Go is required to build PKCS#11 Fabric images; install Go and ensure it is available on PATH",
      {
        operation: "ensureSofthsmSource",
        component,
        variant: config.variant,
        command: "go version",
        cause: error,
      }
    );
  }
  const arch = await runProcess(
    { command: "go", args: ["env", "GOARCH"] },
    undefined,
    deps.executor
  );
  const goPlatform = `linux/${arch.stdout.trim()}`;
  if (config.platform && goPlatform !== config.platform) {
    throw new WeaverImagesError(
      `Host Go toolchain architecture "${goPlatform}" does not match the requested --platform "${config.platform}"; install a Go toolchain for the target architecture or omit --platform`,
      {
        operation: "ensureSofthsmSource",
        component,
        variant: config.variant,
        command: "go env GOARCH",
      }
    );
  }
}

export function buildComponentPlan(
  config: ResolvedImageConfig,
  component: FabricComponent
): PlannedOperation[] {
  const reference = resolveImageReference(config, component);
  const version = componentVersion(config, component);
  const dockerTag = componentDockerTag(config, component);
  const namespace = intermediateNamespace(config);
  const operations: PlannedOperation[] = [];

  if (config.variant === "clean") {
    const sourceImage = COMPONENT_CONFIG[component].upstreamImage;
    if (config.pull) {
      operations.push({
        kind: "docker-pull",
        description: `Pull pinned upstream image ${sourceImage}:${dockerTag}`,
        spec: dockerPullSpec(`${sourceImage}:${dockerTag}`),
      });
    }
    operations.push({
      kind: "docker-build",
      description: `Build clean ${component} image from ${sourceImage}:${dockerTag} as ${reference.imageName}`,
      spec: dockerBuildSpec({
        dockerfile: path.join(WORKSPACE_PLACEHOLDER, dockerfileName(component)),
        context: WORKSPACE_PLACEHOLDER,
        sourceImage,
        sourceTag: dockerTag,
        target: CLEAN_STAGE,
        tags: reference.references,
        platform: config.platform,
        noCache: config.noCache,
      }),
    });
    return operations;
  }

  if (component === "ca") {
    const destination = path.join(WORKSPACE_PLACEHOLDER, "fabric-ca");
    operations.push({
      kind: "git-clone",
      description: `Clone fabric-ca ${version} into ${destination}`,
      spec: gitCloneSpec({
        repository: COMPONENT_CONFIG.ca.upstreamRepository,
        ref: config.caGitRef,
        destination,
      }),
    });
    operations.push({
      kind: "make",
      description: `Build PKCS#11 fabric-ca ${version} from ${destination}`,
      spec: caMakeSpec(config, WORKSPACE_PLACEHOLDER).spec,
    });
  } else {
    const group = fabricGroup(config);
    if (group[0] === component) {
      const destination = path.join(WORKSPACE_PLACEHOLDER, "fabric");
      operations.push({
        kind: "git-clone",
        description: `Clone fabric ${version} into ${destination}`,
        spec: gitCloneSpec({
          repository: COMPONENT_CONFIG.peer.upstreamRepository,
          ref: config.fabricGitRef,
          destination,
        }),
      });
      operations.push({
        kind: "make",
        description: `Build PKCS#11 ${group.join(", ")} from fabric ${version}`,
        spec: fabricMakeSpec(config, group, WORKSPACE_PLACEHOLDER).spec,
      });
    }
  }

  operations.push({
    kind: "docker-tag",
    description: `Tag ${component} ${INTERMEDIATE_SUFFIX} intermediate ${intermediateTarget(config, component)} from ${intermediateSource(config, component)}`,
    spec: dockerTagSpec({
      source: intermediateSource(config, component),
      target: intermediateTarget(config, component),
    }),
  });
  operations.push({
    kind: "docker-build",
    description: `Build ${config.variant} ${component} image from ${intermediateTarget(config, component)} as ${reference.imageName}`,
    spec: dockerBuildSpec({
      dockerfile: path.join(WORKSPACE_PLACEHOLDER, dockerfileName(component)),
      context: WORKSPACE_PLACEHOLDER,
      sourceImage: `${namespace}/${component}-${INTERMEDIATE_SUFFIX}`,
      sourceTag: dockerTag,
      target: SOFTHSM_STAGE,
      tags: reference.references,
      platform: config.platform,
      noCache: config.noCache,
    }),
  });

  return operations;
}

export async function ensureSofthsmSource(
  config: ResolvedImageConfig,
  component: FabricComponent,
  workspace: Workspace,
  deps: ImageBuildDependencies = {},
  sources: Map<FabricComponent, SofthsmSource> = new Map()
): Promise<SofthsmSource> {
  const cached = sources.get(component);
  if (cached) {
    return cached;
  }

  await ensureGoAvailable(config, component, deps);

  if (component === "ca") {
    const destination = path.join(workspace.path, "fabric-ca");
    if (!existsSync(destination)) {
      await gitClone(
        {
          repository: COMPONENT_CONFIG.ca.upstreamRepository,
          ref: config.caGitRef,
          destination,
        },
        deps
      );
    }
    try {
      await runProcess(
        { command: "go", args: ["list", "-m", "toolchain"] },
        { cwd: destination },
        deps.executor
      );
    } catch (error) {
      throw new WeaverImagesError(
        "fabric-ca requires a newer host Go toolchain (Go >= 1.21); upgrade Go and ensure it is available on PATH",
        {
          operation: "ensureSofthsmSource",
          component,
          variant: config.variant,
          command: "go list -m toolchain",
          cause: error,
        }
      );
    }
    const make = caMakeSpec(config, workspace.path);
    await runProcess(make.spec, make.options, deps.executor);
    const source: SofthsmSource = {
      image: `${intermediateNamespace(config)}/ca-${INTERMEDIATE_SUFFIX}`,
      tag: config.caDockerTag,
    };
    await dockerTag(
      dockerTagSpec({
        source: intermediateSource(config, component),
        target: `${source.image}:${source.tag}`,
      }),
      deps
    );
    sources.set(component, source);
    return source;
  }

  const destination = path.join(workspace.path, "fabric");
  if (!existsSync(destination)) {
    await gitClone(
      {
        repository: COMPONENT_CONFIG.peer.upstreamRepository,
        ref: config.fabricGitRef,
        destination,
      },
      deps
    );
  }
  const group = fabricGroup(config);
  const make = fabricMakeSpec(config, group, workspace.path);
  await runProcess(make.spec, make.options, deps.executor);
  let source: SofthsmSource | undefined;
  for (const item of group) {
    const current: SofthsmSource = {
      image: `${intermediateNamespace(config)}/${item}-${INTERMEDIATE_SUFFIX}`,
      tag: config.fabricDockerTag,
    };
    await dockerTag(
      dockerTagSpec({
        source: intermediateSource(config, item),
        target: `${current.image}:${current.tag}`,
      }),
      deps
    );
    sources.set(item, current);
    if (item === component) {
      source = current;
    }
  }
  if (!source) {
    throw new WeaverImagesError(
      `PKCS#11 source for ${component} was not produced by the fabric build`,
      { operation: "ensureSofthsmSource", component, variant: config.variant }
    );
  }
  return source;
}

export async function buildComponent(
  config: ResolvedImageConfig,
  component: FabricComponent,
  workspace: Workspace,
  deps: ImageBuildDependencies = {}
): Promise<BuiltImage> {
  const reference = resolveImageReference(config, component);
  const dockerfile = await writeWorkspaceFile(
    workspace,
    dockerfileName(component),
    (deps.dockerfiles ?? dockerfileFor)(component)
  );

  let sourceImage: string;
  let sourceTag: string;
  if (config.variant === "clean") {
    sourceImage = COMPONENT_CONFIG[component].upstreamImage;
    sourceTag = componentDockerTag(config, component);
    if (config.pull) {
      await dockerPull(dockerPullSpec(`${sourceImage}:${sourceTag}`), deps);
    }
  } else {
    const source = await ensureSofthsmSource(
      config,
      component,
      workspace,
      deps,
      deps.sources
    );
    sourceImage = source.image;
    sourceTag = source.tag;
  }

  await dockerBuild(
    dockerBuildSpec({
      dockerfile,
      context: workspace.path,
      sourceImage,
      sourceTag,
      target: config.variant === "clean" ? CLEAN_STAGE : SOFTHSM_STAGE,
      tags: reference.references,
      platform: config.platform,
      noCache: config.noCache,
    }),
    deps
  );

  return {
    component,
    variant: config.variant,
    imageName: reference.imageName,
    tags: reference.tags,
    references: reference.references,
  };
}

export async function pushImage(
  image: BuiltImage,
  deps: ImageBuildDependencies = {}
): Promise<string[]> {
  const pushed: string[] = [];
  for (const reference of image.references) {
    await dockerPush(dockerPushSpec(reference), deps);
    pushed.push(reference);
  }
  return pushed;
}
