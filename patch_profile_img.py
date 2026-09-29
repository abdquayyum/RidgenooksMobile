import sys

with open('src/app/(tabs)/profile.tsx', 'r') as f:
    content = f.read()

old_code = """<Image source={{ uri: currentUser?.image }} className="w-24 h-24 rounded-full border-4 border-slate-900" />"""
new_code = """<Image source={{ uri: currentUser?.image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" }} className="w-24 h-24 rounded-full border-4 border-slate-900" />"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('src/app/(tabs)/profile.tsx', 'w') as f:
        f.write(content)
    print("Profile image patched!")
