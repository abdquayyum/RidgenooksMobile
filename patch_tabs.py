with open("src/app/(tabs)/_layout.tsx", "r") as f:
    content = f.read()

import re
content = re.sub(r'<Tabs\.Screen\s*options=\{\{\s*tabBarIcon: \(\{ color \}\) => <Search size=\{24\} color=\{color\} />,\s*\}\}\s*/>', '', content)
content = re.sub(r'<Tabs\.Screen\s*options=\{\{\s*tabBarIcon: \(\{ color \}\) => <Search.*?/>\s*\}\}\s*/>', '', content, flags=re.DOTALL)

with open("src/app/(tabs)/_layout.tsx", "w") as f:
    f.write(content)
