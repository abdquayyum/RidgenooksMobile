import json

with open('app.json', 'r') as f:
    data = json.load(f)

current_ios = int(data['expo']['ios']['buildNumber'])
data['expo']['ios']['buildNumber'] = str(current_ios + 1)

current_android = int(data['expo']['android']['versionCode'])
data['expo']['android']['versionCode'] = current_android + 1

with open('app.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Version bumped to {current_ios + 1}")
