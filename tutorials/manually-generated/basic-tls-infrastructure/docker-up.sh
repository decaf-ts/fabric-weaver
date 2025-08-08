#!/bin/bash -x

get_container_id() {
  local container_name="$1"

  container_id=$(docker ps -aqf "name=$container_name")

  if [ -z "$container_id" ]; then
    echo "$container_name not found yet. Retrying..."
    sleep 5
    get_container_id "$container_name"  # Recursive call
  else
    echo "$container_id"  # Return the value
  fi
}

check_container_status() {
  local container_id="$1"
  local container_name="$2"

  status=$(docker inspect --format='{{.State.Status}}' "$container_id")
  exit_code=$(docker inspect --format='{{.State.ExitCode}}' "$container_id")

  echo "Status: $status, Exit Code: $exit_code"

  if [ "$status" == "exited" ]; then
    echo "$container_name exited."
    if [ "$exit_code" -eq 0 ]; then
      echo "$container_name completed successfully."
      return 0
    else
      echo "$container_name failed with exit code $exit_code."
      return 1
    fi
  fi

  echo "Waiting for $container_name to finish..."
  sleep 5
  check_container_status "$container_id" "$container_name"
}

set -e

echo "Compiling contract"
npx weaver -d --contract-file ../../../tests/assets/contracts/asset-transfer/index.ts --output-dir ./chaincode

## STAGE 1
echo "Starting Compose Org-1 Stage-1..."
(cd org-1 && docker compose --profile stage1 -f docker-compose-org1.yaml up -d)

container_id_org1=$(get_container_id "boot-org-1-ca")
echo "Container Org-1 ID: $container_id_org1"

echo "Starting Compose Org-2 Stage-1..."
(cd org-2 && docker compose --profile stage1 -f docker-compose-org2.yaml up -d)

container_id_org2=$(get_container_id "boot-org-2-ca")
echo "Container Org-2 ID: $container_id_org2"

echo "Waiting for boot-org-1-ca to complete successfully..."
check_container_status "$container_id_org1" "boot-org-1-ca"

echo "Waiting for boot-org-2-ca to complete successfully..."
check_container_status "$container_id_org2" "boot-org-2-ca"

echo "Starting Compose Infrastructure Stage-1..."
(docker compose --profile stage1 -f docker-compose-infrastructure.yaml up -d)

## STAGE 2
echo "Starting Compose Org-1 Stage-2..."
(cd org-1 && docker compose --profile stage2 -f docker-compose-org1.yaml up -d)

container_id_peer1=$(get_container_id "boot-org-1-peer-0")
echo "Container Org-1 ID: $container_id_peer1"

echo "Starting Compose Org-2 Stage-2..."
(cd org-2 && docker compose --profile stage2 -f docker-compose-org2.yaml up -d)

container_id_peer2=$(get_container_id "boot-org-2-peer-0")
echo "Container Org-2 ID: $container_id_peer2"

echo "Waiting for boot-org-1-ca to complete successfully..."
check_container_status "$container_id_peer1" "boot-org-1-peer-0"

echo "Waiting for boot-org-2-ca to complete successfully..."
check_container_status "$container_id_peer2" "boot-org-2-peer-0"

echo "Starting Compose Infrastructure Stage-2..."
(docker compose --profile stage2 -f docker-compose-infrastructure.yaml up -d)


## ORG-3
## STAGE 1

echo "Starting Compose Org-3 Stage-1..."
(cd org-3 && docker compose --profile stage1 -f docker-compose-org3.yaml up -d)

container_id_org3=$(get_container_id "boot-org-3-ca")
echo "Container Org-3 ID: $container_id_org3"

echo "Waiting for boot-org-3-ca to complete successfully..."
check_container_status "$container_id_org3" "boot-org-3-ca"

## STAGE 2
echo "Starting Compose Org-3 Stage-2..."
(cd org-3 && docker compose --profile stage2 -f docker-compose-org3.yaml up -d)



## TEST STAGE
echo "Starting Compose Infrastructure Stage-10..."
(docker compose --profile stage10 -f docker-compose-infrastructure.yaml up -d)