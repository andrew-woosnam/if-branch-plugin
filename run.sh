#!/bin/bash

# Check if an argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 path/to/manifest.yml"
    exit 1
fi

npm run build
npm link
npm link if-branch-plugin

# Assign the first argument to a variable
MANIFEST_PATH="$1"

mkdir -p "outputs"

# Run the command with the provided manifest path
ie --manifest "$MANIFEST_PATH" >outputs/stdout.txt 2>outputs/stderr.txt | sed -n '/{/,$p' | jq . > "outputs/$(basename "$MANIFEST_PATH")"

cat outputs/stdout.txt