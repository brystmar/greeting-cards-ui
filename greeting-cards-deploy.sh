#!/usr/bin/env bash
set -e  # Exit on first error

# Load the ENV file
export $(grep -v '^#' .greeting-cards.env | xargs)
echo ">>> Loaded the ENVs."

# Generate the dynamic version tag: YYYYMMDD_HHMM
VERSION_TAG=$(date +%Y%m%d_%H%M)
echo ">>> Using version tag: $VERSION_TAG"

# Build backend image
docker build --no-cache -t $DOCKERHUB_USER/$BACKEND_IMAGE_NAME:$VERSION_TAG ./greeting-cards --platform linux/amd64
echo ">>> Built the backend image."
echo ""

# Ensure UI lockfile is compatible with the Docker build environment (Node 20 + npm 10.x)
# --package-lock-only: rewrite the lockfile without touching node_modules, which is the
# host's (macOS) install. A full npm install here would fill it with Linux binaries.
# -v /app/node_modules: hide the host's node_modules from npm. Otherwise npm rebuilds the
# lockfile from that Mac-only install and drops the Linux rollup binary the image needs.
echo ">>> Syncing UI package-lock.json using node:20-slim (prevents npm ci lockfile mismatch)..."
docker run --rm -it \
  -v "$PWD/greeting-cards-ui":/app -v /app/node_modules -w /app \
  node:20-slim bash -lc "rm -f package-lock.json && npm install --package-lock-only"
echo ">>> UI lockfile synced."

# Build UI image
docker build --no-cache -t $DOCKERHUB_USER/$UI_IMAGE_NAME:$VERSION_TAG ./greeting-cards-ui --platform linux/amd64
echo ">>> Built the UI image."
echo ""

# Push to Docker Hub
docker push $DOCKERHUB_USER/$BACKEND_IMAGE_NAME:$VERSION_TAG
docker push $DOCKERHUB_USER/$UI_IMAGE_NAME:$VERSION_TAG
echo ">>> Push to Docker Hub complete."

### Update Portainer ENVs and redeploy the stack ###
# Retrieve and modify the stack ENVs
GREETING_CARDS_STACK_JSON=$(curl -sk -H "X-API-Key: $PORTAINER_API_KEY" "$PORTAINER_URL/api/stacks/$PORTAINER_STACK_ID?endpointId=$PORTAINER_ENDPOINT_ID")
# echo ">>> Retrieved the stack JSON."

# Extract the docker compose text
STACK_FILE_CONTENT=$(curl -sk \
  -H "X-API-Key: $PORTAINER_API_KEY" \
  "$PORTAINER_URL/api/stacks/$PORTAINER_STACK_ID/file" \
  | jq -r '.StackFileContent')

# echo ">>> Stored just the compose text in STACK_FILE_CONTENT:"

# Update the ENVs to use the new version tag
UPDATED_ENVS=$(echo "$GREETING_CARDS_STACK_JSON" \
  | jq --arg VERSION_TAG "$VERSION_TAG" \
       --arg USE_PROD_DATABASE "$USE_PROD_DATABASE" \
        '.Env = (.Env | map(if .name == "VERSION_TAG" then .value = $VERSION_TAG else . end))')

echo ">>> Updated the stack's version tag ENV."

# Define the request body for updaing the ENVs
REQUEST_BODY=$(echo "$UPDATED_ENVS" | jq --arg STACK_FILE_CONTENT "$STACK_FILE_CONTENT" '{ StackFileContent: $STACK_FILE_CONTENT, Env: .Env, Prune: false }')
# echo ">>> Created the request body."

# Send the updated ENVs back to Portainer, which should also redeploy the stack.
# Don't print the response: it echoes every stack ENV, including passwords and secret keys.
PORTAINER_RESPONSE=$(curl -sk -w "\n%{http_code}" -X PUT \
  -H "X-API-Key: $PORTAINER_API_KEY" \
  -H "Content-Type: application/json" \
  --data "$REQUEST_BODY" \
  "$PORTAINER_URL/api/stacks/$PORTAINER_STACK_ID?endpointId=$PORTAINER_ENDPOINT_ID")
PORTAINER_STATUS=$(echo "$PORTAINER_RESPONSE" | tail -n1)

if [[ "$PORTAINER_STATUS" != 2* ]]; then
    # Error bodies only carry a message, never the stack ENVs, so they're safe to show
    echo "!!! Portainer stack update failed (HTTP $PORTAINER_STATUS):"
    echo "$PORTAINER_RESPONSE" | sed '$d' | jq -r '.message // .details // .' 2>/dev/null
    exit 1
fi
echo "*** ENVs updated in Portainer (HTTP $PORTAINER_STATUS), which should redeploy the stack ***"

# Re-deploy the stack
# curl -sk -X POST -H "X-API-Key: $PORTAINER_API_KEY" "$PORTAINER_URL/api/stacks/$PORTAINER_STACK_ID/redeploy?endpointId=$PORTAINER_ENDPOINT_ID"
# echo ">>> Deployment complete! Images pushed and stack redeployed."

# Update VERSION_TAG in .greeting-cards.env with the newest value
# Use sed to replace the existing VERSION_TAG entry (works on macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires an empty string after -i
    sed -i '' "s/^VERSION_TAG=.*/VERSION_TAG=\"$VERSION_TAG\"/" .greeting-cards.env
    echo ">>> Updated .greeting-cards.env with VERSION_TAG=$VERSION_TAG"
else
    sed -i "s/^VERSION_TAG=.*/VERSION_TAG=\"$VERSION_TAG\"/" .greeting-cards.env
    echo ">>> Updated .greeting-cards.env with VERSION_TAG=$VERSION_TAG"
fi


### CLEANUP ###
echo ">>> Cleaning up unused images on Portainer host..."
curl -sk -X POST \
  -H "X-API-Key: $PORTAINER_API_KEY" \
  "$PORTAINER_URL/api/endpoints/$PORTAINER_ENDPOINT_ID/docker/images/prune?all=1"
echo ">>> Images purged."

# Define a function to purge old Docker Hub tags
cleanup_dockerhub_tags() {
  REPO="$1"    # e.g. "brystmar/cards-backend"
  KEEP=20      # how many recent tags to keep

  echo ">>> Cleaning up old tags for $REPO (keeping the most recent $KEEP)..."

  TAGS=$(curl -s "https://hub.docker.com/v2/repositories/$REPO/tags/?page_size=100" \
        | jq -r '.results | sort_by(.last_updated) | .[:-'"$KEEP"'] | .[].name')

  for TAG in $TAGS; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
      -H "Authorization: Bearer $DOCKERHUB_ACCESS_TOKEN" \
      "https://hub.docker.com/v2/repositories/$REPO/tags/$TAG/")
    echo "Deleting tag $TAG: HTTP $STATUS"
  done
}

# DOCKERHUB_TOKEN is a personal access token (dckr_pat_..., needs Read, Write & Delete scope).
# Exchange it for a short-lived access token on every run, so nothing stored can go stale.
DOCKERHUB_ACCESS_TOKEN=""
if [[ -n "$DOCKERHUB_TOKEN" ]]; then
  DOCKERHUB_ACCESS_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
    -d "$(jq -n --arg id "$DOCKERHUB_USER" --arg secret "$DOCKERHUB_TOKEN" '{identifier: $id, secret: $secret}')" \
    "https://hub.docker.com/v2/auth/token" | jq -r '.access_token // empty')
fi

if [[ -n "$DOCKERHUB_ACCESS_TOKEN" ]]; then
  cleanup_dockerhub_tags "$DOCKERHUB_USER/$BACKEND_IMAGE_NAME"
  cleanup_dockerhub_tags "$DOCKERHUB_USER/$UI_IMAGE_NAME"
else
  echo ">>> Skipping Docker Hub tag cleanup: set DOCKERHUB_TOKEN in .greeting-cards.env to a valid personal access token."
fi

echo ">>> Done!"
