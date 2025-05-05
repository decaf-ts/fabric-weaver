import { BuildScriptsCustom } from "../utils/build-scripts";

new BuildScriptsCustom()
  .buildCommands()
  .then(() => console.log("Build completed successfully" as const));
