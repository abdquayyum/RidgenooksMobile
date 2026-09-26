import urllib.request
import urllib.parse
import json

def geocode(address: str):
    try:
        url = "https://nominatim.openstreetmap.org/search?q=" + urllib.parse.quote(address) + "&format=json&limit=1"
        req = urllib.request.Request(url, headers={'User-Agent': 'RidgenooksApp/1.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                return float(data[0]['lat']), float(data[0]['lon'])
    except Exception as e:
        print(e)
    return None, None

print(geocode("Lekki Phase 1, Lagos, Nigeria"))
