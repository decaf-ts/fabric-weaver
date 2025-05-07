/**
 * @enum {string}
 * @description Enum representing the restart policies available in Docker Compose.
 * @readonly
 * @memberOf module:docker
 */
export enum DockerRestartPolicy {
  /** Restart the container unless it is explicitly stopped or Docker itself is stopped or restarted */
  UNLESS_STOPPED = "unless-stopped",
  /** Do not automatically restart the container */
  NO = "no",
  /** Always restart the container if it stops */
  ALWAYS = "always",
  /** Restart the container if it exits due to an error */
  ON_FAILURE = "on-failure",
}
