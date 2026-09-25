import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { WeaverImagesError } from "../../src/docker/images/errors";
import {
  assertValidImageVersion,
  hostPlatform,
  normalizePlatform,
  normalizeVersion,
  resolveCaVersion,
  resolveFabricVersion,
  resolveImageVersion,
  toFabricCAGitRef,
  toFabricCADockerTag,
  toFabricDockerTag,
  toFabricGitRef,
} from "../../src/docker/images/versions";

describe("versions", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "weaver-versions-"));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe("normalizeVersion", () => {
    it("trims a version and returns it", () => {
      expect(normalizeVersion("  3.4.7  ", "Image version")).toBe("3.4.7");
    });

    it("throws for an empty version", () => {
      expect(() => normalizeVersion("   ", "Image version")).toThrow(
        WeaverImagesError
      );
      expect(() => normalizeVersion("   ", "Image version")).toThrow(
        /Image version must be a non-empty version/
      );
    });
  });

  describe("resolveImageVersion", () => {
    it("prefers the explicit version over the package version", async () => {
      await fs.writeFile(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ version: "1.0.0" })
      );
      expect(resolveImageVersion({ explicit: "3.4.7", cwd: tmpDir })).toBe(
        "3.4.7"
      );
    });

    it("trims the explicit version", () => {
      expect(resolveImageVersion({ explicit: "  3.4.7  " })).toBe("3.4.7");
    });

    it("reads the default version from the cwd package.json", async () => {
      await fs.writeFile(
        path.join(tmpDir, "package.json"),
        JSON.stringify({ version: "7.7.7" })
      );
      expect(resolveImageVersion({ cwd: tmpDir })).toBe("7.7.7");
    });

    it("reads process.cwd() package.json when no cwd is given", async () => {
      const pkg = JSON.parse(
        await fs.readFile(path.join(process.cwd(), "package.json"), "utf8")
      ) as { version: string };
      expect(resolveImageVersion()).toBe(pkg.version);
    });

    it("throws for a blank explicit version", () => {
      expect(() => resolveImageVersion({ explicit: "   " })).toThrow(
        WeaverImagesError
      );
      expect(() => resolveImageVersion({ explicit: "   " })).toThrow(
        /non-empty/
      );
    });

    it("throws for an invalid explicit version", () => {
      expect(() => resolveImageVersion({ explicit: "bad tag" })).toThrow(
        /not a valid Docker tag/
      );
    });

    it('throws for an explicit "latest" version', () => {
      expect(() => resolveImageVersion({ explicit: "latest" })).toThrow(
        WeaverImagesError
      );
      expect(() => resolveImageVersion({ explicit: "latest" })).toThrow(
        /latest/
      );
    });

    it("throws an actionable error when package.json is missing", () => {
      expect(() => resolveImageVersion({ cwd: tmpDir })).toThrow(
        WeaverImagesError
      );
      expect(() => resolveImageVersion({ cwd: tmpDir })).toThrow(
        /--image-version/
      );
    });
  });

  describe("assertValidImageVersion", () => {
    it("returns a valid Docker tag", () => {
      expect(assertValidImageVersion("3.4.7")).toBe("3.4.7");
    });

    it('rejects "latest"', () => {
      expect(() => assertValidImageVersion("latest")).toThrow(/latest/);
    });

    it("rejects values outside the Docker tag pattern", () => {
      expect(() => assertValidImageVersion("3.4.7/")).toThrow(
        /not a valid Docker tag/
      );
    });
  });

  describe("toFabricGitRef", () => {
    it("prefixes versions without a leading v", () => {
      expect(toFabricGitRef("2.5.12")).toBe("v2.5.12");
    });

    it("keeps versions with a leading v", () => {
      expect(toFabricGitRef("v2.5.12")).toBe("v2.5.12");
    });
  });

  describe("toFabricDockerTag", () => {
    it("leaves versions without a leading v unchanged", () => {
      expect(toFabricDockerTag("2.5.12")).toBe("2.5.12");
    });

    it("strips a leading v", () => {
      expect(toFabricDockerTag("v2.5.12")).toBe("2.5.12");
    });
  });

  describe("toFabricCAGitRef", () => {
    it("prefixes versions without a leading v", () => {
      expect(toFabricCAGitRef("1.5.15")).toBe("v1.5.15");
    });

    it("keeps versions with a leading v", () => {
      expect(toFabricCAGitRef("v1.5.15")).toBe("v1.5.15");
    });
  });

  describe("toFabricCADockerTag", () => {
    it("leaves versions without a leading v unchanged", () => {
      expect(toFabricCADockerTag("1.5.15")).toBe("1.5.15");
    });

    it("strips a leading v", () => {
      expect(toFabricCADockerTag("v1.5.15")).toBe("1.5.15");
    });
  });

  describe("resolveFabricVersion", () => {
    it("defaults to 2.5.12", () => {
      expect(resolveFabricVersion()).toBe("2.5.12");
    });

    it("accepts an explicit override", () => {
      expect(resolveFabricVersion("2.5.16")).toBe("2.5.16");
      expect(resolveFabricVersion("v2.5.16")).toBe("v2.5.16");
    });

    it("throws for a blank explicit override", () => {
      expect(() => resolveFabricVersion("   ")).toThrow(/non-empty/);
    });

    it('rejects "latest" in any case', () => {
      expect(() => resolveFabricVersion("latest")).toThrow(WeaverImagesError);
      expect(() => resolveFabricVersion("LATEST")).toThrow(
        /must not be "latest"/
      );
    });

    it("rejects an invalid explicit override", () => {
      expect(() => resolveFabricVersion("bad tag")).toThrow(WeaverImagesError);
      expect(() => resolveFabricVersion("bad tag")).toThrow(
        /not a valid version/
      );
    });
  });

  describe("resolveCaVersion", () => {
    it("defaults to 1.5.15", () => {
      expect(resolveCaVersion()).toBe("1.5.15");
    });

    it("accepts an explicit override", () => {
      expect(resolveCaVersion("1.5.22")).toBe("1.5.22");
      expect(resolveCaVersion("v1.5.22")).toBe("v1.5.22");
    });

    it("throws for a blank explicit override", () => {
      expect(() => resolveCaVersion("   ")).toThrow(/non-empty/);
    });

    it('rejects "latest" in any case', () => {
      expect(() => resolveCaVersion("latest")).toThrow(WeaverImagesError);
      expect(() => resolveCaVersion("Latest")).toThrow(/must not be "latest"/);
    });

    it("rejects an invalid explicit override", () => {
      expect(() => resolveCaVersion("bad tag")).toThrow(WeaverImagesError);
      expect(() => resolveCaVersion("bad tag")).toThrow(/not a valid version/);
    });
  });

  describe("normalizePlatform", () => {
    it("normalizes amd64 aliases", () => {
      expect(normalizePlatform("amd64")).toBe("linux/amd64");
      expect(normalizePlatform("x64")).toBe("linux/amd64");
      expect(normalizePlatform("x86_64")).toBe("linux/amd64");
      expect(normalizePlatform("linux/amd64")).toBe("linux/amd64");
    });

    it("normalizes arm64 aliases", () => {
      expect(normalizePlatform("arm64")).toBe("linux/arm64");
      expect(normalizePlatform("aarch64")).toBe("linux/arm64");
      expect(normalizePlatform("linux/arm64")).toBe("linux/arm64");
    });

    it("trims and lowercases input", () => {
      expect(normalizePlatform("  AMD64 ")).toBe("linux/amd64");
    });

    it("returns undefined for undefined or blank input", () => {
      expect(normalizePlatform()).toBeUndefined();
      expect(normalizePlatform("   ")).toBeUndefined();
    });

    it("throws for unsupported platforms", () => {
      expect(() => normalizePlatform("linux/mips")).toThrow(WeaverImagesError);
      expect(() => normalizePlatform("linux/mips")).toThrow(
        /Unsupported platform/
      );
    });
  });

  describe("hostPlatform", () => {
    it("returns the normalized host platform", () => {
      expect(["linux/amd64", "linux/arm64"]).toContain(hostPlatform());
    });

    it("maps the arm64 architecture to linux/arm64", () => {
      const descriptor = Object.getOwnPropertyDescriptor(process, "arch");
      Object.defineProperty(process, "arch", {
        value: "arm64",
        configurable: true,
      });
      try {
        expect(hostPlatform()).toBe("linux/arm64");
      } finally {
        if (descriptor) {
          Object.defineProperty(process, "arch", descriptor);
        }
      }
    });

    it("throws for unsupported host architectures", () => {
      const descriptor = Object.getOwnPropertyDescriptor(process, "arch");
      Object.defineProperty(process, "arch", {
        value: "mips",
        configurable: true,
      });
      try {
        expect(() => hostPlatform()).toThrow(WeaverImagesError);
        expect(() => hostPlatform()).toThrow(/Unsupported host architecture/);
      } finally {
        if (descriptor) {
          Object.defineProperty(process, "arch", descriptor);
        }
      }
    });
  });

  describe("WeaverImagesError", () => {
    it("exposes undefined context fields by default", () => {
      const error = new WeaverImagesError("boom");
      expect(error.name).toBe("WeaverImagesError");
      expect(error.message).toBe("boom");
      expect(error.operation).toBeUndefined();
      expect(error.component).toBeUndefined();
      expect(error.variant).toBeUndefined();
      expect(error.command).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });
  });
});
