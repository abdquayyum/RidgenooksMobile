import re

with open("src/context/GlobalStateContext.tsx", "r") as f:
    content = f.read()

# Add import
content = content.replace("import React, { createContext, useContext, useState, useEffect } from 'react';", "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport AsyncStorage from '@react-native-async-storage/async-storage';")

# Update setAuthToken and setIsAuthenticated inside login
old_login = """  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);"""

new_login = """  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setAuthToken(userToken);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    bootstrapAsync();
  }, []);
"""
content = content.replace(old_login, new_login)

# Now, we need a custom function to update auth token so it saves to AsyncStorage
# Or we can just let components do setAuthToken, but we want it persisted.
# We'll add an interceptor inside useEffect to sync authToken to AsyncStorage
old_sync = """  useEffect(() => {
    if (isAuthenticated && authToken) {"""
new_sync = """  useEffect(() => {
    if (authToken) {
      AsyncStorage.setItem('userToken', authToken).catch(console.warn);
    } else {
      AsyncStorage.removeItem('userToken').catch(console.warn);
    }
  }, [authToken]);

  useEffect(() => {
    if (isAuthenticated && authToken) {"""
content = content.replace(old_sync, new_sync)

with open("src/context/GlobalStateContext.tsx", "w") as f:
    f.write(content)

print("Auth updated")
