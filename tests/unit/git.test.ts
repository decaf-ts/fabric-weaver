import { gitClone, gitCloneSpec } from "../../src/docker/images/git";
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
    return { command: spec.command, args: spec.args, stdout: "" };
  };
  return { executor, calls };
}

const cloneInput = {
  repository: "https://github.com/hyperledger/fabric.git",
  ref: "v2.5.12",
  destination: "/tmp/fabric",
};

describe("git", () => {
  describe("gitCloneSpec", () => {
    it("builds the exact shallow clone spec", () => {
      expect(gitCloneSpec(cloneInput)).toEqual({
        command: "git",
        args: [
          "clone",
          "--depth",
          "1",
          "--branch",
          "v2.5.12",
          "https://github.com/hyperledger/fabric.git",
          "/tmp/fabric",
        ],
      });
    });

    it("honors a custom depth", () => {
      expect(gitCloneSpec({ ...cloneInput, depth: 5 }).args).toEqual([
        "clone",
        "--depth",
        "5",
        "--branch",
        "v2.5.12",
        "https://github.com/hyperledger/fabric.git",
        "/tmp/fabric",
      ]);
    });
  });

  describe("gitClone", () => {
    it("delegates to the injected executor with the clone spec", async () => {
      const { executor, calls } = fakeExecutor();
      const result = await gitClone(cloneInput, { executor });
      expect(result).toEqual({
        command: "git",
        args: [
          "clone",
          "--depth",
          "1",
          "--branch",
          "v2.5.12",
          "https://github.com/hyperledger/fabric.git",
          "/tmp/fabric",
        ],
        stdout: "",
      });
      expect(calls).toHaveLength(1);
      expect(calls[0].spec).toEqual(gitCloneSpec(cloneInput));
    });
  });
});
