import json

with open("app.json", "r") as f:
    data = json.load(f)

data["expo"]["icon"] = "./assets/logo_transparent.png"
if "ios" in data["expo"]:
    if "icon" in data["expo"]["ios"]:
        del data["expo"]["ios"]["icon"]

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("Icon path updated")
