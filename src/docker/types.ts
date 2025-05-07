import { DockerRestartPolicy } from "./constants";

export type DockerCompose = {
  services: { [key: string]: DockerService };
};

export type DockerService = {
  [indexer: string]: DockerServiceDefinition;
};

export type DockerServiceDefinition = {
  container_name: string;
  hostname: string;
  restart: DockerRestartPolicy;
};
