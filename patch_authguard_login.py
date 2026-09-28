import sys

with open('src/app/_layout.tsx', 'r') as f:
    content = f.read()

old_logic = """    const timer = setTimeout(() => {
      if (!isAuthenticated && pathname !== '/') {
        router.replace('/');
      } else if (isAuthenticated && pathname === '/') {
        router.replace('/(tabs)');
      }
    }, 10);"""

new_logic = """    const timer = setTimeout(() => {
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.replace('/');
      }
    }, 10);"""

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    with open('src/app/_layout.tsx', 'w') as f:
        f.write(content)
    print("Patched AuthGuard successfully for /login!")
else:
    print("Could not find old logic to replace.")
