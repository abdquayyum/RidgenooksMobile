with open("src/components/GlobalModals.tsx", "r") as f:
    content = f.read()

# Add handleGalleryScroll properly inside the component body
old_hook = "const LOCATIONS = [\"All Locations\", \"Lagos, Nigeria\", \"USA\"];"
new_hook = """  const LOCATIONS = ["All Locations", "Lagos, Nigeria", "USA"];

  const [activeGalleryIndex, setActiveGalleryIndex] = React.useState(0);
  React.useEffect(() => {
    if (showGallery) setActiveGalleryIndex(galleryIndex || 0);
  }, [showGallery, galleryIndex]);

  const handleGalleryScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveGalleryIndex(Math.round(index));
  };"""

content = content.replace(old_hook, new_hook)

with open("src/components/GlobalModals.tsx", "w") as f:
    f.write(content)
print("Global Modals fixed")
