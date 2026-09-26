with open("src/context/GlobalStateContext.tsx", "r") as f:
    content = f.read()

# Replace import
content = content.replace("import AsyncStorage from '@react-native-async-storage/async-storage';", "import * as SecureStore from 'expo-secure-store';")

# Replace bootstrap
content = content.replace("await AsyncStorage.getItem('userToken')", "await SecureStore.getItemAsync('userToken')")

# Replace set/remove item logic
content = content.replace("AsyncStorage.setItem('userToken', authToken)", "SecureStore.setItemAsync('userToken', authToken)")
content = content.replace("AsyncStorage.removeItem('userToken')", "SecureStore.deleteItemAsync('userToken')")

# Add a robust logout function to the context
logout_func = """
  const logout = async () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    await SecureStore.deleteItemAsync('userToken');
  };
"""
content = content.replace("const loadUserData = async (emailToLoad) => {", logout_func + "\n  const loadUserData = async (emailToLoad) => {")

# Add logout to value export
content = content.replace("isAuthenticated, setIsAuthenticated,", "isAuthenticated, setIsAuthenticated, logout,")

with open("src/context/GlobalStateContext.tsx", "w") as f:
    f.write(content)

print("GlobalStateContext patched")
