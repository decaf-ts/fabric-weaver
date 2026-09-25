import {
  DEFAULT_REGISTRY,
  DEFAULT_REPOSITORY,
  FABRIC_COMPONENTS,
} from "./constants";
import { WeaverImagesError } from "./errors";
import type {
  ComponentSelection,
  FabricComponent,
  ImageReference,
  ImageVariant,
  ResolvedImageConfig,
} from "./types";

const INVALID_REFERENCE_CHARACTERS = /[<>$#\s]/;

function assertValidReference(
  value: string,
  option: string,
  operation: "resolveRegistry" | "resolveRepository"
): string {
  if (INVALID_REFERENCE_CHARACTERS.test(value)) {
    throw new WeaverImagesError(
      `--${option} value "${value}" contains unsupported characters; use a plain value without spaces, <, >, $, or #`,
      { operation }
    );
  }
  return value;
}

export function resolveRegistry(value?: string): string {
  if (value === undefined) {
    return DEFAULT_REGISTRY;
  }
  let registry = value.trim().replace(/^https?:\/\//, "");
  while (registry.endsWith("/")) {
    registry = registry.slice(0, -1);
  }
  return assertValidReference(
    registry || DEFAULT_REGISTRY,
    "registry",
    "resolveRegistry"
  );
}

export function resolveRepository(value?: string): string {
  if (value === undefined) {
    return DEFAULT_REPOSITORY;
  }
  const repository = value.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  return assertValidReference(
    repository || DEFAULT_REPOSITORY,
    "repository",
    "resolveRepository"
  );
}

export function getImageName(input: {
  registry: string;
  repository: string;
  component: FabricComponent;
  variant: ImageVariant;
}): string {
  const suffix = input.variant === "clean" ? "base" : "softhsm";
  return `${input.registry}/${input.repository}/${input.component}-${suffix}`;
}

export function resolveFinalImageTags(input: {
  imageName: string;
  imageVersion: string;
  includeLatest?: boolean;
}): string[] {
  const tags = [input.imageVersion];
  if (input.includeLatest === true) {
    tags.push("latest");
  }
  return tags;
}

export function resolveComponents(
  selection?: ComponentSelection
): FabricComponent[] {
  if (selection === undefined || selection === "all") {
    return [...FABRIC_COMPONENTS];
  }
  if (FABRIC_COMPONENTS.includes(selection as FabricComponent)) {
    return [selection as FabricComponent];
  }
  throw new WeaverImagesError(
    `Unsupported component "${String(selection)}"; expected one of ca, peer, orderer, all`,
    { operation: "resolveComponents", component: String(selection) }
  );
}

export function resolveImageReference(
  config: ResolvedImageConfig,
  component: FabricComponent
): ImageReference {
  const imageName = getImageName({
    registry: config.registry,
    repository: config.repository,
    component,
    variant: config.variant,
  });
  const tags = resolveFinalImageTags({
    imageName,
    imageVersion: config.imageVersion,
    includeLatest: config.includeLatest,
  });
  const references = tags.map((tag) => `${imageName}:${tag}`);
  return {
    component,
    variant: config.variant,
    imageName,
    tags,
    references,
  };
}
