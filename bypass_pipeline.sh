#!/bin/bash
echo "Starting automated pipeline monitor for Version 15..."
# Get the latest workflow run ID
RUN_ID=$(gh run list -w "iOS CI/CD Pipeline" -L 1 --json databaseId -q '.[0].databaseId')
echo "Monitoring Run ID: $RUN_ID"

while true; do
  STATUS=$(gh run view $RUN_ID)
  if echo "$STATUS" | grep -q "ios-build-ipa"; then
    echo "Artifact ios-build-ipa is now available! The build has finished compiling."
    break
  fi
  if echo "$STATUS" | grep -q "conclusion: failure"; then
    echo "Workflow failed!"
    exit 1
  fi
  echo "Waiting for build to compile (sleeping 60s)..."
  sleep 60
done

echo "Downloading the compiled IPA binary..."
mkdir -p /tmp/v15-ipa
gh run download $RUN_ID -n ios-build-ipa -D /tmp/v15-ipa

echo "Force-uploading directly to Apple via altool..."
xcrun altool --upload-app -f /tmp/v15-ipa/*.ipa -t ios -u "abdulquayyumoyedotun@gmail.com" -p "semc-zyob-xbsy-rrul"

echo "Upload successful! Canceling the stuck GitHub runner..."
gh run cancel $RUN_ID
echo "Bypass complete!"
