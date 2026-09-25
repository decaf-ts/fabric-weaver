import {
  dockerBuild,
  dockerBuildSpec,
  dockerPull,
  dockerPullSpec,
  dockerPush,
  dockerPushSpec,
  dockerTag,
  dockerTagSpec,
} from "../../src/docker/images/docker";
import type {
  ProcessExecutor,
  ProcessOptions,
  ProcessSpec,
} from "../../src/docker/images/types";

interface RecordedCall {
  spec: ProcessSpec;
  options?: ProcessOptions;
}

function fakeExecutor(): {
  executor: ProcessExecutor;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];
  const executor: ProcessExecutor = async (spec, options) => {
    calls.push({ spec, options });
    return { command: spec.command, args: spec.args, stdout: "ok" };
  };
  return { executor, calls };
}

const buildInput = {
  dockerfile: "/tmp/ws/Dockerfile-peer",
  context: "/tmp/ws",
  sourceImage: "hyperledger/fabric-peer",
  sourceTag: "2.5.12",
  target: "clean",
  tags: ["ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7"],
};

describe("docker", () => {
  describe("dockerPullSpec", () => {
    it("builds the exact pull spec", () => {
      expect(dockerPullSpec("hyperledger/fabric-peer:2.5.12")).toEqual({
        command: "docker",
        args: ["pull", "hyperledger/fabric-peer:2.5.12"],
      });
    });
  });

  describe("dockerBuildSpec", () => {
    it("builds the exact minimal build spec with the context last", () => {
      expect(dockerBuildSpec(buildInput)).toEqual({
        command: "docker",
        args: [
          "build",
          "--file",
          "/tmp/ws/Dockerfile-peer",
          "--target",
          "clean",
          "--build-arg",
          "SOURCE_IMAGE=hyperledger/fabric-peer",
          "--build-arg",
          "SOURCE_TAG=2.5.12",
          "-t",
          "ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7",
          "/tmp/ws",
        ],
      });
    });

    it("adds platform, pull and no-cache flags when requested", () => {
      expect(
        dockerBuildSpec({
          ...buildInput,
          platform: "linux/amd64",
          pull: true,
          noCache: true,
        }).args
      ).toEqual([
        "build",
        "--file",
        "/tmp/ws/Dockerfile-peer",
        "--target",
        "clean",
        "--build-arg",
        "SOURCE_IMAGE=hyperledger/fabric-peer",
        "--build-arg",
        "SOURCE_TAG=2.5.12",
        "--platform",
        "linux/amd64",
        "--pull",
        "--no-cache",
        "-t",
        "ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7",
        "/tmp/ws",
      ]);
    });

    it("omits platform, pull and no-cache when not requested", () => {
      const args = dockerBuildSpec(buildInput).args;
      expect(args).not.toContain("--platform");
      expect(args).not.toContain("--pull");
      expect(args).not.toContain("--no-cache");
    });

    it("supports multiple tags", () => {
      const args = dockerBuildSpec({
        ...buildInput,
        tags: ["a:1", "a:latest"],
      }).args;
      expect(args).toEqual([
        "build",
        "--file",
        "/tmp/ws/Dockerfile-peer",
        "--target",
        "clean",
        "--build-arg",
        "SOURCE_IMAGE=hyperledger/fabric-peer",
        "--build-arg",
        "SOURCE_TAG=2.5.12",
        "-t",
        "a:1",
        "-t",
        "a:latest",
        "/tmp/ws",
      ]);
    });
  });

  describe("dockerTagSpec", () => {
    it("builds the exact tag spec", () => {
      expect(dockerTagSpec({ source: "src:1", target: "dst:1" })).toEqual({
        command: "docker",
        args: ["tag", "src:1", "dst:1"],
      });
    });
  });

  describe("dockerPushSpec", () => {
    it("builds the exact push spec", () => {
      expect(
        dockerPushSpec("ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7")
      ).toEqual({
        command: "docker",
        args: ["push", "ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7"],
      });
    });
  });

  describe("executor delegation", () => {
    it("dockerPull delegates to the injected executor", async () => {
      const { executor, calls } = fakeExecutor();
      const spec = dockerPullSpec("hyperledger/fabric-ca:1.5.15");
      const result = await dockerPull(spec, { executor });
      expect(result.stdout).toBe("ok");
      expect(calls).toHaveLength(1);
      expect(calls[0].spec).toEqual(spec);
    });

    it("dockerBuild delegates to the injected executor", async () => {
      const { executor, calls } = fakeExecutor();
      const spec = dockerBuildSpec(buildInput);
      const result = await dockerBuild(spec, { executor });
      expect(result.stdout).toBe("ok");
      expect(calls).toHaveLength(1);
      expect(calls[0].spec).toEqual(spec);
    });

    it("dockerTag delegates to the injected executor", async () => {
      const { executor, calls } = fakeExecutor();
      const spec = dockerTagSpec({ source: "src:1", target: "dst:1" });
      const result = await dockerTag(spec, { executor });
      expect(result.stdout).toBe("ok");
      expect(calls).toHaveLength(1);
      expect(calls[0].spec).toEqual(spec);
    });

    it("dockerPush delegates to the injected executor", async () => {
      const { executor, calls } = fakeExecutor();
      const spec = dockerPushSpec("dst:1");
      const result = await dockerPush(spec, { executor });
      expect(result.stdout).toBe("ok");
      expect(calls).toHaveLength(1);
      expect(calls[0].spec).toEqual(spec);
    });
  });
});
