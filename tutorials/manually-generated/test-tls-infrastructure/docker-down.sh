
docker compose -f docker-compose-infrastructure.yaml down --rmi local -v

cd org-1
docker compose -f docker-compose-org1.yaml down --rmi local -v

cd ..

cd org-2
docker compose -f docker-compose-org2.yaml down --rmi local -v

cd ..
