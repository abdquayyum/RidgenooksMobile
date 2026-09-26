import re

with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# 1. Remove the problematic early definitions
content = content.replace("const id = selectedProperty?.id;\n    const paystackWebViewRef = React.useRef();", "const paystackWebViewRef = React.useRef();")
content = content.replace("  const p = properties.find(prop => prop.id.toString() === id);\n\n  if (!p) return <View className=\"flex-1 justify-center items-center\"><Text>Property not found.</Text></View>;", "")

# 2. Insert them below the useGlobalState destruct
target = "} = useGlobalState();"
replacement = "} = useGlobalState();\n\n  const p = selectedProperty;\n  if (!p) return <View className=\"flex-1 justify-center items-center\"><Text>Property not found.</Text></View>;"
content = content.replace(target, replacement)

# 3. Add Left/Right buttons to the property top images
old_images = """        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {displayImages.map((img, i) => (
            <TouchableOpacity key={i} activeOpacity={0.9} onPress={() => { setGalleryImages(displayImages); setGalleryIndex(i); setShowGallery(true); }}>
              <Image source={{uri: img}} style={{width, height: 300}} />
            </TouchableOpacity>
          ))}
        </ScrollView>"""

new_images = """        <View>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={(ref) => { this.imgScroll = ref; }}>
            {displayImages.map((img, i) => (
              <TouchableOpacity key={i} activeOpacity={0.9} onPress={() => { setGalleryImages(displayImages); setGalleryIndex(i); setShowGallery(true); }}>
                <Image source={{uri: img}} style={{width, height: 320}} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="absolute bottom-5 right-5 bg-black/60 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold text-center">Tap to View Gallery</Text>
          </View>
        </View>"""
content = content.replace(old_images, new_images)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Property page updated")
