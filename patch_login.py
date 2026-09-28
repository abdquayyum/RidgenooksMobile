import sys

with open('src/app/index.tsx', 'r') as f:
    content = f.read()

bad_redirect = """  if (!isReady) return null;
  if (isAuthenticated) {
    return <Redirect href=\"/(tabs)\" />;
  }"""

if bad_redirect in content:
    content = content.replace(bad_redirect, "  if (!isReady) return null;")
    with open('src/app/index.tsx', 'w') as f:
        f.write(content)
    print("Cleaned up login page!")
else:
    print("Could not find exact redirect string.")
