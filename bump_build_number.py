import json

with open("app.json", "r") as f:
    data = json.load(f)

# Increment iOS build number
if "ios" in data["expo"]:
    current_build = int(data["expo"]["ios"].get("buildNumber", "1"))
    data["expo"]["ios"]["buildNumber"] = str(current_build + 1)

# Increment Android version code (optional but good practice)
if "android" in data["expo"]:
    current_code = data["expo"]["android"].get("versionCode", 1)
    data["expo"]["android"]["versionCode"] = current_code + 1

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("Build number bumped to " + str(current_build + 1))
