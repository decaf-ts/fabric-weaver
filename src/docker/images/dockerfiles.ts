import { DOCKERFILE_PREFIX } from "./constants";
import type { FabricComponent } from "./types";

export function dockerfileFor(component: FabricComponent): string {
  return `ARG SOURCE_IMAGE
ARG SOURCE_TAG
FROM \${SOURCE_IMAGE}:\${SOURCE_TAG} AS clean
LABEL org.opencontainers.image.title="weaver-images ${component} clean"

FROM \${SOURCE_IMAGE}:\${SOURCE_TAG} AS softhsm
USER root
RUN apt-get update \\
 && apt-get install -y --no-install-recommends softhsm2 opensc curl ca-certificates \\
 && rm -rf /var/lib/apt/lists/*
LABEL org.opencontainers.image.title="weaver-images ${component} softhsm"
`;
}

export function dockerfileName(component: FabricComponent): string {
  return `${DOCKERFILE_PREFIX}${component}`;
}
