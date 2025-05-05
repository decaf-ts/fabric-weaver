import { BuildScriptsCustom } from "../utils/build-scripts";

new BuildScriptsCustom()
  .execute()
  .then(() => BuildScriptsCustom.log.info("Scripts built successfully."))
  .catch((e: unknown) => {
    BuildScriptsCustom.log.error(`Error building scripts: ${e}`);
    process.exit(1);
  });
