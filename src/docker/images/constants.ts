import type {
  ComponentConfig,
  ComponentSelection,
  FabricComponent,
  ImageVariant,
} from "./types";

export const DEFAULT_REGISTRY = "ghcr.io/decaf-ts";
export const DEFAULT_REPOSITORY = "fabric-weaver";
export const DEFAULT_FABRIC_VERSION = "2.5.12";
export const DEFAULT_CA_VERSION = "1.5.15";
export const DEFAULT_VARIANT: ImageVariant = "clean";
export const DEFAULT_COMPONENT: ComponentSelection = "all";
export const DEFAULT_INCLUDE_LATEST = false;
export const FABRIC_COMPONENTS: FabricComponent[] = ["ca", "peer", "orderer"];
export const UPSTREAM_FABRIC_REPOSITORY =
  "https://github.com/hyperledger/fabric.git";
export const UPSTREAM_FABRIC_CA_REPOSITORY =
  "https://github.com/hyperledger/fabric-ca.git";
export const UPSTREAM_FABRIC_PEER_IMAGE = "hyperledger/fabric-peer";
export const UPSTREAM_FABRIC_ORDERER_IMAGE = "hyperledger/fabric-orderer";
export const UPSTREAM_FABRIC_CA_IMAGE = "hyperledger/fabric-ca";
export const DOCKER_TAG_PATTERN = /^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,127}$/;
export const WORKSPACE_PREFIX = "weaver-images-";
export const DOCKERFILE_PREFIX = "Dockerfile-";
export const INTERMEDIATE_SUFFIX = "pkcs11";
export const CLEAN_STAGE = "clean";
export const SOFTHSM_STAGE = "softhsm";
export const GIT_CLONE_DEPTH = 1;
export const GO_TAGS = "pkcs11";

export const COMPONENT_CONFIG: Record<FabricComponent, ComponentConfig> = {
  ca: {
    component: "ca",
    upstreamImage: UPSTREAM_FABRIC_CA_IMAGE,
    upstreamRepository: UPSTREAM_FABRIC_CA_REPOSITORY,
    versionKey: "caVersion",
  },
  peer: {
    component: "peer",
    upstreamImage: UPSTREAM_FABRIC_PEER_IMAGE,
    upstreamRepository: UPSTREAM_FABRIC_REPOSITORY,
    versionKey: "fabricVersion",
  },
  orderer: {
    component: "orderer",
    upstreamImage: UPSTREAM_FABRIC_ORDERER_IMAGE,
    upstreamRepository: UPSTREAM_FABRIC_REPOSITORY,
    versionKey: "fabricVersion",
  },
};
