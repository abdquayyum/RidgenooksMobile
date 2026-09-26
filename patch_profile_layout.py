import re

with open("src/app/(tabs)/profile.tsx", "r") as f:
    content = f.read()

if "insets" not in content:
    content = content.replace("setCurrentUser, setIsAuthenticated", "setCurrentUser, setIsAuthenticated, insets")

content = re.sub(
    r'<View className="bg-slate-900 pt-16 pb-8 px-5 items-center rounded-b-3xl">',
    '<View style={{ paddingTop: (insets?.top || 40) + 20 }} className="bg-slate-900 pb-8 px-5 items-center rounded-b-3xl shadow-md">',
    content
)

with open("src/app/(tabs)/profile.tsx", "w") as f:
    f.write(content)
print("Profile layout patched!")
