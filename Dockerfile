#
# Base Docker image containing node and the fabric binaries
# This Dockefile builds the software only!
# node:22 has to many vulnerabilities so the recomendation is to use node:22-slim
FROM node:22 AS builder
LABEL builder=true

RUN echo "Entering build phase."

# The node environment:
# This is the most important one, as it affects NPM described below.
# In short NODE_ENV=production switch middlewares and dependencies to efficient code path and NPM installs only packages in dependencies.
# Packages in devDependencies and peerDependencies are ignored.
ARG NODE_ENV="development"
ENV NODE_ENV=${NODE_ENV}

ARG FABRIC_VERSION=2.5.12
ENV FABRIC_VERSION=${FABRIC_VERSION}

ARG FABRIC_CA_VERSION=1.5.15
ENV FABRIC_CA_VERSION=${FABRIC_CA_VERSION}

ENV FOLDER_NAME="fabric"

RUN echo "Building Base image under node $(node -v) and npm $(npm -v)"

RUN apt update -y && apt upgrade -y

RUN apt-get install -y jq vim

COPY package*.json ./$FOLDER_NAME/
COPY tsconfig.json ./$FOLDER_NAME/
COPY src ./$FOLDER_NAME/src
COPY bin ./$FOLDER_NAME/bin

RUN --mount=type=secret,id=TOKEN TOKEN=$(cat /run/secrets/TOKEN) cd ${FOLDER_NAME} && npm install && npm run setup -- --fabric-version ${FABRIC_VERSION} --ca-version ${FABRIC_CA_VERSION} && npm cache clean --force && chown -R node:node .

RUN find /$FOLDER_NAME/bin -type f \( -name "*.cjs" -o -name "*.sh" \) -delete

ENV FABRIC_BIN_FOLDER="/$FOLDER_NAME/bin"
ENV PATH="$PATH:$FABRIC_BIN_FOLDER"

LABEL name="Fabric Base Builder Image" description="A base node image builder for fabric images cointaining the binaries"


# -------------------------------------------------------------------------------------------------------
#
# Base Docker image containing node and the fabric binaries
# This Dockefile builds the software only!
# node:22 has to many vulnerabilities so the recomendation is to use node:22-slim
FROM node:22

RUN apt update -y && apt upgrade -y

ENV FOLDER_NAME="fabric"

COPY --chown=node:node --from=builder /$FOLDER_NAME/bin /$FOLDER_NAME/bin

ENV FABRIC_BIN_FOLDER="/$FOLDER_NAME/bin"
ENV PATH="$PATH:$FABRIC_BIN_FOLDER"

RUN echo "Runtime phase completed"
LABEL name="Fabric Base Image" description="A base node image for fabric images cointaining the binaries"
