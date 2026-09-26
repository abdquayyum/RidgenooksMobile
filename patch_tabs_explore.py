import re
with open("src/app/(tabs)/_layout.tsx", "r") as f:
    content = f.read()

explore_tab = """      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />"""

if 'name="explore"' not in content:
    content = content.replace(
        '<Tabs.Screen\n        name="index"',
        explore_tab + '\n      <Tabs.Screen\n        name="index"'
    )

with open("src/app/(tabs)/_layout.tsx", "w") as f:
    f.write(content)
print("Explore tab restored!")
