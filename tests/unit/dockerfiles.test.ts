import {
  dockerfileFor,
  dockerfileName,
} from "../../src/docker/images/dockerfiles";

describe("dockerfiles", () => {
  describe("dockerfileFor", () => {
    it("keeps Docker build variables unexpanded", () => {
      const dockerfile = dockerfileFor("peer");
      expect(dockerfile).toContain("${SOURCE_IMAGE}");
      expect(dockerfile).toContain("${SOURCE_TAG}");
      expect(dockerfile).not.toContain("hyperledger/fabric-peer");
      expect(dockerfile).not.toContain("2.5.12");
    });

    it("declares the clean and softhsm stages", () => {
      const dockerfile = dockerfileFor("ca");
      expect(dockerfile).toContain("AS clean");
      expect(dockerfile).toContain("AS softhsm");
    });

    it("includes the component name", () => {
      expect(dockerfileFor("ca")).toContain("weaver-images ca clean");
      expect(dockerfileFor("orderer")).toContain(
        "weaver-images orderer softhsm"
      );
    });

    it("uses the source image and tag for both stages", () => {
      const dockerfile = dockerfileFor("peer");
      const fromLines = dockerfile
        .split("\n")
        .filter((line) => line.startsWith("FROM "));
      expect(fromLines).toEqual([
        "FROM ${SOURCE_IMAGE}:${SOURCE_TAG} AS clean",
        "FROM ${SOURCE_IMAGE}:${SOURCE_TAG} AS softhsm",
      ]);
    });
  });

  describe("dockerfileName", () => {
    it("prefixes the component with Dockerfile-", () => {
      expect(dockerfileName("ca")).toBe("Dockerfile-ca");
      expect(dockerfileName("peer")).toBe("Dockerfile-peer");
      expect(dockerfileName("orderer")).toBe("Dockerfile-orderer");
    });
  });
});
