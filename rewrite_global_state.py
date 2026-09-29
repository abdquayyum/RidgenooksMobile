import sys

with open('src/context/GlobalStateContext.tsx', 'r') as f:
    content = f.read()

# 1. Rewrite bootstrapAsync
old_bootstrap = """  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        const userData = await SecureStore.getItemAsync('userData');
        if (userToken) {
          setAuthToken(userToken);
          if (userData) {
            setCurrentUser(JSON.parse(userData));
          }
          setIsAuthenticated(true);
        }
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally { setIsReady(true); }
    };
    bootstrapAsync();
  }, []);"""

new_bootstrap = """  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        const userData = await SecureStore.getItemAsync('userData');
        if (userToken) {
          setAuthToken(userToken);
          if (userData) {
            setCurrentUser(JSON.parse(userData));
          }
          setIsAuthenticated(true);
        }
        setAuthBootstrapped(true);
      } catch (e) {
        console.warn(e);
        setAuthBootstrapped(true);
      } finally { 
        setIsReady(true); 
      }
    };
    bootstrapAsync();
  }, []);"""

# 2. Remove the old currentUser initialization
old_current_user = """  const [currentUser, setCurrentUser] = useState({ name: "", email: "", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" });"""
new_current_user = """"""

# 3. Rewrite logout
old_logout = """  const logout = async () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUser({ name: "", email: "", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" });
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch(e) { console.warn(e); }
  };"""

new_logout = """  const logout = async () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch(e) { console.warn(e); }
  };"""

# 4. Rewrite loadUserData to fetch /api/me
old_load = """  const loadUserData = async (emailToLoad) => {
    if(!authToken) return;
    try {
      let res = await fetch(`${API_URL}/api/saved`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setSavedPropertyIds(await res.json());

      res = await fetch(`${API_URL}/api/transactions`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setTransactions(await res.json());

      res = await fetch(`${API_URL}/api/requests`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setRequests(await res.json());

      res = await fetch(`${API_URL}/api/settings`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setUserSettings(await res.json());
    } catch(e) {
      console.error("Failed to load user data:", e);
    }
  };"""

new_load = """  const loadUserData = async () => {
    if(!authToken) return;
    try {
      // Fetch user profile securely using token
      let meRes = await fetch(`${API_URL}/api/me`, { headers: getAuthHeader() });
      if (meRes.status === 401) { logout(); return; }
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData);
      }

      let res = await fetch(`${API_URL}/api/saved`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setSavedPropertyIds(await res.json());

      res = await fetch(`${API_URL}/api/transactions`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setTransactions(await res.json());

      res = await fetch(`${API_URL}/api/requests`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setRequests(await res.json());

      res = await fetch(`${API_URL}/api/settings`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setUserSettings(await res.json());
    } catch(e) {
      console.error("Failed to load user data:", e);
    }
  };"""

# 5. Fix the persistence useEffect
old_persist = """  useEffect(() => {
    if (authToken && currentUser?.email) {
      SecureStore.setItemAsync('userToken', authToken).catch(console.warn);
      SecureStore.setItemAsync('userData', JSON.stringify(currentUser)).catch(console.warn);
    } else if (!authToken) {
      SecureStore.deleteItemAsync('userToken').catch(console.warn);
      SecureStore.deleteItemAsync('userData').catch(console.warn);
    }
  }, [authToken, currentUser]);"""

new_persist = """  useEffect(() => {
    if (!authBootstrapped) return; // Prevent overwriting during initial load
    
    if (authToken && currentUser?.email) {
      SecureStore.setItemAsync('userToken', authToken).catch(console.warn);
      SecureStore.setItemAsync('userData', JSON.stringify(currentUser)).catch(console.warn);
    } else if (!authToken) {
      SecureStore.deleteItemAsync('userToken').catch(console.warn);
      SecureStore.deleteItemAsync('userData').catch(console.warn);
    }
  }, [authToken, currentUser, authBootstrapped]);"""

if old_bootstrap in content: content = content.replace(old_bootstrap, new_bootstrap)
if old_current_user in content: content = content.replace(old_current_user, new_current_user)
if old_logout in content: content = content.replace(old_logout, new_logout)
if old_load in content: content = content.replace(old_load, new_load)
if old_persist in content: content = content.replace(old_persist, new_persist)

with open('src/context/GlobalStateContext.tsx', 'w') as f:
    f.write(content)

print("GlobalStateContext rewrite complete.")
