#!/usr/bin/env bash
LOCK_FILE=$1

TIMEOUT=300
WAITED=0

while [ ! -f "$LOCK_FILE" ]; do
  echo "Waiting for $LOCK_FILE to be created..."
  sleep 5
  WAITED=$((WAITED + 5))

  if [ "$WAITED" -ge "$TIMEOUT" ]; then
    echo "Timeout waiting for $LOCK_FILE"
    exit 1
  fi
done

echo "Lock file found. Proceeding."