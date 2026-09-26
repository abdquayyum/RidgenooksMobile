  const AuthScreen = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
      if(!email || !password || (isRegister && !name)) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }
      setLoading(true);
      try {
        const endpoint = isRegister ? "/api/register" : "/api/login";
        const body = isRegister ? { name, email, password } : { email, password };
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        
        const data = await response.json();
        if (!response.ok) {
          Alert.alert("Error", data.detail || "Authentication failed");
          setLoading(false);
          return;
        }
        
        setCurrentUser(data.user);
        setAuthToken(data.access_token);
        setIsAuthenticated(true);
        setCurrentScreen('home');
      } catch (e) {
        Alert.alert("Error", "Server connection failed.");
      }
      setLoading(false);
    };
