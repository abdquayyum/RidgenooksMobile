import json

with open("app.json", "r") as f:
    data = json.load(f)

# Update Android adaptive icon to use the real logo
if "android" in data["expo"] and "adaptiveIcon" in data["expo"]["android"]:
    data["expo"]["android"]["adaptiveIcon"]["foregroundImage"] = "./assets/logo_transparent.png"
    data["expo"]["android"]["adaptiveIcon"]["backgroundColor"] = "#0F172A"

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("Android adaptive icon updated to use the real logo!")
