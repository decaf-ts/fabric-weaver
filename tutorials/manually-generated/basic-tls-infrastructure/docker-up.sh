#!/bin/bash -x

# # Navigate and start Org 1
# (cd org-1 && docker compose -f docker-compose-org1.yaml up -d) &

# # Navigate and start Org 2
# (cd org-2 && docker compose -f docker-compose-org2.yaml up -d) &

# # Start infrastructure (in current dir)
# (docker compose -f docker-compose-infrastructure.yaml up -d) &

# # Wait for all background jobs to finish
# wait


set -e

echo "Starting Compose 1 and 2..."
(cd org-1 && docker compose -f docker-compose-org1.yaml up -d) &
(cd org-2 && docker compose -f docker-compose-org2.yaml up -d) &
# wait  # Optional: wait for both background compose calls to finish starting

# --- Wait for boot-org-1 container ---
container_id_org1=""

echo "Checking boot-org-1 container ID..."
while true; do
  container_id_org1=$(docker compose -f ./org-1/docker-compose-org1.yaml ps -q boot-org-1)
  
  if [ -z "$container_id_org1" ]; then
    echo "boot-org-1 not found yet. Retrying..."
    sleep 5
    continue
  fi

  echo "Container ID: $container_id_org1"
  break
done

# --- Wait for boot-org-2 container ---
container_id_org2=""

echo "Checking boot-org-2 container ID..."
while true; do
  container_id_org2=$(docker compose -f ./org-2/docker-compose-org2.yaml ps -q boot-org-2)

  if [ -z "$container_id_org2" ]; then
    echo "boot-org-2 not found yet. Retrying..."
    sleep 5
    continue
  fi

  echo "Container ID: $container_id_org2"
  break
done

# --- Wait for boot-org-1 to finish with exit code 0 ---
echo "Waiting for boot-org-1 to complete successfully..."
while true; do
  status=$(docker inspect --format='{{.State.Status}}' "$container_id_org1")
  exit_code=$(docker inspect --format='{{.State.ExitCode}}' "$container_id_org1")

  if [ "$status" == "exited" ]; then
    echo "boot-org-1 exited."
    if [ "$exit_code" -eq 0 ]; then
      echo "boot-org-1 completed successfully."
      break
    else
      echo "boot-org-1 failed with exit code $exit_code."
      exit 1
    fi
  fi

  echo "Waiting for boot-org-1 to finish..."
  sleep 5
done

# --- Wait for boot-org-2 to finish with exit code 0 ---
echo "Waiting for boot-org-2 to complete successfully..."
while true; do
  status=$(docker inspect --format='{{.State.Status}}' "$container_id_org2")
  exit_code=$(docker inspect --format='{{.State.ExitCode}}' "$container_id_org2")

  if [ "$status" == "exited" ]; then
    echo "boot-org-2 exited."
    if [ "$exit_code" -eq 0 ]; then
      echo "boot-org-2 completed successfully."
      break
    else
      echo "boot-org-2 failed with exit code $exit_code."
      exit 1
    fi
  fi

  echo "Waiting for boot-org-2 to finish..."
  sleep 2
done

echo "All boot containers completed successfully."

# Start Compose 3 and wait for it to finish
echo "Starting Compose 3..."
docker compose -f docker-compose-infrastructure.yaml up --abort-on-container-exit

echo completed.
