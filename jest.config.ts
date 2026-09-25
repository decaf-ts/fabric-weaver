import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  rootDir: __dirname,
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.tests.json" }],
  },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: false,
  coverageDirectory: "./workdocs/reports/coverage",
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/bin/**/*"],
  reporters: ["default"],
};

export default config;
