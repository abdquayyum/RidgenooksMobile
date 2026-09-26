with open("src/app/index.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const { isAuthenticated, setIsAuthenticated, setAuthToken, API_URL } = useGlobalState();",
    "const { isAuthenticated, setIsAuthenticated, setAuthToken, API_URL, setCurrentUser } = useGlobalState();"
)

content = content.replace(
    "setAuthToken(data.access_token);\n        setIsAuthenticated(true);",
    "setAuthToken(data.access_token);\n        setCurrentUser(data.user);\n        setIsAuthenticated(true);"
)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
print("Index user patched!")
