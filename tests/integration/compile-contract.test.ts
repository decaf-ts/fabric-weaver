import { execSync } from "child_process";
import { FabricCAClientConfigBuilder } from "../../src";
import path from "path";
// Model.setBuilder(Model.fromModel);

jest.setTimeout(50000);

describe.skip("Test test model contract", () => {
  beforeAll(async () => {
    // compile contract
    execSync(`weaver compile-contract -d --contract-path ./tests/assets/contracts/base-contract \
            --contract-filename contract \
            --contract-version 1.0.0 \
            --tsconfig tsconfig.json \
            --output-path ./tests/assets/contracts/compiled`);
  });

  it("should validate a TestModel instance", () => {
    console.log("Test model contract");
    console.log("Validate a TestModel instance");
  });

  it("tests", async () => {
    const builder = new FabricCAClientConfigBuilder();

    builder
      .setCustom("bccsp", {
        default: "PKCS11",
        pkcs11: {
          Library: "/usr/lib/softhsm/libsofthsm2.so",
          Pin: 1213213,
          Label: "lasdasdasd",
          hash: "SHA2",
          security: 256,
          Immutable: false,
        },
      })
      .save(path.join(__dirname));
  });
});
