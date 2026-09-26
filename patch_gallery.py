import re

with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Add state for activeImageIndex
state_search = "const [checkoutNights, setCheckoutNights] = useState(1);"
state_replace = "const [checkoutNights, setCheckoutNights] = useState(1);\n  const [activeImageIndex, setActiveImageIndex] = useState(0);\n\n  const handleScroll = (event) => {\n    const slideSize = event.nativeEvent.layoutMeasurement.width;\n    const index = event.nativeEvent.contentOffset.x / slideSize;\n    setActiveImageIndex(Math.round(index));\n  };\n"
if "activeImageIndex" not in content:
    content = content.replace(state_search, state_replace)

# Add ChevronRight to imports if not there (we'll just use ChevronsRight or something already imported, let's check imports)
# Wait, let's just use a Text arrow or see what lucide icons we have.
# The user wants a swiping icon, lucide has MoveHorizontal or ChevronsRight.
# Let's add MoveHorizontal to imports if possible, or just build the dots.

old_scrollview = """<ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {displayImages.map((img, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => { setGalleryImages(displayImages); setGalleryIndex(idx); setShowGallery(true); }}>
                <Image source={{uri: img}} style={{ width, height: 288 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>"""

new_scrollview = """<ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
            {displayImages.map((img, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => { setGalleryImages(displayImages); setGalleryIndex(idx); setShowGallery(true); }}>
                <Image source={{uri: img}} style={{ width, height: 288 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {displayImages.length > 1 && (
            <>
              {/* Animated Dots */}
              <View className="absolute bottom-6 left-0 right-0 flex-row justify-center items-center space-x-1.5">
                {displayImages.map((_, idx) => (
                  <View 
                    key={idx} 
                    style={{
                      height: 8,
                      width: idx === activeImageIndex ? 20 : 8,
                      backgroundColor: idx === activeImageIndex ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                      borderRadius: 4
                    }} 
                  />
                ))}
              </View>

              {/* Swipe Indicator Pill (only shows on first image to teach user) */}
              {activeImageIndex === 0 && (
                <View className="absolute bottom-6 right-5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center border border-white/20">
                  <Text className="text-white text-xs font-bold mr-1">Swipe</Text>
                  <Text className="text-white text-xs">👉</Text>
                </View>
              )}
            </>
          )}"""

content = content.replace(old_scrollview, new_scrollview)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Gallery patched!")
