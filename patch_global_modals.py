import re

with open("src/components/GlobalModals.tsx", "r") as f:
    content = f.read()

# Add activeGalleryIndex state
state_search = "const width = Dimensions.get('window').width;\n  const height = Dimensions.get('window').height;"
state_replace = "const width = Dimensions.get('window').width;\n  const height = Dimensions.get('window').height;\n  const [activeGalleryIndex, setActiveGalleryIndex] = React.useState(0);\n\n  React.useEffect(() => {\n    if (showGallery) setActiveGalleryIndex(galleryIndex || 0);\n  }, [showGallery, galleryIndex]);\n\n  const handleGalleryScroll = (event) => {\n    const slideSize = event.nativeEvent.layoutMeasurement.width;\n    const index = event.nativeEvent.contentOffset.x / slideSize;\n    setActiveGalleryIndex(Math.round(index));\n  };"
if "activeGalleryIndex" not in content:
    content = content.replace(state_search, state_replace)

old_scroll = """            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              className="w-full"
              contentOffset={{ x: galleryIndex * width, y: 0 }}
            >"""

new_scroll = """            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              className="w-full"
              contentOffset={{ x: galleryIndex * width, y: 0 }}
              onScroll={handleGalleryScroll}
              scrollEventThrottle={16}
            >"""

content = content.replace(old_scroll, new_scroll)

old_badge = """            <View className="absolute bottom-12 bg-black/60 px-4 py-2 rounded-full border border-white/20">
              <Text className="text-white font-bold">Swipe to explore</Text>
            </View>"""
new_badge = """            <View className="absolute bottom-16 bg-black/60 px-4 py-2 rounded-full border border-white/20 flex-row items-center">
              <Text className="text-white font-bold mr-2">Swipe to explore</Text>
              <Text className="text-white">👉</Text>
            </View>

            {/* Pagination Dots */}
            {galleryImages?.length > 1 && (
              <View className="absolute bottom-6 left-0 right-0 flex-row justify-center items-center space-x-2">
                {galleryImages.map((_, idx) => (
                  <View 
                    key={idx} 
                    style={{
                      height: 8,
                      width: idx === activeGalleryIndex ? 20 : 8,
                      backgroundColor: idx === activeGalleryIndex ? '#f59e0b' : 'rgba(255,255,255,0.4)',
                      borderRadius: 4
                    }} 
                  />
                ))}
              </View>
            )}"""

content = content.replace(old_badge, new_badge)

with open("src/components/GlobalModals.tsx", "w") as f:
    f.write(content)
print("Global Modals gallery patched!")
