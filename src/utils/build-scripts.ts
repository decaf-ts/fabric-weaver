import { BuildScripts, readFile, writeFile } from "@decaf-ts/utils";

const Commands = ["fabric", "build-scripts-extended"];

enum Modes {
  CJS = "commonjs",
  ESM = "es2022",
}

export class BuildScriptsCustom extends BuildScripts {
  async buildCommands() {
    for (const cmd of Commands) {
      await this.bundle(Modes.CJS, true, true, `src/bin/${cmd}.ts`, cmd);
      let data = readFile(`bin/${cmd}.cjs`);
      data = "#!/usr/bin/env node\n" + data;
      writeFile(`bin/${cmd}.cjs`, data);
    }
  }
}
