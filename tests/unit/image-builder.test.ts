import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { WeaverImagesError } from "../../src/docker/images/errors";
import {
  buildImages,
  formatPlan,
  planImages,
  resolveImageConfig,
} from "../../src/docker/images/image-builder";
import type {
  ComponentSelection,
  ImageVariant,
  ProcessExecutor,
  ProcessOptions,
  ProcessResult,
  ProcessSpec,
  ResolvedImageConfig,
  Workspace,
  WorkspaceFactory,
} from "../../src/docker/images/types";
import { createWorkspace } from "../../src/docker/images/workspace";

interface RecordedCall {
  spec: ProcessSpec;
  options?: ProcessOptions;
}

function fakeExecutor(
  handler?: (
    spec: ProcessSpec,
    options?: ProcessOptions
  ) => Promise<ProcessResult>
): { executor: ProcessExecutor; calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  const executor: ProcessExecutor = async (spec, options) => {
    calls.push({ spec, options });
    if (handler) {
      return handler(spec, options);
    }
    return { command: spec.command, args: spec.args, stdout: "" };
  };
  return { executor, calls };
}

describe("image-builder", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "weaver-builder-"));
    await fsp.writeFile(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ version: "1.2.3" })
    );
  });

  afterEach(async () => {
    await fsp.rm(tmpDir, { recursive: true, force: true });
  });

  describe("resolveImageConfig", () => {
    it("resolves the documented defaults", () => {
      const config = resolveImageConfig({ cwd: tmpDir });
      expect(config).toEqual({
        registry: "ghcr.io/decaf-ts",
        repository: "fabric-weaver",
        imageVersion: "1.2.3",
        fabricVersion: "2.5.12",
        caVersion: "1.5.15",
        fabricGitRef: "v2.5.12",
        caGitRef: "v1.5.15",
        fabricDockerTag: "2.5.12",
        caDockerTag: "1.5.15",
        variant: "clean",
        components: ["ca", "peer", "orderer"],
        platform: undefined,
        publish: false,
        pull: false,
        noCache: false,
        dryRun: false,
        keepWorkdir: false,
        includeLatest: false,
        cwd: tmpDir,
      });
    });

    it("lets explicit options override the defaults", () => {
      const config = resolveImageConfig({
        cwd: tmpDir,
        registry: "reg.example.com",
        repository: "repo",
        imageVersion: "9.9.9",
        fabricVersion: "2.5.16",
        caVersion: "1.5.22",
        variant: "clean",
        component: "peer",
        platform: "amd64",
        publish: true,
        pull: true,
        noCache: true,
        dryRun: true,
        keepWorkdir: true,
        includeLatest: true,
      });
      expect(config).toEqual({
        registry: "reg.example.com",
        repository: "repo",
        imageVersion: "9.9.9",
        fabricVersion: "2.5.16",
        caVersion: "1.5.22",
        fabricGitRef: "v2.5.16",
        caGitRef: "v1.5.22",
        fabricDockerTag: "2.5.16",
        caDockerTag: "1.5.22",
        variant: "clean",
        components: ["peer"],
        platform: "linux/amd64",
        publish: true,
        pull: true,
        noCache: true,
        dryRun: true,
        keepWorkdir: true,
        includeLatest: true,
        cwd: tmpDir,
      });
    });

    it("falls back to process.cwd() when called without options", async () => {
      const pkg = JSON.parse(
        await fsp.readFile(path.join(process.cwd(), "package.json"), "utf8")
      ) as { version: string };
      const config = resolveImageConfig();
      expect(config.cwd).toBe(process.cwd());
      expect(config.imageVersion).toBe(pkg.version);
    });

    it("throws for an invalid variant", () => {
      expect(() =>
        resolveImageConfig({
          cwd: tmpDir,
          variant: "invalid" as unknown as ImageVariant,
        })
      ).toThrow(WeaverImagesError);
      expect(() =>
        resolveImageConfig({
          cwd: tmpDir,
          variant: "invalid" as unknown as ImageVariant,
        })
      ).toThrow(/Unsupported image variant/);
    });

    it("throws for an unsupported component", () => {
      expect(() =>
        resolveImageConfig({
          cwd: tmpDir,
          component: "bogus" as ComponentSelection,
        })
      ).toThrow(WeaverImagesError);
      expect(() =>
        resolveImageConfig({
          cwd: tmpDir,
          component: "bogus" as ComponentSelection,
        })
      ).toThrow(/Unsupported component "bogus"/);
    });
  });

  describe("planImages", () => {
    it("plans one docker build per clean component", () => {
      const config = resolveImageConfig({ cwd: tmpDir });
      const plan = planImages(config);
      expect(plan.images).toHaveLength(3);
      expect(plan.operations).toHaveLength(3);
      expect(
        plan.operations.every((operation) => operation.kind === "docker-build")
      ).toBe(true);
    });

    it("plans a docker pull before the clean build when pull is true", () => {
      const config = resolveImageConfig({
        cwd: tmpDir,
        component: "ca",
        pull: true,
      });
      const plan = planImages(config);
      expect(plan.operations.map((operation) => operation.kind)).toEqual([
        "docker-pull",
        "docker-build",
      ]);
      expect(plan.operations[0].spec).toEqual({
        command: "docker",
        args: ["pull", "hyperledger/fabric-ca:1.5.15"],
      });
      expect(plan.operations[1].spec.args).not.toContain("--pull");
    });

    it("clones fabric once for peer and orderer softhsm images", () => {
      const base = resolveImageConfig({ cwd: tmpDir, variant: "softhsm" });
      const config: ResolvedImageConfig = {
        ...base,
        components: ["peer", "orderer"],
      };
      const plan = planImages(config);
      const fabricClones = plan.operations.filter(
        (operation) =>
          operation.kind === "git-clone" &&
          operation.spec.args.includes(
            "https://github.com/hyperledger/fabric.git"
          )
      );
      expect(fabricClones).toHaveLength(1);
      expect(
        plan.operations.filter((operation) => operation.kind === "make")
      ).toHaveLength(1);
    });

    it("adds one docker push per reference when publishing", () => {
      const config = resolveImageConfig({
        cwd: tmpDir,
        component: "ca",
        publish: true,
      });
      const plan = planImages(config);
      const pushes = plan.operations.filter(
        (operation) => operation.kind === "docker-push"
      );
      expect(pushes).toHaveLength(1);
      expect(pushes[0].spec).toEqual({
        command: "docker",
        args: ["push", "ghcr.io/decaf-ts/fabric-weaver/ca-base:1.2.3"],
      });
      const latest = planImages({ ...config, includeLatest: true });
      expect(
        latest.operations.filter(
          (operation) => operation.kind === "docker-push"
        )
      ).toHaveLength(2);
    });
  });

  describe("formatPlan", () => {
    it("renders kind and command lines for every operation", () => {
      const config = resolveImageConfig({ cwd: tmpDir, component: "ca" });
      const plan = planImages(config);
      const lines = formatPlan(plan);
      expect(lines).toHaveLength(plan.operations.length * 2);
      expect(lines[0].startsWith("[docker-build] ")).toBe(true);
      expect(lines[1]).toContain("docker build");
      expect(lines[1]).toContain("--target clean");
    });
  });

  describe("buildImages", () => {
    it("does not create a workspace or run the executor on a dry run", async () => {
      let factoryCalls = 0;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        factoryCalls += 1;
        return createWorkspace(options);
      };
      const { executor, calls } = fakeExecutor();
      const result = await buildImages(
        {
          cwd: tmpDir,
          imageVersion: "1.0.0",
          component: "ca",
          dryRun: true,
        },
        { executor, workspaceFactory }
      );
      expect(factoryCalls).toBe(0);
      expect(calls).toHaveLength(0);
      expect(result.images).toHaveLength(1);
      expect(result.pushed).toEqual([]);
      expect(result.workdir).toBeUndefined();
      expect(result.plan?.images).toEqual(result.images);
      expect(
        result.plan?.operations.map((operation) => operation.kind)
      ).toEqual(["docker-build"]);
      expect(result.plan?.operations[0].spec.args).toContain("--target");
    });

    it("builds and pushes with a real temp workspace and cleans up", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor, calls } = fakeExecutor();
      const result = await buildImages(
        {
          cwd: tmpDir,
          imageVersion: "1.0.0",
          component: "ca",
          publish: true,
        },
        { executor, workspaceFactory }
      );
      expect(result.images).toHaveLength(1);
      expect(result.pushed).toEqual([
        "ghcr.io/decaf-ts/fabric-weaver/ca-base:1.0.0",
      ]);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
      expect(
        calls.map((call) => `${call.spec.command} ${call.spec.args[0]}`)
      ).toEqual(["docker build", "docker push"]);
    });

    it("builds softhsm images through the shared fabric source", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor, calls } = fakeExecutor();
      const result = await buildImages(
        {
          cwd: tmpDir,
          imageVersion: "1.0.0",
          variant: "softhsm",
          component: "peer",
        },
        { executor, workspaceFactory }
      );
      expect(result.images).toHaveLength(1);
      expect(
        calls.map((call) => `${call.spec.command} ${call.spec.args[0]}`)
      ).toEqual([
        "go version",
        "go env",
        "git clone",
        "make peer-docker",
        "docker tag",
        "docker build",
      ]);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
    });

    it("clones each upstream once for the default all components", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor, calls } = fakeExecutor();
      const result = await buildImages(
        {
          cwd: tmpDir,
          imageVersion: "1.0.0",
          variant: "softhsm",
        },
        { executor, workspaceFactory }
      );
      expect(result.images.map((image) => image.component)).toEqual([
        "ca",
        "peer",
        "orderer",
      ]);
      const cloneCalls = calls.filter((call) => call.spec.command === "git");
      expect(cloneCalls).toHaveLength(2);
      expect(
        cloneCalls.filter((call) =>
          call.spec.args.includes("https://github.com/hyperledger/fabric.git")
        )
      ).toHaveLength(1);
      expect(
        cloneCalls.filter((call) =>
          call.spec.args.includes(
            "https://github.com/hyperledger/fabric-ca.git"
          )
        )
      ).toHaveLength(1);
      const makeCalls = calls.filter((call) => call.spec.command === "make");
      expect(makeCalls).toHaveLength(2);
      const fabricMake = makeCalls.filter((call) =>
        call.spec.args.includes("peer-docker")
      );
      expect(fabricMake).toHaveLength(1);
      expect(fabricMake[0].spec.args).toEqual([
        "peer-docker",
        "orderer-docker",
        "GO_TAGS=pkcs11",
        "DOCKER_NS=ghcr.io/decaf-ts/fabric-weaver/pkcs11",
      ]);
      const buildCalls = calls.filter(
        (call) =>
          call.spec.command === "docker" && call.spec.args[0] === "build"
      );
      expect(buildCalls).toHaveLength(3);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
    });

    it("removes the workspace when the executor rejects a build", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "docker" && spec.args[0] === "build") {
          throw new Error("build failed");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      await expect(
        buildImages(
          { cwd: tmpDir, imageVersion: "1.0.0", component: "ca" },
          { executor, workspaceFactory }
        )
      ).rejects.toThrow(WeaverImagesError);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
    });

    it("propagates push failures and removes the workspace", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "docker" && spec.args[0] === "push") {
          throw new Error("push denied");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      await expect(
        buildImages(
          {
            cwd: tmpDir,
            imageVersion: "1.0.0",
            component: "ca",
            publish: true,
          },
          { executor, workspaceFactory }
        )
      ).rejects.toThrow(WeaverImagesError);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
    });

    it("never pushes when a build fails with publish enabled", async () => {
      const { executor, calls } = fakeExecutor(async (spec) => {
        if (spec.command === "docker" && spec.args[0] === "build") {
          throw new Error("build failed");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      await expect(
        buildImages(
          {
            cwd: tmpDir,
            imageVersion: "1.0.0",
            component: "ca",
            publish: true,
          },
          { executor }
        )
      ).rejects.toThrow(WeaverImagesError);
      expect(
        calls.some(
          (call) =>
            call.spec.command === "docker" && call.spec.args[0] === "push"
        )
      ).toBe(false);
    });

    it("propagates a clone failure and removes the workspace", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "git") {
          throw new Error("clone failed");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      await expect(
        buildImages(
          {
            cwd: tmpDir,
            imageVersion: "1.0.0",
            variant: "softhsm",
            component: "peer",
          },
          { executor, workspaceFactory }
        )
      ).rejects.toThrow(WeaverImagesError);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
    });

    it("propagates a make failure and removes the workspace", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "make") {
          throw new Error("make failed");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      await expect(
        buildImages(
          {
            cwd: tmpDir,
            imageVersion: "1.0.0",
            variant: "softhsm",
            component: "peer",
          },
          { executor, workspaceFactory }
        )
      ).rejects.toThrow(WeaverImagesError);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(false);
    });

    it("keeps the workspace on a failed build when keepWorkdir is true", async () => {
      let workspacePath: string | undefined;
      const workspaceFactory: WorkspaceFactory = async (options) => {
        const workspace = await createWorkspace(options);
        workspacePath = workspace.path;
        return workspace;
      };
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "docker" && spec.args[0] === "build") {
          throw new Error("build failed");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      await expect(
        buildImages(
          {
            cwd: tmpDir,
            imageVersion: "1.0.0",
            component: "ca",
            keepWorkdir: true,
          },
          { executor, workspaceFactory }
        )
      ).rejects.toThrow(WeaverImagesError);
      expect(workspacePath).toBeDefined();
      expect(fs.existsSync(workspacePath as string)).toBe(true);
      await fsp.rm(workspacePath as string, { recursive: true, force: true });
    });

    it("keeps the workspace and returns its path when keepWorkdir is true", async () => {
      const { executor } = fakeExecutor();
      const result = await buildImages(
        {
          cwd: tmpDir,
          imageVersion: "1.0.0",
          component: "ca",
          keepWorkdir: true,
        },
        { executor }
      );
      expect(result.workdir).toBeDefined();
      const workspace: Workspace = {
        path: result.workdir as string,
        cleanup: async () => undefined,
      };
      expect(fs.existsSync(workspace.path)).toBe(true);
      await fsp.rm(workspace.path, { recursive: true, force: true });
    });
  });
});
