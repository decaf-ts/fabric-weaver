import { WeaverImagesError } from "../../src/docker/images/errors";
import {
  defaultProcessExecutor,
  quoteCommand,
  runProcess,
} from "../../src/docker/images/process";
import type {
  ProcessExecutor,
  ProcessOptions,
  ProcessSpec,
} from "../../src/docker/images/types";

interface RecordedCall {
  spec: ProcessSpec;
  options?: ProcessOptions;
}

function fakeExecutor(
  handler?: (
    spec: ProcessSpec,
    options?: ProcessOptions
  ) => Promise<{ command: string; args: string[]; stdout: string }>
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

describe("process", () => {
  describe("quoteCommand", () => {
    it("leaves plain arguments unquoted", () => {
      expect(
        quoteCommand({
          command: "git",
          args: ["clone", "--depth", "1", "--branch", "v2.5.12"],
        })
      ).toBe("git clone --depth 1 --branch v2.5.12");
    });

    it("quotes arguments containing spaces", () => {
      expect(
        quoteCommand({ command: "docker", args: ["build", "/tmp/my context"] })
      ).toBe("docker build '/tmp/my context'");
    });

    it("escapes single quotes", () => {
      expect(quoteCommand({ command: "sh", args: ["it's"] })).toBe(
        "sh 'it'\\''s'"
      );
    });

    it("renders empty arguments as empty quotes", () => {
      expect(quoteCommand({ command: "echo", args: [""] })).toBe("echo ''");
    });
  });

  describe("runProcess", () => {
    it("passes the spec and options through to the executor", async () => {
      const spec: ProcessSpec = { command: "docker", args: ["pull", "img:1"] };
      const options: ProcessOptions = { cwd: "/tmp", env: { A: "1" } };
      const { executor, calls } = fakeExecutor();
      const result = await runProcess(spec, options, executor);
      expect(result).toEqual({
        command: "docker",
        args: ["pull", "img:1"],
        stdout: "",
      });
      expect(calls).toHaveLength(1);
      expect(calls[0].spec).toEqual(spec);
      expect(calls[0].options).toEqual(options);
    });

    it("defaults to the local process executor", async () => {
      const result = await runProcess({
        command: process.execPath,
        args: ["-e", "process.stdout.write('ok')"],
      });
      expect(result.stdout).toContain("ok");
    });

    it("wraps executor failures with the rendered command", async () => {
      const spec: ProcessSpec = { command: "git", args: ["clone", "/a b"] };
      const { executor } = fakeExecutor(async () => {
        throw new Error("boom");
      });
      await expect(runProcess(spec, undefined, executor)).rejects.toThrow(
        WeaverImagesError
      );
      await expect(runProcess(spec, undefined, executor)).rejects.toThrow(
        /Failed to run command: git clone '\/a b'/
      );
    });
  });

  describe("defaultProcessExecutor", () => {
    it("executes a local command and captures stdout", async () => {
      const result = await defaultProcessExecutor({
        command: process.execPath,
        args: ["-e", "process.stdout.write('ok')"],
      });
      expect(result.command).toBe(process.execPath);
      expect(result.stdout).toContain("ok");
    });
  });
});
