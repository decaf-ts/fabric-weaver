cd org-1
docker compose -f docker-compose-org1.yaml up -d 

cd ..

cd org-2
docker compose -f docker-compose-org2.yaml up -d   

cd ..