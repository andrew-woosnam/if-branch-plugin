#!/bin/bash

build_and_link_packages() {
    npm run build
    npm link
    npm link if-branch-plugin
}

check_yq_installed() {
    if ! command -v yq &> /dev/null; then
        echo "yq could not be found, please install it."
        exit 1
    fi
}

convert_json_to_yaml() {
    local input_file="$1"
    local output_file="$2"

    check_yq_installed

    yq -y . "$input_file" > "$output_file"
    if [ $? -eq 0 ]; then
        echo "Conversion successful. The YAML file is saved as result.yml."
    else
        echo "json -> yaml conversion failed."
    fi
}

extract_json_content() {
    local input_file="$1"
    local output_file="$2"
    sed -n '/^{/,$p' "$input_file" > "$output_file"
}


MANIFEST_PATH="$1"
STDOUT_FILE="outputs/stdout.txt"
STDERR_FILE="outputs/stderr.txt"
RESULT_JSON="outputs/result.json"
RESULT_YAML="outputs/result.yml"

# Create the outputs directory if it doesn't exist
mkdir -p "outputs"

build_and_link_packages

ie --manifest "$MANIFEST_PATH" > "$STDOUT_FILE" 2> "$STDERR_FILE"

extract_json_content "$STDOUT_FILE" "$RESULT_JSON"

convert_json_to_yaml "$RESULT_JSON" "$RESULT_YAML"
