export type ImageVariant = "clean" | "softhsm";

export type FabricComponent = "ca" | "peer" | "orderer";

export type ComponentSelection = FabricComponent | "all";

export interface ImageVersionSource {
  explicit?: string;
  cwd?: string;
}

export interface BuildImagesOptions {
  variant?: ImageVariant;
  component?: ComponentSelection;
  imageVersion?: string;
  fabricVersion?: string;
  caVersion?: string;
  registry?: string;
  repository?: string;
  platform?: string;
  publish?: boolean;
  pull?: boolean;
  noCache?: boolean;
  dryRun?: boolean;
  keepWorkdir?: boolean;
  includeLatest?: boolean;
  cwd?: string;
}

export interface ResolvedImageConfig {
  registry: string;
  repository: string;
  imageVersion: string;
  fabricVersion: string;
  caVersion: string;
  fabricGitRef: string;
  caGitRef: string;
  fabricDockerTag: string;
  caDockerTag: string;
  variant: ImageVariant;
  components: FabricComponent[];
  platform?: string;
  publish: boolean;
  pull: boolean;
  noCache: boolean;
  dryRun: boolean;
  keepWorkdir: boolean;
  includeLatest: boolean;
  cwd: string;
}

export interface ImageReference {
  component: FabricComponent;
  variant: ImageVariant;
  imageName: string;
  tags: string[];
  references: string[];
}

export interface ProcessSpec {
  command: string;
  args: string[];
}

export interface ProcessOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export interface ProcessResult {
  command: string;
  args: string[];
  stdout: string;
}

export type ProcessExecutor = (
  spec: ProcessSpec,
  options?: ProcessOptions
) => Promise<ProcessResult>;

export interface Workspace {
  path: string;
  cleanup(): Promise<void>;
}

export type WorkspaceFactory = (options?: {
  keepWorkdir?: boolean;
}) => Promise<Workspace>;

export type DockerfileProvider = (component: FabricComponent) => string;

export type PlannedOperationKind =
  | "git-clone"
  | "make"
  | "docker-tag"
  | "docker-build"
  | "docker-pull"
  | "docker-push";

export interface PlannedOperation {
  kind: PlannedOperationKind;
  description: string;
  spec: ProcessSpec;
}

export interface ImageBuildPlan {
  images: ImageReference[];
  operations: PlannedOperation[];
}

export interface BuiltImage {
  component: FabricComponent;
  variant: ImageVariant;
  imageName: string;
  tags: string[];
  references: string[];
}

export interface ImageBuildResult {
  images: BuiltImage[];
  pushed: string[];
  workdir?: string;
  plan?: ImageBuildPlan;
}

export interface SofthsmSource {
  image: string;
  tag: string;
}

export interface ComponentConfig {
  component: FabricComponent;
  upstreamImage: string;
  upstreamRepository: string;
  versionKey: "fabricVersion" | "caVersion";
}

export interface ImageBuildDependencies {
  executor?: ProcessExecutor;
  workspaceFactory?: WorkspaceFactory;
  dockerfiles?: DockerfileProvider;
  cwd?: string;
  sources?: Map<FabricComponent, SofthsmSource>;
}

export interface WeaverImagesErrorContext {
  operation?: string;
  component?: string;
  variant?: string;
  command?: string;
  cause?: unknown;
}
