set e+x

docker build -t local/test .

# run the example with source code and node_modules
# mapped from the parent folder
# pass commit message and branch and sha using environment variable -e
# you can pass all other COMMIT_INFO_* if needed
# if the user wants to see debug messages, just pass the environment
# variable DEBUG as is
docker run \
  -v $PWD/../src:/app/src -v $PWD/../node_modules:/app/node_modules \
  -e COMMIT_INFO_BRANCH=develop \
  -e COMMIT_INFO_MESSAGE="This is commit message" \
  -e COMMIT_INFO_SHA=e5d9eb66474bc0b681da9240aa5a457fe17bc8f3 \
  -e DEBUG \
  local/test
