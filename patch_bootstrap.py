import sys

with open('src/context/GlobalStateContext.tsx', 'r') as f:
    content = f.read()

old_bootstrap = """        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
          setAuthToken(userToken);
          setIsAuthenticated(true);
        }
        setIsReady(true);"""

new_bootstrap = """        const userToken = await SecureStore.getItemAsync('userToken');
        const userData = await SecureStore.getItemAsync('userData');
        if (userToken) {
          setAuthToken(userToken);
          if (userData) {
            setCurrentUser(JSON.parse(userData));
          }
          setIsAuthenticated(true);
        }
        setIsReady(true);"""

if old_bootstrap in content:
    content = content.replace(old_bootstrap, new_bootstrap)
    with open('src/context/GlobalStateContext.tsx', 'w') as f:
        f.write(content)
    print("bootstrapAsync patched successfully!")
else:
    print("Could not find old_bootstrap.")

