with open("src/app/index.tsx", "r") as f:
    content = f.read()

# Replace handleLogin usage
content = content.replace("const { isAuthenticated, handleLogin, API_URL } = useGlobalState();", "const { isAuthenticated, setIsAuthenticated, setAuthToken, API_URL } = useGlobalState();")

login_logic = """
        const res = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');
        setAuthToken(data.access_token);
        setIsAuthenticated(true);
"""

content = content.replace("await handleLogin(email, password);", login_logic)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
print("Frontend Auth patched!")
