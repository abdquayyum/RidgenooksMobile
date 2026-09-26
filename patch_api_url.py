import re

with open("src/context/GlobalStateContext.tsx", "r") as f:
    content = f.read()

# Replace the local API_URL with the new production HTTPS URL
old_url = 'const API_URL = "http://192.168.1.160:8000";'
new_url = 'const API_URL = "https://api.ridgenooksinc.com";'

if old_url in content:
    content = content.replace(old_url, new_url)
else:
    # Just in case it was modified slightly
    content = re.sub(r'const API_URL = "[^"]+";', new_url, content)

with open("src/context/GlobalStateContext.tsx", "w") as f:
    f.write(content)
print("Mobile app API URL updated!")
