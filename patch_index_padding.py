import re
with open("src/app/(tabs)/index.tsx", "r") as f:
    content = f.read()

# Increase padding top for the header
content = re.sub(
    r'style=\{\{ paddingTop: \(insets\?\.top \|\| 40\) \+ 10 \}\}',
    'style={{ paddingTop: (insets?.top || 40) + 30 }}',
    content
)

with open("src/app/(tabs)/index.tsx", "w") as f:
    f.write(content)
print("Index padding patched!")
