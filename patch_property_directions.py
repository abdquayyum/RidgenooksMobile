with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

nav_logic = """
  const handleNavigate = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${p.latitude},${p.longitude}`;
    const url = Platform.select({
      ios: `${scheme}${p.title}@${latLng}`,
      android: `${scheme}${latLng}(${p.title})`
    });
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
    });
  };
"""

# inject logic
content = content.replace("const isSaved = savedPropertyIds.includes(p?.id);", "const isSaved = savedPropertyIds.includes(p?.id);\n" + nav_logic)
content = content.replace("import { View, Text", "import { View, Text, Linking, Platform")

# inject button right after location text
button_ui = """
              <TouchableOpacity onPress={handleNavigate} className="flex-row items-center bg-slate-100 rounded-full px-3 py-1.5 mt-2 self-start border border-slate-200">
                <Navigation size={12} color="#0284c7" />
                <Text className="text-sky-600 text-xs font-bold ml-1">Get Directions</Text>
              </TouchableOpacity>
"""

content = content.replace('• {p.distance}km away</Text>\n              </View>', '• {p.distance}km away</Text>\n              </View>' + button_ui)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Directions button added!")
