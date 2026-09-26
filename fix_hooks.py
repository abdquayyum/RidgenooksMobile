import re

with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Remove from current location
current_loc = """      const isSaved = savedPropertyIds.includes(p?.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };"""

content = content.replace(current_loc, "  const isSaved = savedPropertyIds.includes(p?.id);")

# Add before the early return
new_loc = """  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };
  
  const p = selectedProperty;
  if (!p) return <ActivityIndicator size="large" color="#000000" style={{flex: 1, justifyContent: 'center'}} />;"""

content = content.replace("""  const p = selectedProperty;
  if (!p) return <ActivityIndicator size="large" color="#000000" style={{flex: 1, justifyContent: 'center'}} />;""", new_loc)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Hooks order fixed")
