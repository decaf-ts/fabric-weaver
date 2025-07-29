
docker compose --profile stage10 -f docker-compose-infrastructure.yaml down --rmi local -v
 
docker compose --profile stage2 -f docker-compose-infrastructure.yaml down --rmi local -v 
(cd org-1 && docker compose --profile stage2 -f docker-compose-org1.yaml down --rmi local -v) 
(cd org-2 && docker compose --profile stage2 -f docker-compose-org2.yaml down --rmi local -v) 
(cd org-3 && docker compose --profile stage2 -f docker-compose-org3.yaml down --rmi local -v) 

docker compose --profile stage1 -f docker-compose-infrastructure.yaml down --rmi local -v 
(cd org-1 && docker compose --profile stage1 -f docker-compose-org1.yaml down --rmi local -v) 
(cd org-2 && docker compose --profile stage1 -f docker-compose-org2.yaml down --rmi local -v) 
(cd org-3 && docker compose --profile stage1 -f docker-compose-org3.yaml down --rmi local -v) 

PATTERN="simple_1.0"

# Find matching containers (all states: running or exited)
CONTAINER_IDS=$(docker ps -a --filter "name=$PATTERN" --format "{{.ID}}")

if [ -z "$CONTAINER_IDS" ]; then
  echo "No containers found with name containing '$PATTERN'"
  exit 0
fi

# Remove each matching container
echo "Removing containers matching '$PATTERN'..."
for ID in $CONTAINER_IDS; do
  echo "Removing container $ID..."
  docker rm -f "$ID"
done

echo "Done."