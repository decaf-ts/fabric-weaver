docker compose -f docker-compose-infrastructure.yaml stop

cd org-1
docker compose -f docker-compose-org1.yaml stop

cd ..

cd org-2
docker compose -f docker-compose-org2.yaml stop

cd ..