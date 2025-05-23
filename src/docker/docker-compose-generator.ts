import {
  WeaverConfig,
  WeaverGlobalConfig,
  WeaverOrgConfig,
} from "../core/interfaces";
import { writeFileYaml } from "../utils/yaml";
import { DockerRestartPolicy } from "./constants";
import { DockerCompose, DockerService } from "./types";
import fs from "fs";
import path from "path";

export function generateDockerComposeFile(config: WeaverConfig) {
  console.log(config);

  // Create Docker Compose JSON structure
  const dockerCompose: DockerCompose = {
    services: {},
  };

  //Create organization CA's
  for (const org of config.orgs) {
    const caService = createCAService(config.global, org.organization);
    Object.assign(dockerCompose.services, caService);
  }

  console.log(dockerCompose);

  // Generate Docker Compose YAML file
  const basePath = path.join(process.cwd(), "output");

  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

  writeFileYaml(
    path.join(process.cwd(), "output", "docker-compose.yaml"),
    dockerCompose
  );
}

export function createCAService(cfg: WeaverGlobalConfig, org: WeaverOrgConfig) {
  return createBaseDockerService(org.name + "-ca", cfg.image);
}

export function createBaseDockerService(
  name: string,
  image: string
): DockerService {
  const service: DockerService = {
    [name]: {
      container_name: name,
      hostname: name,
      restart: DockerRestartPolicy.UNLESS_STOPPED,
      image: image,
      command: "tail -f /dev/null",
    },
  };

  return service;
}
