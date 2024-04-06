#!/bin/bash

# Check if an argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 path/to/manifest.yml"
    exit 1
fi

# Assign the first argument to a variable
MANIFEST_PATH="$1"

# Run the command with the provided manifest path
ie --manifest "$MANIFEST_PATH" | sed -n '/{/,$p' | jq . > "outputs/$(basename "$MANIFEST_PATH")"
