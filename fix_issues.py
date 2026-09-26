import re

# 1. Fix Paystack reference issue
with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Add reference: 'ref_' + Date.now() to the popup.checkout call
content = re.sub(
    r'email: currentUser\?.email \|\| "guest@ridgenooks\.com",',
    r'email: currentUser?.email || "guest@ridgenooks.com",\n        reference: "ref_" + Date.now() + Math.floor(Math.random() * 1000),',
    content
)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)


# 2. Fix Profile Screen padding
with open("src/app/(tabs)/profile.tsx", "r") as f:
    profile_content = f.read()

# Change paddingTop: (insets?.top || 40) + 20 to + 30
profile_content = profile_content.replace('paddingTop: (insets?.top || 40) + 20', 'paddingTop: (insets?.top || 40) + 30')
# Change pb-8 px-5 to pb-10 px-6
profile_content = profile_content.replace('className="bg-slate-900 pb-8 px-5 items-center rounded-b-3xl shadow-md"', 'className="bg-slate-900 pb-12 px-6 items-center rounded-b-3xl shadow-md"')
# Increase margin below avatar
profile_content = profile_content.replace('className="relative mb-4"', 'className="relative mb-6"')
# Increase size of text elements slightly
profile_content = profile_content.replace('className="text-xl font-bold text-white"', 'className="text-2xl font-bold text-white mb-2"')
profile_content = profile_content.replace('className="text-slate-400 text-sm"', 'className="text-slate-400 text-base"')

with open("src/app/(tabs)/profile.tsx", "w") as f:
    f.write(profile_content)

print("Both fixes applied!")
