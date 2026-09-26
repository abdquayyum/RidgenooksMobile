import re

with open("../ridgenooks-backend/main.py", "r") as f:
    content = f.read()

old_prop_creation = """    images_str = ",".join(image_urls)
    
    new_prop = models.Property(
        title=title,
        category=category,
        price=price,
        unit=unit,
        location=location,
        description=description,
        beds=beds,
        baths=baths,
        sqft=sqft,
        images=images_str,
        rating=5.0,
        reviews=0
    )"""

new_prop_creation = """    images_str = ",".join(image_urls)
    
    # Auto-resolve latitude and longitude using Nominatim Geocoding
    import urllib.request
    import urllib.parse
    import json
    
    lat, lon = 6.5244, 3.3792 # Default fallback to Lagos
    try:
        url = "https://nominatim.openstreetmap.org/search?q=" + urllib.parse.quote(location) + "&format=json&limit=1"
        req = urllib.request.Request(url, headers={'User-Agent': 'RidgenooksApp/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                lat, lon = float(data[0]['lat']), float(data[0]['lon'])
    except Exception:
        pass
    
    new_prop = models.Property(
        title=title,
        category=category,
        price=price,
        unit=unit,
        location=location,
        latitude=lat,
        longitude=lon,
        description=description,
        beds=beds,
        baths=baths,
        sqft=sqft,
        images=images_str,
        rating=5.0,
        reviews=0
    )"""

content = content.replace(old_prop_creation, new_prop_creation)

with open("../ridgenooks-backend/main.py", "w") as f:
    f.write(content)
print("Backend geocoding added!")
