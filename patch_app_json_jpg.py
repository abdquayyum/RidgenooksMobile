import json

with open("app.json", "r") as f:
    data = json.load(f)

data["expo"]["icon"] = "./assets/logo.jpg"

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("Icon path updated to logo.jpg")
