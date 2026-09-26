import json

with open("eas.json", "r") as f:
    data = json.load(f)

if "submit" in data:
    del data["submit"]

with open("eas.json", "w") as f:
    json.dump(data, f, indent=2)

print("eas.json submit placeholders removed")
