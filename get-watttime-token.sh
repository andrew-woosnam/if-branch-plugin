#!/bin/bash

# Load the .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
else
  echo ".env file not found"
  exit 1
fi

# Call the /login endpoint and capture the token
response=$(curl -s -X GET "https://api.watttime.org/login" \
     -u "$WATT_TIME_USERNAME:$WATT_TIME_PASSWORD" \
     -H "Content-Type: application/json")

# Extract the token from the response
token=$(echo $response | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

# Check if a token was received
if [ -n "$token" ]; then
  # Replace the existing WATT_TIME_TOKEN or append it if not present
  if grep -q "WATT_TIME_TOKEN=" .env; then
    sed -i "/WATT_TIME_TOKEN=/c\WATT_TIME_TOKEN=$token" .env
  else
    echo -e "\nWATT_TIME_TOKEN=$token" >> .env
  fi
  echo "Token updated in .env file."
else
  echo "Failed to retrieve token."
fi
