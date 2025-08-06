import { rollup } from "rollup";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import path from "path";
import { Logging } from "@decaf-ts/logging";
import { resolvePath } from "../../utils-old/path";
import {
  ENTRY_PLACEHOLDER,
  NAME_PLACEHOLDER,
  VERSION_PLACEHOLDER,
} from "../constants/constants";

export async function compileContract(
  contractDirectory: string,
  contractName: string,
  version: string,
  tsConfigFile: string,
  destinationDirectory: string,
  sourceMaps: boolean = false
) {
  const log = Logging.for(compileContract);

  log.info(`Compiling TypeScript contract ${contractName}`);

  await rollup({
    input: `${resolvePath(contractDirectory)}/${contractName}.ts`,
    plugins: [
      replace({
        preventAssignment: true,
        delimiters: ["", ""],
        values: { VERSION_PLACEHOLDER: version },
      }),
      typescript({
        tsconfig: tsConfigFile,
        compilerOptions: {
          declaration: false,
          module: "esnext",
          outDir: "",
        },
      }),
    ],
  }).then((bundle) =>
    bundle.write({
      file: `${resolvePath(destinationDirectory)}/${contractName}.js`,
      format: "umd",
      name: contractName,
      sourcemap: sourceMaps,
    })
  );
}

export async function addPackage(
  contractName: string,
  version: string,
  destinationDirectory: string
) {
  const log = Logging.for(addPackage);
  const inputFiles = ["package.json", "package-lock.json"];

  fs.mkdirSync(resolvePath(destinationDirectory), { recursive: true });

  for (const file of inputFiles) {
    const inputPath = path.join(__dirname, "../..", "assets", file);

    if (!fs.existsSync(inputPath)) {
      log.info(`File not found: ${inputPath}`);
      continue;
    }

    const content = fs.readFileSync(inputPath, "utf-8");

    const replacedContent = content
      .replaceAll(new RegExp(VERSION_PLACEHOLDER, "g"), version.toString())
      .replaceAll(new RegExp(NAME_PLACEHOLDER, "g"), contractName.toLowerCase())
      .replaceAll(
        new RegExp(ENTRY_PLACEHOLDER, "g"),
        `${contractName.toLowerCase()}.js`
      );

    fs.writeFileSync(
      path.join(resolvePath(destinationDirectory), file),
      replacedContent,
      "utf-8"
    );

    log.info(
      `Add ${file} to ${destinationDirectory} for contract ${contractName}`
    );
  }
}
