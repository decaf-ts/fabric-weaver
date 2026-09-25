import fs from "node:fs/promises";
import path from "node:path";
import { WeaverImagesError } from "../../src/docker/images/errors";
import {
  buildComponent,
  buildComponentPlan,
  ensureSofthsmSource,
  pushImage,
} from "../../src/docker/images/fabric";
import { resolveImageConfig } from "../../src/docker/images/image-builder";
import type {
  BuiltImage,
  FabricComponent,
  ProcessExecutor,
  ProcessOptions,
  ProcessResult,
  ProcessSpec,
  ResolvedImageConfig,
  SofthsmSource,
  Workspace,
} from "../../src/docker/images/types";
import { hostPlatform } from "../../src/docker/images/versions";
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

function makeConfig(
  overrides: Partial<ResolvedImageConfig> = {}
): ResolvedImageConfig {
  return {
    registry: "ghcr.io/decaf-ts",
    repository: "fabric-weaver",
    imageVersion: "3.4.7",
    fabricVersion: "2.5.12",
    caVersion: "1.5.15",
    fabricGitRef: "v2.5.12",
    caGitRef: "v1.5.15",
    fabricDockerTag: "2.5.12",
    caDockerTag: "1.5.15",
    variant: "clean",
    components: ["ca", "peer", "orderer"],
    publish: false,
    pull: false,
    noCache: false,
    dryRun: false,
    keepWorkdir: false,
    includeLatest: false,
    cwd: process.cwd(),
    ...overrides,
  };
}

describe("fabric", () => {
  describe("buildComponentPlan clean", () => {
    it("plans exactly one docker build for ca", () => {
      const operations = buildComponentPlan(makeConfig(), "ca");
      expect(operations).toHaveLength(1);
      expect(operations[0].kind).toBe("docker-build");
      expect(operations[0].description).toContain(
        "hyperledger/fabric-ca:1.5.15"
      );
      expect(operations[0].spec).toEqual({
        command: "docker",
        args: [
          "build",
          "--file",
          path.join("<workspace>", "Dockerfile-ca"),
          "--target",
          "clean",
          "--build-arg",
          "SOURCE_IMAGE=hyperledger/fabric-ca",
          "--build-arg",
          "SOURCE_TAG=1.5.15",
          "-t",
          "ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7",
          "<workspace>",
        ],
      });
    });

    it("plans a docker pull before the clean build when pull is true", () => {
      const operations = buildComponentPlan(makeConfig({ pull: true }), "ca");
      expect(operations.map((operation) => operation.kind)).toEqual([
        "docker-pull",
        "docker-build",
      ]);
      expect(operations[0].spec).toEqual({
        command: "docker",
        args: ["pull", "hyperledger/fabric-ca:1.5.15"],
      });
      expect(operations[1].spec.args).not.toContain("--pull");
    });

    it("plans a peer build from the pinned upstream peer image", () => {
      const operations = buildComponentPlan(makeConfig(), "peer");
      expect(operations).toHaveLength(1);
      expect(operations[0].description).toContain(
        "hyperledger/fabric-peer:2.5.12"
      );
      expect(operations[0].spec.args).toEqual([
        "build",
        "--file",
        path.join("<workspace>", "Dockerfile-peer"),
        "--target",
        "clean",
        "--build-arg",
        "SOURCE_IMAGE=hyperledger/fabric-peer",
        "--build-arg",
        "SOURCE_TAG=2.5.12",
        "-t",
        "ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7",
        "<workspace>",
      ]);
    });
  });

  describe("buildComponentPlan softhsm", () => {
    it("plans clone, make, tag and build for the peer", () => {
      const config = makeConfig({
        variant: "softhsm",
        components: ["peer"],
        fabricVersion: "2.5.16",
        fabricGitRef: "v2.5.16",
        fabricDockerTag: "2.5.16",
      });
      const operations = buildComponentPlan(config, "peer");
      expect(operations.map((operation) => operation.kind)).toEqual([
        "git-clone",
        "make",
        "docker-tag",
        "docker-build",
      ]);
      expect(operations[0].spec).toEqual({
        command: "git",
        args: [
          "clone",
          "--depth",
          "1",
          "--branch",
          "v2.5.16",
          "https://github.com/hyperledger/fabric.git",
          path.join("<workspace>", "fabric"),
        ],
      });
      expect(operations[1].spec).toEqual({
        command: "make",
        args: [
          "peer-docker",
          "GO_TAGS=pkcs11",
          "DOCKER_NS=ghcr.io/decaf-ts/fabric-weaver/pkcs11",
        ],
      });
      expect(operations[2].spec).toEqual({
        command: "docker",
        args: [
          "tag",
          "ghcr.io/decaf-ts/fabric-weaver/pkcs11/fabric-peer:latest",
          "ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11:2.5.16",
        ],
      });
      expect(operations[3].spec.args).toEqual([
        "build",
        "--file",
        path.join("<workspace>", "Dockerfile-peer"),
        "--target",
        "softhsm",
        "--build-arg",
        "SOURCE_IMAGE=ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11",
        "--build-arg",
        "SOURCE_TAG=2.5.16",
        "-t",
        "ghcr.io/decaf-ts/fabric-weaver/peer-softhsm:3.4.7",
        "<workspace>",
      ]);
    });

    it("plans make docker and the intermediate tag for the ca", () => {
      const config = makeConfig({
        variant: "softhsm",
        components: ["ca"],
        caVersion: "1.5.22",
        caGitRef: "v1.5.22",
        caDockerTag: "1.5.22",
      });
      const operations = buildComponentPlan(config, "ca");
      expect(operations.map((operation) => operation.kind)).toEqual([
        "git-clone",
        "make",
        "docker-tag",
        "docker-build",
      ]);
      expect(operations[1].spec).toEqual({
        command: "make",
        args: ["docker", "DOCKER_NS=ghcr.io/decaf-ts/fabric-weaver/pkcs11"],
      });
      expect(operations[2].spec).toEqual({
        command: "docker",
        args: [
          "tag",
          "ghcr.io/decaf-ts/fabric-weaver/pkcs11/fabric-ca:1.5.22",
          "ghcr.io/decaf-ts/fabric-weaver/pkcs11/ca-pkcs11:1.5.22",
        ],
      });
    });
  });

  describe("ensureSofthsmSource", () => {
    let workspace: Workspace;

    beforeEach(async () => {
      workspace = await createWorkspace();
    });

    afterEach(async () => {
      await workspace.cleanup();
    });

    it("clones and makes fabric once for peer and orderer", async () => {
      const { executor, calls } = fakeExecutor();
      const config = makeConfig({
        variant: "softhsm",
        components: ["peer", "orderer"],
      });
      const sources = new Map<FabricComponent, SofthsmSource>();
      const peer = await ensureSofthsmSource(
        config,
        "peer",
        workspace,
        { executor },
        sources
      );
      const orderer = await ensureSofthsmSource(
        config,
        "orderer",
        workspace,
        { executor },
        sources
      );
      expect(peer).toEqual({
        image: "ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11",
        tag: "2.5.12",
      });
      expect(orderer).toEqual({
        image: "ghcr.io/decaf-ts/fabric-weaver/pkcs11/orderer-pkcs11",
        tag: "2.5.12",
      });
      const goCalls = calls.filter((call) => call.spec.command === "go");
      expect(goCalls.map((call) => call.spec.args)).toEqual([
        ["version"],
        ["env", "GOARCH"],
      ]);
      const cloneCalls = calls.filter((call) => call.spec.command === "git");
      expect(cloneCalls).toHaveLength(1);
      expect(cloneCalls[0].spec.args).toEqual([
        "clone",
        "--depth",
        "1",
        "--branch",
        "v2.5.12",
        "https://github.com/hyperledger/fabric.git",
        path.join(workspace.path, "fabric"),
      ]);
      const makeCalls = calls.filter((call) => call.spec.command === "make");
      expect(makeCalls).toHaveLength(1);
      expect(makeCalls[0].spec.args).toEqual([
        "peer-docker",
        "orderer-docker",
        "GO_TAGS=pkcs11",
        "DOCKER_NS=ghcr.io/decaf-ts/fabric-weaver/pkcs11",
      ]);
      const tagCalls = calls.filter(
        (call) => call.spec.command === "docker" && call.spec.args[0] === "tag"
      );
      expect(tagCalls).toHaveLength(2);
      expect(tagCalls.map((call) => call.spec.args[2])).toEqual([
        "ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11:2.5.12",
        "ghcr.io/decaf-ts/fabric-weaver/pkcs11/orderer-pkcs11:2.5.12",
      ]);
    });

    it("clones and builds fabric-ca for the ca", async () => {
      const arch = hostPlatform().replace("linux/", "");
      const { executor, calls } = fakeExecutor(async (spec) => ({
        command: spec.command,
        args: spec.args,
        stdout: spec.command === "go" && spec.args[0] === "env" ? arch : "",
      }));
      const config = makeConfig({
        variant: "softhsm",
        components: ["ca"],
        platform: hostPlatform(),
      });
      const source = await ensureSofthsmSource(
        config,
        "ca",
        workspace,
        { executor },
        new Map()
      );
      expect(source).toEqual({
        image: "ghcr.io/decaf-ts/fabric-weaver/pkcs11/ca-pkcs11",
        tag: "1.5.15",
      });
      const goCalls = calls.filter((call) => call.spec.command === "go");
      expect(goCalls.map((call) => call.spec.args)).toEqual([
        ["version"],
        ["env", "GOARCH"],
        ["list", "-m", "toolchain"],
      ]);
      expect(goCalls[2].options?.cwd).toBe(
        path.join(workspace.path, "fabric-ca")
      );
      const cloneCalls = calls.filter((call) => call.spec.command === "git");
      expect(cloneCalls).toHaveLength(1);
      expect(cloneCalls[0].spec.args).toEqual([
        "clone",
        "--depth",
        "1",
        "--branch",
        "v1.5.15",
        "https://github.com/hyperledger/fabric-ca.git",
        path.join(workspace.path, "fabric-ca"),
      ]);
      const makeCalls = calls.filter((call) => call.spec.command === "make");
      expect(makeCalls).toHaveLength(1);
      expect(makeCalls[0].spec.args).toEqual([
        "docker",
        "DOCKER_NS=ghcr.io/decaf-ts/fabric-weaver/pkcs11",
      ]);
      expect(makeCalls[0].options?.cwd).toBe(
        path.join(workspace.path, "fabric-ca")
      );
      expect(makeCalls[0].options?.env?.DOCKER_DEFAULT_PLATFORM).toBe(
        hostPlatform()
      );
    });

    it("passes build flags and platform to the make environment", async () => {
      const arch = hostPlatform().replace("linux/", "");
      const { executor, calls } = fakeExecutor(async (spec) => ({
        command: spec.command,
        args: spec.args,
        stdout: spec.command === "go" && spec.args[0] === "env" ? arch : "",
      }));
      const config = makeConfig({
        variant: "softhsm",
        components: ["ca", "peer"],
        platform: hostPlatform(),
        pull: true,
        noCache: true,
      });
      await ensureSofthsmSource(
        config,
        "ca",
        workspace,
        { executor },
        new Map()
      );
      await ensureSofthsmSource(
        config,
        "peer",
        workspace,
        { executor },
        new Map()
      );
      const makeCalls = calls.filter((call) => call.spec.command === "make");
      expect(makeCalls).toHaveLength(2);
      for (const call of makeCalls) {
        expect(call.options?.env).toEqual({
          DOCKER_DEFAULT_PLATFORM: hostPlatform(),
          DOCKER_BUILD_FLAGS: "--pull --no-cache",
        });
      }
    });

    it("throws when the Go architecture does not match the requested platform", async () => {
      const { executor } = fakeExecutor(async (spec) => ({
        command: spec.command,
        args: spec.args,
        stdout: spec.command === "go" && spec.args[0] === "env" ? "mips" : "",
      }));
      const config = makeConfig({
        variant: "softhsm",
        components: ["ca"],
        platform: hostPlatform(),
      });
      await expect(
        ensureSofthsmSource(config, "ca", workspace, { executor }, new Map())
      ).rejects.toThrow(WeaverImagesError);
      await expect(
        ensureSofthsmSource(config, "ca", workspace, { executor }, new Map())
      ).rejects.toThrow(/does not match the requested --platform/);
    });

    it("throws when the fabric-ca toolchain check fails", async () => {
      const arch = hostPlatform().replace("linux/", "");
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "go" && spec.args[0] === "list") {
          throw new Error("toolchain too old");
        }
        return {
          command: spec.command,
          args: spec.args,
          stdout: spec.command === "go" && spec.args[0] === "env" ? arch : "",
        };
      });
      const config = makeConfig({ variant: "softhsm", components: ["ca"] });
      await expect(
        ensureSofthsmSource(config, "ca", workspace, { executor }, new Map())
      ).rejects.toThrow(WeaverImagesError);
      await expect(
        ensureSofthsmSource(config, "ca", workspace, { executor }, new Map())
      ).rejects.toThrow(/Go >= 1.21/);
    });

    it("throws when go is unavailable", async () => {
      const { executor } = fakeExecutor(async (spec) => {
        if (spec.command === "go") {
          throw new Error("go missing");
        }
        return { command: spec.command, args: spec.args, stdout: "" };
      });
      const config = makeConfig({ variant: "softhsm", components: ["ca"] });
      await expect(
        ensureSofthsmSource(config, "ca", workspace, { executor }, new Map())
      ).rejects.toThrow(WeaverImagesError);
      await expect(
        ensureSofthsmSource(config, "ca", workspace, { executor }, new Map())
      ).rejects.toThrow(/Go is required/);
    });

    it("throws when the requested component is not in the fabric group", async () => {
      const { executor } = fakeExecutor();
      const config = makeConfig({
        variant: "softhsm",
        components: ["orderer"],
      });
      await expect(
        ensureSofthsmSource(config, "peer", workspace, { executor }, new Map())
      ).rejects.toThrow(WeaverImagesError);
      await expect(
        ensureSofthsmSource(config, "peer", workspace, { executor }, new Map())
      ).rejects.toThrow(/was not produced/);
    });

    it("rejects cross-platform softhsm builds", () => {
      const host = hostPlatform();
      const cross = host === "linux/amd64" ? "linux/arm64" : "linux/amd64";
      expect(() =>
        resolveImageConfig({
          variant: "softhsm",
          platform: cross,
          imageVersion: "1.0.0",
        })
      ).toThrow(WeaverImagesError);
      expect(() =>
        resolveImageConfig({
          variant: "softhsm",
          platform: cross,
          imageVersion: "1.0.0",
        })
      ).toThrow(/Cross-platform/);
    });
  });

  describe("buildComponent", () => {
    let workspace: Workspace;

    beforeEach(async () => {
      workspace = await createWorkspace();
    });

    afterEach(async () => {
      await workspace.cleanup();
    });

    it("writes the dockerfile and runs one clean build without cloning", async () => {
      const { executor, calls } = fakeExecutor();
      const dockerfiles = (component: FabricComponent) => `FROM ${component}\n`;
      const config = makeConfig({ components: ["ca"] });
      const image = await buildComponent(config, "ca", workspace, {
        executor,
        dockerfiles,
      });
      const dockerfilePath = path.join(workspace.path, "Dockerfile-ca");
      const content = await fs.readFile(dockerfilePath, "utf8");
      expect(content).toBe("FROM ca\n");
      expect(image).toEqual({
        component: "ca",
        variant: "clean",
        imageName: "ghcr.io/decaf-ts/fabric-weaver/ca-base",
        tags: ["3.4.7"],
        references: ["ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7"],
      });
      expect(calls).toHaveLength(1);
      expect(calls[0].spec.args).toEqual([
        "build",
        "--file",
        dockerfilePath,
        "--target",
        "clean",
        "--build-arg",
        "SOURCE_IMAGE=hyperledger/fabric-ca",
        "--build-arg",
        "SOURCE_TAG=1.5.15",
        "-t",
        "ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7",
        workspace.path,
      ]);
      expect(calls.some((call) => call.spec.command === "git")).toBe(false);
    });

    it("pulls the pinned upstream image before building when pull is true", async () => {
      const { executor, calls } = fakeExecutor();
      const dockerfiles = () => "FROM scratch\n";
      const config = makeConfig({ components: ["ca"], pull: true });
      await buildComponent(config, "ca", workspace, {
        executor,
        dockerfiles,
      });
      expect(calls).toHaveLength(2);
      expect(calls[0].spec).toEqual({
        command: "docker",
        args: ["pull", "hyperledger/fabric-ca:1.5.15"],
      });
      expect(calls[1].spec.args[0]).toBe("build");
      expect(calls[1].spec.args).not.toContain("--pull");
    });

    it("builds the softhsm target from the intermediate source", async () => {
      const { executor, calls } = fakeExecutor();
      const dockerfiles = () => "FROM scratch\n";
      const config = makeConfig({
        variant: "softhsm",
        components: ["ca"],
        pull: true,
      });
      const image = await buildComponent(config, "ca", workspace, {
        executor,
        dockerfiles,
      });
      expect(image.variant).toBe("softhsm");
      const buildCalls = calls.filter(
        (call) =>
          call.spec.command === "docker" && call.spec.args[0] === "build"
      );
      expect(buildCalls).toHaveLength(1);
      expect(buildCalls[0].spec.args).toEqual([
        "build",
        "--file",
        path.join(workspace.path, "Dockerfile-ca"),
        "--target",
        "softhsm",
        "--build-arg",
        "SOURCE_IMAGE=ghcr.io/decaf-ts/fabric-weaver/pkcs11/ca-pkcs11",
        "--build-arg",
        "SOURCE_TAG=1.5.15",
        "-t",
        "ghcr.io/decaf-ts/fabric-weaver/ca-softhsm:3.4.7",
        workspace.path,
      ]);
      expect(buildCalls[0].spec.args).not.toContain("--pull");
    });

    it("pushes every reference through pushImage", async () => {
      const { executor, calls } = fakeExecutor();
      const image: BuiltImage = {
        component: "peer",
        variant: "clean",
        imageName: "ghcr.io/decaf-ts/fabric-weaver/peer-base",
        tags: ["3.4.7", "latest"],
        references: [
          "ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7",
          "ghcr.io/decaf-ts/fabric-weaver/peer-base:latest",
        ],
      };
      const pushed = await pushImage(image, { executor });
      expect(pushed).toEqual(image.references);
      expect(calls.map((call) => call.spec)).toEqual([
        {
          command: "docker",
          args: ["push", "ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7"],
        },
        {
          command: "docker",
          args: ["push", "ghcr.io/decaf-ts/fabric-weaver/peer-base:latest"],
        },
      ]);
    });
  });
});
