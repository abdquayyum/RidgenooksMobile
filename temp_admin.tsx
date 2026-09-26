  const AdminDashboardScreen = () => {
    const [adminTab, setAdminTab] = useState('properties');
    const [adminRequests, setAdminRequests] = useState([]);
    
    // Form fields
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Short Stay");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("night");
    const [country, setCountry] = useState("Nigeria");
    const [exactLoc, setExactLoc] = useState("");
    const [description, setDescription] = useState("");
    const [beds, setBeds] = useState("1");
    const [baths, setBaths] = useState("1");
    const [sqft, setSqft] = useState("1000");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (adminTab === 'logistics') {
        fetch(`${API_URL}/api/admin/requests`, { headers: getAuthHeader() })
          .then(res => res.json())
          .then(data => setAdminRequests(data))
          .catch(e => console.error(e));
      }
    }, [adminTab]);

    const handleCreateProperty = async () => {
      if (!title || !price || !country || !exactLoc) {
        Alert.alert("Error", "Please fill required fields (Title, Price, Country, Exact Location).");
        return;
      }
      setIsSubmitting(true);
      const payload = {
        title, category, price: parseFloat(price), unit, 
        location: `${exactLoc}, ${country}`, 
        description, beds: parseInt(beds), baths: parseInt(baths), 
        sqft: parseInt(sqft), images: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
      };
