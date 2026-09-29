import sys

with open('src/app/(tabs)/profile.tsx', 'r') as f:
    content = f.read()

old_code = """          <Text className="text-2xl font-bold text-white mb-2">{currentUser?.name}</Text>
          <Text className="text-slate-400 text-base">{currentUser?.email}</Text>"""

new_code = """          <Text className="text-2xl font-bold text-white mb-2">{currentUser?.name || "Loading..."}</Text>
          <Text className="text-slate-400 text-base">{currentUser?.email || "..."}</Text>"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('src/app/(tabs)/profile.tsx', 'w') as f:
        f.write(content)
    print("Profile UI patched successfully!")
else:
    print("Could not find code to patch in profile.tsx")
