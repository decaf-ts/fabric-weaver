docker compose -f docker-compose-infrastructure.yaml start

cd org-1
docker compose -f docker-compose-org1.yaml start

cd ..

cd org-2
docker compose -f docker-compose-org2.yaml start

cd ..