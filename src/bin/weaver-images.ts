/* istanbul ignore file */
import { WeaverImagesCommand } from "../docker/images";
import type { ImageBuildResult } from "../docker/images";

new WeaverImagesCommand()
  .execute()
  .then((result) => {
    if (typeof result === "string") {
      console.log(result);
      return;
    }
    if (
      result &&
      typeof result === "object" &&
      Array.isArray((result as ImageBuildResult).images) &&
      !("plan" in result)
    ) {
      WeaverImagesCommand.log.info("Image build completed successfully");
    }
  })
  .catch((error: unknown) => {
    WeaverImagesCommand.log.error("Failed to build images", error as Error);
    process.exit(1);
  });
