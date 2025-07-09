#!/usr/bin/env bash
container_name=$1
container_id=""
echo "Checking $container_name container id..."


while true; do
  container_id=$(docker ps -aqf "name=$container_name")
  
  if [ -z "$container_id" ]; then
    echo "$container_name not found yet. Retrying..."
    sleep 5
    continue
  fi

  echo "Container ID: $container_id"
  break
done

echo "Waiting for $container_name to complete successfully..."
while true; do
  status=$(docker inspect --format='{{.State.Status}}' "$container_id")
  exit_code=$(docker inspect --format='{{.State.ExitCode}}' "$container_id")

  if [ "$status" == "exited" ]; then
    echo "$container_name exited."
    if [ "$exit_code" -eq 0 ]; then
      echo "$container_name completed successfully."
      break
    else
      echo "$container_name failed with exit code $exit_code."
      exit 1
    fi
  fi

  echo "Waiting for $container_name to finish..."
  sleep 5
done

echo "Container $container_name as runned successfully."