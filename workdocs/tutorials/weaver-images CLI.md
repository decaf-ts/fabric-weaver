## Using the `weaver-images` CLI

`weaver-images` builds and optionally publishes the Docker base images that
Weaver-based projects use for Hyperledger Fabric and Fabric CA.

It supports two variants:

- **clean** - derived from the official Hyperledger Fabric/CA images. Fast, no
  compilation.
- **softhsm** - derived from PKCS#11-enabled Fabric/CA binaries compiled from
  source and layered with the SoftHSM2 runtime. Requires a host Go toolchain.

Each variant is produced for the `ca`, `peer`, and `orderer` components, or `all`
of them at once.

### Requirements

- Node.js >= 20
- Docker with a running daemon
- `git` on `PATH`
- Go >= 1.21 on `PATH` for `--variant softhsm` (used to build PKCS#11 binaries)
- An authenticated Docker session for the target registry when using `--publish`
  (the CLI does not run `docker login` for you)

`--dry-run` needs none of Docker, git, Go, or network access: it only resolves
the configuration and prints the plan.

### Installation

As a project dependency:

```bash
npm install --save-dev @decaf-ts/fabric-weaver
npx weaver-images --help
```

From a checkout of this repository:

```bash
npm install
npm run build
node lib/cjs/bin/weaver-images.cjs --help
```

### Command reference

```text
weaver-images [build] [options]
```

The word `build` is optional; `weaver-images --dry-run` and
`weaver-images build --dry-run` are equivalent.

| Option                      | Default                              | Description                                                               |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| `-t, --variant <variant>`   | `clean`                              | Image variant: `clean` or `softhsm`                                       |
| `-c, --component <name>`    | `all`                                | Component to build: `ca`, `peer`, `orderer`, or `all`                     |
| `--image-version <version>` | invoking repo `package.json` version | Tag applied to the generated images                                       |
| `--fabric-version <ver>`    | `2.5.12`                             | Fabric version to build from (git ref `v<ver>`)                           |
| `--ca-version <ver>`        | `1.5.15`                             | Fabric CA version to build from (git ref `v<ver>`)                        |
| `--registry <registry>`     | `ghcr.io/decaf-ts`                   | Registry namespace                                                        |
| `--repository <repo>`       | `fabric-weaver`                      | Repository path under the registry                                        |
| `--platform <platform>`     | host platform                        | Target platform for the final Docker build (`linux/amd64`, `linux/arm64`) |
| `--publish`                 | `false`                              | Push the built images to the registry                                     |
| `--pull`                    | `false`                              | Pull upstream base images before building                                 |
| `--no-cache`                | `false`                              | Disable the Docker build cache                                            |
| `--dry-run`                 | `false`                              | Resolve and print the plan without building                               |
| `--keep-workdir`            | `false`                              | Keep the temporary workspace after the build                              |
| `--latest`                  | `false`                              | Also tag the built images as `latest`                                     |
| `-v, --version`             |                                      | Print the CLI version and exit                                            |
| `-h, --help`                |                                      | Print help and exit                                                       |

### Version model

Four versions are kept separate:

| Version         | Flag               | Source                                                               |
| --------------- | ------------------ | -------------------------------------------------------------------- |
| CLI/package     | `--version`        | the installed `@decaf-ts/fabric-weaver` package version              |
| Image           | `--image-version`  | explicit flag, else the invoking repository's `package.json` version |
| Fabric upstream | `--fabric-version` | default `2.5.12`; must be a pinned version, never `latest`           |
| Fabric CA       | `--ca-version`     | default `1.5.15`; must be a pinned version, never `latest`           |

`--image-version` controls only the final image tag. It never falls back to
`latest`, and the upstream Fabric/CA versions never become image tags. Explicit
values may carry a leading `v` for the Fabric/CA flags; the `v` is used for git
refs and stripped for Docker tags.

### Image naming and tagging

| Variant   | Image name                                                    |
| --------- | ------------------------------------------------------------- |
| `clean`   | `<registry>/<repository>/<component>-base:<image-version>`    |
| `softhsm` | `<registry>/<repository>/<component>-softhsm:<image-version>` |

The versioned tag is always applied. `--latest` adds `latest` as an additional
alias; it never replaces the versioned tag. Both tags are applied in a single
`docker build`, so enabling `--latest` does not rebuild the image.

With the defaults:

```text
ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7
ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7
ghcr.io/decaf-ts/fabric-weaver/orderer-base:3.4.7
```

### Examples

Log lines are shown without their timestamp/logger prefix. Startup also prints
the decaf-ts banner; it is omitted here.

#### Show the CLI version

```bash
weaver-images --version
```

Expected output:

```text
0.0.33
```

This is the Weaver package version, not the image version.

#### Preview a clean build

```bash
weaver-images --dry-run --image-version 3.4.7
```

Expected output (no workspace is created, no Docker/git/Go is invoked):

```text
[docker-build] Build clean ca image from hyperledger/fabric-ca:1.5.15 as ghcr.io/decaf-ts/fabric-weaver/ca-base
docker build --file '<workspace>/Dockerfile-ca' --target clean --build-arg SOURCE_IMAGE=hyperledger/fabric-ca --build-arg SOURCE_TAG=1.5.15 -t ghcr.io/decaf-ts/fabric-weaver/ca-base:3.4.7 '<workspace>'
[docker-build] Build clean peer image from hyperledger/fabric-peer:2.5.12 as ghcr.io/decaf-ts/fabric-weaver/peer-base
docker build --file '<workspace>/Dockerfile-peer' --target clean --build-arg SOURCE_IMAGE=hyperledger/fabric-peer --build-arg SOURCE_TAG=2.5.12 -t ghcr.io/decaf-ts/fabric-weaver/peer-base:3.4.7 '<workspace>'
[docker-build] Build clean orderer image from hyperledger/fabric-orderer:2.5.12 as ghcr.io/decaf-ts/fabric-weaver/orderer-base
docker build --file '<workspace>/Dockerfile-orderer' --target clean --build-arg SOURCE_IMAGE=hyperledger/fabric-orderer --build-arg SOURCE_TAG=2.5.12 -t ghcr.io/decaf-ts/fabric-weaver/orderer-base:3.4.7 '<workspace>'
```

`<workspace>` is a placeholder for the temporary workspace directory that a
real run would use.

#### Preview a SoftHSM build

```bash
weaver-images build --variant softhsm --component peer \
  --image-version 3.4.7 --fabric-version 2.5.16 --dry-run
```

Expected output:

```text
[git-clone] Clone fabric 2.5.16 into <workspace>/fabric
git clone --depth 1 --branch v2.5.16 https://github.com/hyperledger/fabric.git '<workspace>/fabric'
[make] Build PKCS#11 peer from fabric 2.5.16
make peer-docker GO_TAGS=pkcs11 DOCKER_NS=ghcr.io/decaf-ts/fabric-weaver/pkcs11
[docker-tag] Tag peer pkcs11 intermediate ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11:2.5.16 from ghcr.io/decaf-ts/fabric-weaver/pkcs11/fabric-peer:latest
docker tag ghcr.io/decaf-ts/fabric-weaver/pkcs11/fabric-peer:latest ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11:2.5.16
[docker-build] Build softhsm peer image from ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11:2.5.16 as ghcr.io/decaf-ts/fabric-weaver/peer-softhsm
docker build --file '<workspace>/Dockerfile-peer' --target softhsm --build-arg SOURCE_IMAGE=ghcr.io/decaf-ts/fabric-weaver/pkcs11/peer-pkcs11 --build-arg SOURCE_TAG=2.5.16 -t ghcr.io/decaf-ts/fabric-weaver/peer-softhsm:3.4.7 '<workspace>'
```

The `make` steps receive `DOCKER_DEFAULT_PLATFORM` when `--platform` is set and
`DOCKER_BUILD_FLAGS` when `--pull`/`--no-cache` are set, through their
environment; these are not part of the printed plan.

#### Build clean images

```bash
weaver-images --image-version 3.4.7
```

Expected outcome:

- Logs each build and finishes with:

  ```text
  Built 3 image(s)
  Image build completed successfully
  ```

- `docker images` shows three new local images:
  `ca-base:3.4.7`, `peer-base:3.4.7`, `orderer-base:3.4.7`.
- Nothing is pushed.
- Exit code `0`.

#### Build and publish clean images with the `latest` alias

```bash
weaver-images --image-version 3.4.7 --publish --latest
```

Expected outcome:

- One build per component, each carrying both tags, e.g.
  `-t .../peer-base:3.4.7 -t .../peer-base:latest`.
- Six push commands (two tags for each of the three components), ending with:

  ```text
  Built 3 image(s)
  Pushed 6 image reference(s)
  Image build completed successfully
  ```

- The `latest` alias is never pushed without `--latest`.

#### Build SoftHSM images

```bash
weaver-images build --variant softhsm --image-version 3.4.7 \
  --fabric-version 2.5.16 --ca-version 1.5.22 --publish
```

Expected outcome:

1. Clones `hyperledger/fabric-ca` at `v1.5.22` and builds the CA PKCS#11
   binary, then tags the result as
   `<registry>/<repository>/pkcs11/ca-pkcs11:1.5.22`.
2. Builds the final `ca-softhsm:3.4.7` image from that intermediate.
3. Clones `hyperledger/fabric` at `v2.5.16` and builds the peer/orderer
   PKCS#11 binaries in one `make` invocation, tagging the results as
   `<registry>/<repository>/pkcs11/{peer,orderer}-pkcs11:2.5.16`.
4. Builds the final `peer-softhsm:3.4.7` and `orderer-softhsm:3.4.7` images.
5. Pushes the three final images (not the `pkcs11/*` intermediates) and logs
   `Built 3 image(s)` and `Pushed 3 image reference(s)`.

Fabric is cloned at most once per invocation, and Fabric CA at most once per
invocation, regardless of how many components are built.

#### Use a custom registry and repository

```bash
weaver-images --component peer --image-version 3.4.7 \
  --registry example.test --repository project/images --publish
```

Expected outcome:

- Builds and pushes `example.test/project/images/peer-base:3.4.7`.
- With `--latest`, also pushes `example.test/project/images/peer-base:latest`.

#### Keep the temporary workspace

```bash
weaver-images --variant softhsm --image-version 3.4.7 --keep-workdir
```

Expected outcome: the workspace directory (a `weaver-images-*` directory under
the system temp directory) is kept after the run, and its path is available as
`workdir` in the returned result when using the programmatic API. Without
`--keep-workdir`, the workspace is removed on success and on failure.

### What a real run does

1. Resolves the image configuration (versions, registry, components, platform).
2. Creates an isolated temporary workspace (`weaver-images-*` under the OS temp
   directory); the caller's repository is never modified.
3. For each component, writes the matching Dockerfile into the workspace and runs
   the variant's steps.
4. If `--publish` is set, pushes only the final images.
5. Cleans up the workspace unless `--keep-workdir` is set.

### Using the generated images

Consumers should reference the generated images by explicit version:

```Dockerfile
ARG IMAGE_VERSION

FROM ghcr.io/decaf-ts/fabric-weaver/peer-base:${IMAGE_VERSION} AS clean
FROM ghcr.io/decaf-ts/fabric-weaver/peer-softhsm:${IMAGE_VERSION} AS softhsm
```

The same pattern applies to `ca` and `orderer`. Existing consumers that use
`ARG IMAGE_VERSION=latest` must migrate to an explicit version: the CLI never
produces an implicit `latest` tag, and `latest` is rejected as a version value.
CI pipelines that still need the `latest` alias should pass `--latest`.

### Troubleshooting

| Symptom                                                                           | Cause                                                                      | Fix                                                           |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `Unsupported component "bogus"; expected one of ca, peer, orderer, all`           | invalid `--component`                                                      | use one of `ca`, `peer`, `orderer`, `all`                     |
| `Image version must not be "latest"`                                              | `--image-version latest`                                                   | pass an explicit version such as `3.4.7`                      |
| `Image version could not be determined from the invoking repository package.json` | no `--image-version` and no usable `package.json` in the current directory | pass `--image-version` or run from a package with a `version` |
| `--registry value "..." contains unsupported characters`                          | spaces, `<`, `>`, `$`, or `#` in `--registry`/`--repository`               | use a plain registry/repository value                         |
| `Go is required to build PKCS#11 Fabric images`                                   | `--variant softhsm` without Go on `PATH`                                   | install Go and ensure it is on `PATH`                         |
| `fabric-ca requires a newer host Go toolchain (Go >= 1.21)`                       | host Go older than 1.21 for `--variant softhsm`                            | upgrade Go                                                    |
| `Host Go toolchain architecture "linux/..." does not match ...`                   | `--platform` differs from the host Go `GOARCH`                             | omit `--platform` or install a matching Go toolchain          |
| `Cross-platform PKCS#11 builds are not supported`                                 | `--variant softhsm` with a `--platform` different from the host            | run on the target architecture or use `--variant clean`       |
| Push fails                                                                        | no authenticated Docker session for the target registry                    | run `docker login <registry>` before `--publish`              |

### Exit codes

| Code | Meaning                                                        |
| ---- | -------------------------------------------------------------- |
| `0`  | success, `--help`, or `--version`                              |
| `1`  | any build/resolution/publish error (the error is logged first) |
