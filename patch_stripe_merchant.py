import json

with open("app.json", "r") as f:
    data = json.load(f)

for plugin in data["expo"]["plugins"]:
    if isinstance(plugin, list) and plugin[0] == "@stripe/stripe-react-native":
        plugin[1]["merchantIdentifier"] = "merchant.com.ridgenooks.app"

with open("app.json", "w") as f:
    json.dump(data, f, indent=2)

print("Stripe merchant ID fixed in app.json")
