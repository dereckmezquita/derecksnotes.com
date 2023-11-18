#!/bin/bash

# Load environment variables
source .env

ENV="$1"

echo "Detected .env NEXT_PUBLIC_DEV_MODE=$NEXT_PUBLIC_DEV_MODE"

if [ "$ENV" = "--server" ]; then
    echo "Building server..."
    npx tsc --project server/tsconfig.json
elif [ "$ENV" = "--client" ]; then
    echo "Building client..."
    cd client && npm run build && chown -R dereck:dereck out && cd ..
elif [ "$ENV" = "--both" ]; then
    echo "Building server and client..."
    npx tsc --project server/tsconfig.json &&
        cd client && npm run build && chown -R dereck:dereck out && cd ..
else
    echo "Please specify an environment to build."
    echo "Options: --server, --client, --both"
    exit 1
fi

# Restart the server based on the environment
if [ "$NEXT_PUBLIC_DEV_MODE" = "true" ]; then
    echo "Creating upload directories..."
    mkdir -p client/public/uploads
    mkdir -p client/public/uploads/profile-photos
    echo "Restarting server..."
    sudo systemctl restart text-derecksnotes-server
else
    echo "Creating upload directories..."
    mkdir -p client/out/uploads
    mkdir -p client/out/uploads/profile-photos
    echo "Restarting server..."
    sudo systemctl restart derecksnotes-server
fi