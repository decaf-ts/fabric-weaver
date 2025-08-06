import { execSync } from "child_process";

// Model.setBuilder(Model.fromModel);

jest.setTimeout(50000);

describe("Test test model contract", () => {
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
});
