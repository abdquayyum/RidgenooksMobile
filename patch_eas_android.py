import json

with open("eas.json", "r") as f:
    data = json.load(f)

if "android" not in data["build"]["preview"]:
    data["build"]["preview"]["android"] = {"buildType": "apk"}
else:
    data["build"]["preview"]["android"]["buildType"] = "apk"

if "android" not in data["build"]["production"]:
    data["build"]["production"]["android"] = {"buildType": "app-bundle"}

with open("eas.json", "w") as f:
    json.dump(data, f, indent=2)

print("eas.json updated for Android APK builds")
