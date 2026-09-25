import { getPackageVersion } from "@decaf-ts/utils";
import {
  DEFAULT_CA_VERSION,
  DEFAULT_FABRIC_VERSION,
  DOCKER_TAG_PATTERN,
} from "./constants";
import { WeaverImagesError } from "./errors";
import type { ImageVersionSource } from "./types";

export function normalizeVersion(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new WeaverImagesError(`${label} must be a non-empty version`, {
      operation: "normalizeVersion",
    });
  }
  return normalized;
}

export function toFabricGitRef(version: string): string {
  const normalized = normalizeVersion(version, "Fabric version");
  return normalized.startsWith("v") ? normalized : `v${normalized}`;
}

export function toFabricDockerTag(version: string): string {
  const normalized = normalizeVersion(version, "Fabric version");
  return normalized.startsWith("v") ? normalized.slice(1) : normalized;
}

export function toFabricCAGitRef(version: string): string {
  const normalized = normalizeVersion(version, "Fabric CA version");
  return normalized.startsWith("v") ? normalized : `v${normalized}`;
}

export function toFabricCADockerTag(version: string): string {
  const normalized = normalizeVersion(version, "Fabric CA version");
  return normalized.startsWith("v") ? normalized.slice(1) : normalized;
}

export function assertValidImageVersion(version: string): string {
  const normalized = normalizeVersion(version, "Image version");
  if (normalized === "latest") {
    throw new WeaverImagesError(
      'Image version must not be "latest"; latest is not a valid deterministic image version',
      { operation: "assertValidImageVersion" }
    );
  }
  if (!DOCKER_TAG_PATTERN.test(normalized)) {
    throw new WeaverImagesError(
      `Image version "${normalized}" is not a valid Docker tag; it must match ${DOCKER_TAG_PATTERN}`,
      { operation: "assertValidImageVersion" }
    );
  }
  return normalized;
}

export function resolveImageVersion(source: ImageVersionSource = {}): string {
  if (source.explicit !== undefined) {
    const explicit = normalizeVersion(source.explicit, "Image version");
    return assertValidImageVersion(explicit);
  }
  let detected: string;
  try {
    detected = getPackageVersion(source.cwd ?? process.cwd());
  } catch (error: unknown) {
    throw new WeaverImagesError(
      "Image version could not be determined from the invoking repository package.json; pass --image-version or run from a repository whose package.json has a version",
      { operation: "resolveImageVersion", cause: error }
    );
  }
  return assertValidImageVersion(detected);
}

function assertValidUpstreamVersion(version: string, label: string): string {
  const normalized = normalizeVersion(version, label);
  if (normalized.toLowerCase() === "latest") {
    throw new WeaverImagesError(
      `${label} must not be "latest"; pass an explicit pinned version such as ${label === "Fabric version" ? DEFAULT_FABRIC_VERSION : DEFAULT_CA_VERSION}`,
      { operation: "assertValidUpstreamVersion" }
    );
  }
  const withoutPrefix = normalized.startsWith("v")
    ? normalized.slice(1)
    : normalized;
  if (!DOCKER_TAG_PATTERN.test(withoutPrefix)) {
    throw new WeaverImagesError(
      `${label} "${normalized}" is not a valid version; it must match ${DOCKER_TAG_PATTERN} (a single leading "v" is allowed)`,
      { operation: "assertValidUpstreamVersion" }
    );
  }
  return normalized;
}

export function resolveFabricVersion(value?: string): string {
  return value === undefined
    ? DEFAULT_FABRIC_VERSION
    : assertValidUpstreamVersion(value, "Fabric version");
}

export function resolveCaVersion(value?: string): string {
  return value === undefined
    ? DEFAULT_CA_VERSION
    : assertValidUpstreamVersion(value, "Fabric CA version");
}

export function normalizePlatform(value?: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  switch (normalized) {
    case "linux/amd64":
    case "amd64":
    case "x64":
    case "x86_64":
      return "linux/amd64";
    case "linux/arm64":
    case "arm64":
    case "aarch64":
      return "linux/arm64";
    default:
      throw new WeaverImagesError(
        `Unsupported platform "${value}"; supported values are linux/amd64, amd64, x64, x86_64, linux/arm64, arm64, aarch64`,
        { operation: "normalizePlatform" }
      );
  }
}

export function hostPlatform(): string {
  if (process.arch === "x64") {
    return "linux/amd64";
  }
  if (process.arch === "arm64") {
    return "linux/arm64";
  }
  throw new WeaverImagesError(
    `Unsupported host architecture "${process.arch}"; only x64 and arm64 are supported`,
    { operation: "hostPlatform" }
  );
}
