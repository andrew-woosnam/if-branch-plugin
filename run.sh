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
ie --manifest "$MANIFEST_PATH" >outputs/stdout.txt 2>outputs/stderr.txt 

# Use jq to parse the JSON and then convert it to YAML with yq
cat outputs/stdout.txt | sed -n '/{/,$p' | jq . -r | yq e -P - > "outputs/$(basename "$MANIFEST_PATH" .yml).yml"

# Check if the YAML file was created successfully
if [ ! -s "outputs/$(basename "$MANIFEST_PATH" .yml).yml" ]; then
    echo "The YAML file was not created successfully."
    exit 3
fi