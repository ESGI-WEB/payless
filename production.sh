# Pull repository
git pull

# create networks if they doesn't exist
docker network create fake-psp
docker network create payless-network

# launch dockers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# launch migrations
docker exec payless_api_1 node migrate.js

# launch nginx for frontend
docker build -t nicolaswadoux/payless-backoffice ./payless-backoffice
docker stop payless-backoffice-prod
docker rm payless-backoffice-prod
docker run --name payless-backoffice-prod -d -p 80:80 nicolaswadoux/payless-backoffice


