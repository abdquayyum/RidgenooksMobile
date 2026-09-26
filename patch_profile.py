with open("src/app/(tabs)/profile.tsx", "r") as f:
    content = f.read()

# Add logout to destructured useGlobalState
content = content.replace("const { userSettings, currentUser, setCurrentUser, setIsAuthenticated, insets } = useGlobalState();", "const { userSettings, currentUser, setCurrentUser, setIsAuthenticated, insets, logout } = useGlobalState();")

# Fix the onPress for Log Out
content = content.replace("onPress={() => { setIsAuthenticated(false); router.replace('/'); }}", "onPress={async () => { await logout(); router.replace('/'); }}")

with open("src/app/(tabs)/profile.tsx", "w") as f:
    f.write(content)

print("Profile patched")
