with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Remove useLocalSearchParams completely!
content = content.replace("import { useLocalSearchParams, router } from 'expo-router';", "import { router } from 'expo-router';")

# Replace the lookup with a safe selectedProperty lookup
old_lookup = "  const { id } = useLocalSearchParams();\n  const p = properties.find(prop => prop.id.toString() === id) || selectedProperty;\n  if (!p) return <View className=\"flex-1 justify-center items-center\"><Text>Property not found.</Text></View>;"
new_lookup = "  const p = selectedProperty;\n  if (!p) return <ActivityIndicator size=\"large\" color=\"#000000\" style={{flex: 1, justifyContent: 'center'}} />;"
content = content.replace(old_lookup, new_lookup)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("useLocalSearchParams removed permanently!")
