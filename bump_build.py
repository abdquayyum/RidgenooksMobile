import json

with open("app.json", "r") as f:
    data = json.load(f)

current_build = int(data["expo"]["ios"].get("buildNumber", "2"))
data["expo"]["ios"]["buildNumber"] = str(current_build + 1)

if "android" in data["expo"]:
    data["expo"]["android"]["versionCode"] = data["expo"]["android"].get("versionCode", 2) + 1

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("Bumped iOS build to " + str(current_build + 1))
