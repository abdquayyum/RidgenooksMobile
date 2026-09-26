with open("src/components/GlobalModals.tsx", "r") as f:
    content = f.read()

# Change locations array
content = content.replace(
    'const LOCATIONS = ["Lagos, Nigeria", "Los Angeles, USA", "London, UK", "Dubai, UAE"];',
    'const LOCATIONS = ["All Locations", "Lagos, Nigeria", "USA"];'
)

# Fix setActiveLocation to setSelectedLocationFilter
content = content.replace("setActiveLocation,", "setSelectedLocationFilter,")
content = content.replace("setActiveLocation(loc);", "setSelectedLocationFilter(loc);")

with open("src/components/GlobalModals.tsx", "w") as f:
    f.write(content)
print("Modals patched!")
