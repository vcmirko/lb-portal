#!/bin/bash
# filepath: c:\jumpstart\vue3\loonburo\build.sh

set -e

echo "Building client app..."
cd client
npm run build

echo "Copying built files to server/public..."
rm -rf ../server/src/public
mkdir -p ../server/src/public
cp -r dist/* ../server/src/public/

echo "Done! Client app is ready to be served by the server."