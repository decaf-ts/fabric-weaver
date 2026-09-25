import { WeaverImagesError } from "../../src/docker/images/errors";
import {
  getImageName,
  resolveComponents,
  resolveFinalImageTags,
  resolveImageReference,
  resolveRegistry,
  resolveRepository,
} from "../../src/docker/images/registry";
import type {
  ComponentSelection,
  ResolvedImageConfig,
} from "../../src/docker/images/types";

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

describe("registry", () => {
  describe("resolveRegistry", () => {
    it("defaults to ghcr.io/decaf-ts", () => {
      expect(resolveRegistry()).toBe("ghcr.io/decaf-ts");
    });

    it("trims and strips trailing slashes", () => {
      expect(resolveRegistry("  ghcr.io/other/  ")).toBe("ghcr.io/other");
    });

    it("strips http and https schemes", () => {
      expect(resolveRegistry("https://ghcr.io/other")).toBe("ghcr.io/other");
      expect(resolveRegistry("http://ghcr.io/other")).toBe("ghcr.io/other");
    });

    it("falls back to the default for blank values", () => {
      expect(resolveRegistry("   ")).toBe("ghcr.io/decaf-ts");
      expect(resolveRegistry("/")).toBe("ghcr.io/decaf-ts");
    });

    it.each(["<reg>", "reg>", "re$g", "re#g", "re g"])(
      "rejects the unsupported value %s",
      (value) => {
        expect(() => resolveRegistry(value)).toThrow(WeaverImagesError);
        expect(() => resolveRegistry(value)).toThrow(
          /contains unsupported characters/
        );
      }
    );
  });

  describe("resolveRepository", () => {
    it("defaults to fabric-weaver", () => {
      expect(resolveRepository()).toBe("fabric-weaver");
    });

    it("trims and strips leading and trailing slashes", () => {
      expect(resolveRepository("  /fabric/  ")).toBe("fabric");
    });

    it("falls back to the default for blank values", () => {
      expect(resolveRepository("///")).toBe("fabric-weaver");
    });

    it.each(["<repo>", "repo>", "re$po", "re#po", "re po"])(
      "rejects the unsupported value %s",
      (value) => {
        expect(() => resolveRepository(value)).toThrow(WeaverImagesError);
        expect(() => resolveRepository(value)).toThrow(
          /contains unsupported characters/
        );
      }
    );
  });

  describe("getImageName", () => {
    it("uses the base suffix for the clean variant", () => {
      expect(
        getImageName({
          registry: "ghcr.io/decaf-ts",
          repository: "fabric-weaver",
          component: "ca",
          variant: "clean",
        })
      ).toBe("ghcr.io/decaf-ts/fabric-weaver/ca-base");
    });

    it("uses the softhsm suffix for the softhsm variant", () => {
      expect(
        getImageName({
          registry: "ghcr.io/decaf-ts",
          repository: "fabric-weaver",
          component: "peer",
          variant: "softhsm",
        })
      ).toBe("ghcr.io/decaf-ts/fabric-weaver/peer-softhsm");
    });
  });

  describe("resolveFinalImageTags", () => {
    it("returns only the version tag by default", () => {
      expect(
        resolveFinalImageTags({
          imageName: "ghcr.io/decaf-ts/fabric-weaver/ca-base",
          imageVersion: "3.4.7",
        })
      ).toEqual(["3.4.7"]);
    });

    it("appends latest only when includeLatest is true", () => {
      expect(
        resolveFinalImageTags({
          imageName: "ghcr.io/decaf-ts/fabric-weaver/ca-base",
          imageVersion: "3.4.7",
          includeLatest: true,
        })
      ).toEqual(["3.4.7", "latest"]);
    });
  });

  describe("resolveComponents", () => {
    it("resolves undefined to all components", () => {
      expect(resolveComponents()).toEqual(["ca", "peer", "orderer"]);
    });

    it('resolves "all" to all components', () => {
      expect(resolveComponents("all")).toEqual(["ca", "peer", "orderer"]);
    });

    it("resolves a single component", () => {
      expect(resolveComponents("peer")).toEqual(["peer"]);
    });

    it("throws for an unsupported selection", () => {
      expect(() => resolveComponents("bogus" as ComponentSelection)).toThrow(
        WeaverImagesError
      );
      expect(() => resolveComponents("bogus" as ComponentSelection)).toThrow(
        /Unsupported component "bogus"/
      );
    });
  });

  describe("resolveImageReference", () => {
    it("builds the clean reference with the versioned tag", () => {
      const reference = resolveImageReference(makeConfig(), "ca");
      expect(reference).toEqual({
        component: "ca",
        variant: "clean",
        imageName: "ghcr.io/decaf-ts/fabric-weaver/ca-base",
        tags: ["3.4.7"],
        references: ["ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7"],
      });
    });

    it("builds the softhsm reference with versioned and latest tags", () => {
      const reference = resolveImageReference(
        makeConfig({ variant: "softhsm", includeLatest: true }),
        "orderer"
      );
      expect(reference).toEqual({
        component: "orderer",
        variant: "softhsm",
        imageName: "ghcr.io/decaf-ts/fabric-weaver/orderer-softhsm",
        tags: ["3.4.7", "latest"],
        references: [
          "ghcr.io/decaf-ts/fabric-weaver/orderer-softhsm:3.4.7",
          "ghcr.io/decaf-ts/fabric-weaver/orderer-softhsm:latest",
        ],
      });
    });
  });
});
