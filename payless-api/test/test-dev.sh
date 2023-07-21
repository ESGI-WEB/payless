if [ "$NODE_ENV" = "production" ]; then
  echo "Can't run this script in production mode."
  exit 1
fi

echo "Running migration"
node migrate.js

echo "Running seed"
node seed.js

if [ $? -ne 0 ]; then
  echo "database seed failed."
  exit 1
fi

echo "Running test"
# set NODE_ENV=test
NODE_ENV=test mocha --recursive --exit