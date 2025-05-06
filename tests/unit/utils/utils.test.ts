import { BuildScriptsCustom } from "../../../src";
import { BuildScripts } from "@decaf-ts/utils";

describe("Utils namespace test", () => {
  it("BuildScriptsCustom extends BuildScripts", async () => {
    const proto = BuildScriptsCustom.prototype;
    const instance = BuildScripts;
    expect(proto).toBeInstanceOf(instance);
  });
});
