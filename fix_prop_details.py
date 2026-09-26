import re

with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

old_hook = "const isSaved = savedPropertyIds.includes(p?.id);"
new_hook = """  const isSaved = savedPropertyIds.includes(p?.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };"""

content = content.replace(old_hook, new_hook)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Property Details fixed")
