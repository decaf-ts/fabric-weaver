import type { Logger } from "@decaf-ts/logging";
import {
  WeaverImagesCommand,
  toBuildImagesOptions,
} from "../../src/docker/images/cli";
import * as imageBuilder from "../../src/docker/images/image-builder";
import type { ImageBuildPlan } from "../../src/docker/images/types";
import { VERSION } from "../../src/version";

function makePlan(): ImageBuildPlan {
  const images = [
    {
      component: "ca" as const,
      variant: "clean" as const,
      imageName: "ghcr.io/decaf-ts/fabric-weaver/ca-base",
      tags: ["9.9.9"],
      references: ["ghcr.io/decaf-ts/fabric-weaver/ca-base:9.9.9"],
    },
  ];
  return {
    images,
    operations: [
      {
        kind: "docker-build",
        description: "Build clean ca image",
        spec: { command: "docker", args: ["build", "--target", "clean", "."] },
      },
    ],
  };
}

describe("cli", () => {
  describe("toBuildImagesOptions", () => {
    it("maps kebab-case keys to camelCase", () => {
      expect(
        toBuildImagesOptions({
          variant: "softhsm",
          component: "peer",
          "image-version": "3.4.7",
          "fabric-version": "2.5.16",
          "ca-version": "1.5.22",
          registry: "reg",
          repository: "repo",
          platform: "amd64",
          publish: true,
          pull: true,
          "no-cache": true,
          "dry-run": true,
          "keep-workdir": true,
          latest: true,
        })
      ).toEqual({
        variant: "softhsm",
        component: "peer",
        imageVersion: "3.4.7",
        fabricVersion: "2.5.16",
        caVersion: "1.5.22",
        registry: "reg",
        repository: "repo",
        platform: "amd64",
        publish: true,
        pull: true,
        noCache: true,
        dryRun: true,
        keepWorkdir: true,
        includeLatest: true,
      });
    });

    it("leaves absent keys undefined", () => {
      const options = toBuildImagesOptions({});
      expect(Object.keys(options)).toHaveLength(0);
      expect(options).toEqual({});
    });
  });

  describe("WeaverImagesCommand", () => {
    const originalArgv = [...process.argv];

    beforeEach(() => {
      process.argv = ["node", "weaver-images"];
    });

    afterEach(() => {
      process.argv = originalArgv;
      jest.restoreAllMocks();
    });

    it("resolves to the source VERSION for --version", async () => {
      process.argv = ["node", "weaver-images", "--version"];
      const command = new WeaverImagesCommand();
      await expect(command.execute()).resolves.toBe(VERSION);
    });

    it("resolves for --help without throwing", async () => {
      process.argv = ["node", "weaver-images", "--help"];
      const command = new WeaverImagesCommand();
      await expect(command.execute()).resolves.toBeUndefined();
    });

    it("resolves through buildImages and logs the plan on --dry-run", async () => {
      process.argv = [
        "node",
        "weaver-images",
        "--dry-run",
        "--image-version",
        "9.9.9",
        "--component",
        "ca",
      ];
      const plan = makePlan();
      const buildSpy = jest
        .spyOn(imageBuilder, "buildImages")
        .mockResolvedValue({
          images: plan.images,
          pushed: [],
          plan,
        });
      const command = new WeaverImagesCommand();
      const log = (command as unknown as { log: Logger }).log;
      const infoSpy = jest
        .spyOn(log, "info")
        .mockImplementation(() => undefined);
      const result = await command.execute();
      expect(buildSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          dryRun: true,
          imageVersion: "9.9.9",
          component: "ca",
        })
      );
      expect(result).toEqual({ images: plan.images, pushed: [], plan });
      const output = infoSpy.mock.calls
        .map((call) => String(call[0]))
        .join("\n");
      expect(output).toContain("[docker-build] Build clean ca image");
      expect(output).toContain("docker build --target clean .");
    });

    it("accepts a leading build positional for --dry-run", async () => {
      process.argv = [
        "node",
        "weaver-images",
        "build",
        "--dry-run",
        "--image-version",
        "9.9.9",
      ];
      const plan = makePlan();
      const buildSpy = jest
        .spyOn(imageBuilder, "buildImages")
        .mockResolvedValue({
          images: plan.images,
          pushed: [],
          plan,
        });
      const command = new WeaverImagesCommand();
      const log = (command as unknown as { log: Logger }).log;
      jest.spyOn(log, "info").mockImplementation(() => undefined);
      await command.execute();
      expect(buildSpy).toHaveBeenCalledWith(
        expect.objectContaining({ dryRun: true, imageVersion: "9.9.9" })
      );
      expect(process.argv[2]).toBe("build");
    });

    it("resolves VERSION for --version with a leading build positional", async () => {
      process.argv = ["node", "weaver-images", "build", "--version"];
      const buildSpy = jest.spyOn(imageBuilder, "buildImages");
      const command = new WeaverImagesCommand();
      await expect(command.execute()).resolves.toBe(VERSION);
      expect(buildSpy).not.toHaveBeenCalled();
    });

    it("passes the mapped options to buildImages for a real run", async () => {
      process.argv = [
        "node",
        "weaver-images",
        "--image-version",
        "1.2.3",
        "--component",
        "peer",
        "--publish",
      ];
      const buildSpy = jest
        .spyOn(imageBuilder, "buildImages")
        .mockResolvedValue({ images: [], pushed: [] });
      const command = new WeaverImagesCommand();
      const log = (command as unknown as { log: Logger }).log;
      jest.spyOn(log, "info").mockImplementation(() => undefined);
      await command.execute();
      expect(buildSpy).toHaveBeenCalledWith({
        variant: "clean",
        component: "peer",
        imageVersion: "1.2.3",
        fabricVersion: "2.5.12",
        caVersion: "1.5.15",
        registry: "ghcr.io/decaf-ts",
        repository: "fabric-weaver",
        publish: true,
        pull: false,
        noCache: false,
        dryRun: false,
        keepWorkdir: false,
        includeLatest: false,
      });
    });

    it("logs the pushed reference count for a real run", async () => {
      process.argv = [
        "node",
        "weaver-images",
        "--image-version",
        "1.2.3",
        "--component",
        "ca",
        "--publish",
      ];
      jest.spyOn(imageBuilder, "buildImages").mockResolvedValue({
        images: [],
        pushed: ["ghcr.io/decaf-ts/fabric-weaver/ca-base:1.2.3"],
      });
      const command = new WeaverImagesCommand();
      const log = (command as unknown as { log: Logger }).log;
      const infoSpy = jest
        .spyOn(log, "info")
        .mockImplementation(() => undefined);
      await command.execute();
      expect(
        infoSpy.mock.calls.map((call) => String(call[0])).join("\n")
      ).toContain("Pushed 1 image reference(s)");
    });
  });
});
