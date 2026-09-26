import json

with open("app.json", "r") as f:
    data = json.load(f)

data["expo"]["name"] = "Ridgenooks"
data["expo"]["slug"] = "ridgenooks"
data["expo"]["version"] = "1.0.0"

if "ios" not in data["expo"]:
    data["expo"]["ios"] = {}

data["expo"]["ios"]["bundleIdentifier"] = "com.ridgenooks.app"
data["expo"]["ios"]["buildNumber"] = "1"
data["expo"]["ios"]["supportsTablet"] = True

if "android" not in data["expo"]:
    data["expo"]["android"] = {}
data["expo"]["android"]["package"] = "com.ridgenooks.app"
data["expo"]["android"]["versionCode"] = 1

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("app.json updated for TestFlight")
