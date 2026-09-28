import sys

with open('src/app/_layout.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { Stack, router, useSegments } from "expo-router";', 'import { Stack, router, usePathname } from "expo-router";')

old_logic = """  const segments = useSegments();

  useEffect(() => {
    if (!isReady) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    if (!isAuthenticated && inTabsGroup) {
      // Force redirect to login if they lose auth while inside the app
      router.replace('/');
    } else if (isAuthenticated && segments.length === 0) {
      // Force redirect to tabs if they are on the login screen and authenticated
      router.replace('/(tabs)');
    }
  }, [isReady, isAuthenticated, segments]);"""

new_logic = """  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    
    // Slight delay to prevent navigation state conflicts during re-renders
    const timer = setTimeout(() => {
      if (!isAuthenticated && pathname !== '/') {
        router.replace('/');
      } else if (isAuthenticated && pathname === '/') {
        router.replace('/(tabs)');
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [isReady, isAuthenticated, pathname]);"""

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    with open('src/app/_layout.tsx', 'w') as f:
        f.write(content)
    print("Patched AuthGuard successfully!")
else:
    print("Could not find old logic to replace.")
