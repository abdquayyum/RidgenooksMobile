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
      
      try {
        const res = await fetch(`${API_URL}/api/properties`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          Alert.alert("Success", "Property posted successfully!");
          setTitle(""); setPrice(""); setExactLoc("");
          // Refetch properties for the main app
          fetch(`${API_URL}/api/properties`)
            .then(res => res.json())
            .then(data => setProperties(data));
        }
      } catch (e) {
        console.error(e);
      }
      setIsSubmitting(false);
    };

    return (
      <View className={`flex-1 pt-16 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <View className="px-5 mb-4 flex-row items-center">
          <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="mr-3">
            <ChevronLeft size={24} color={userSettings.dark_mode ? '#ffffff' : '#0f172a'} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Admin Panel</Text>
        </View>

        <View className="px-5 flex-row mb-6">
          <TouchableOpacity onPress={() => setAdminTab('properties')} className={`flex-1 py-2 items-center border-b-2 ${adminTab === 'properties' ? 'border-amber-500' : 'border-transparent'}`}>
            <Text className={`font-bold ${adminTab === 'properties' ? 'text-amber-500' : 'text-slate-500'}`}>Post Property</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAdminTab('logistics')} className={`flex-1 py-2 items-center border-b-2 ${adminTab === 'logistics' ? 'border-amber-500' : 'border-transparent'}`}>
            <Text className={`font-bold ${adminTab === 'logistics' ? 'text-amber-500' : 'text-slate-500'}`}>Logistics Queue</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}>
          {adminTab === 'properties' ? (
            <View>
              <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Title</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Luxury Penthouse" className={`h-12 px-4 rounded-xl mb-4 border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
              
              <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Category</Text>
              <View className="flex-row mb-4">
                {['Short Stay', 'Rent', 'Sell'].map(cat => (
                  <TouchableOpacity key={cat} onPress={() => setCategory(cat)} className={`px-4 py-2 rounded-full mr-2 border ${category === cat ? 'bg-amber-500 border-amber-500' : (userSettings.dark_mode ? 'border-slate-700' : 'border-slate-200')}`}>
                    <Text className={category === cat ? 'text-white font-bold' : (userSettings.dark_mode ? 'text-slate-400' : 'text-slate-600')}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Price (Base NGN)</Text>
                  <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g. 50000" className={`h-12 px-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Unit</Text>
                  <TextInput value={unit} onChangeText={setUnit} placeholder="e.g. night, year" className={`h-12 px-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                </View>
              </View>

              <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Country (Categorization)</Text>
              <View className="flex-row mb-4">
                {['Nigeria', 'USA', 'UK', 'UAE'].map(c => (
                  <TouchableOpacity key={c} onPress={() => setCountry(c)} className={`px-4 py-2 rounded-full mr-2 border ${country === c ? 'bg-blue-500 border-blue-500' : (userSettings.dark_mode ? 'border-slate-700' : 'border-slate-200')}`}>
                    <Text className={country === c ? 'text-white font-bold' : (userSettings.dark_mode ? 'text-slate-400' : 'text-slate-600')}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Exact Location (City, Area)</Text>
              <TextInput value={exactLoc} onChangeText={setExactLoc} placeholder="e.g. Lekki Phase 1" className={`h-12 px-4 rounded-xl mb-4 border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Beds</Text><TextInput value={beds} onChangeText={setBeds} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
                <View className="flex-1 mx-1"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Baths</Text><TextInput value={baths} onChangeText={setBaths} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
                <View className="flex-1 ml-2"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Sqft</Text><TextInput value={sqft} onChangeText={setSqft} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              </View>

              <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Description</Text>
              <TextInput value={description} onChangeText={setDescription} multiline placeholder="Describe the property..." className={`h-24 px-4 py-3 rounded-xl mb-6 border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />

              <TouchableOpacity onPress={handleCreateProperty} disabled={isSubmitting} className="h-14 bg-amber-500 rounded-xl items-center justify-center shadow-sm flex-row">
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <><Plus size={20} color="#fff" className="mr-2" /><Text className="text-white font-bold text-lg">Post Live Property</Text></>}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {adminRequests.length === 0 ? <Text className="text-slate-500 text-center mt-10">No logistics requests globally.</Text> : adminRequests.map(req => (
                <View key={req.id} className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-4 rounded-2xl mb-4 border shadow-sm`}>
                  <View className="flex-row justify-between mb-2">
                    <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{req.type}</Text>
                    <Text className="text-amber-500 font-semibold text-xs">{req.status}</Text>
                  </View>
                  <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>User: <Text className="font-bold">{req.user}</Text></Text>
                  <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>From: {req.origin || 'N/A'}</Text>
                  <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>To: {req.destination || 'N/A'}</Text>
                  <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Date: {req.date}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };
  return (
    <SafeAreaView className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-white'}`} edges={['top']}>
      {currentScreen === 'home' && HomeScreen()}
      {currentScreen === 'details' && DetailsScreen()}
      
      {currentScreen === 'profile' && ProfileScreen()}
      {currentScreen === 'logistics' && LogisticsScreen()}
      {currentScreen === 'explore' && ExploreScreen()}
      {currentScreen === 'saved' && SavedScreen()}
      {currentScreen === 'transactions' && TransactionsScreen()}
      {currentScreen === 'settings' && SettingsScreen()}
      {currentScreen === 'payment_methods' && <PaymentMethodsScreen />}
      {currentScreen === 'requests' && RequestsScreen()}
      {currentScreen === 'admin' && <AdminDashboardScreen />}

      <LocationPickerModal />
      <TransactionDetailsModal />
      
      <StripeSimulator />
      <FullScreenGallery />
      
      {!hideBottomNav && (
        <View 
          className={`absolute bottom-0 w-full border-t px-6 pt-3 flex-row justify-between items-start z-40 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
          style={{ height: 80 + insets.bottom }}
        >
          <TouchableOpacity onPress={() => setCurrentScreen('home')} className="items-center flex-1">
            <Home size={24} color={currentScreen === 'home' ? (userSettings.dark_mode ? '#ffffff' : '#0f172a') : '#94a3b8'} />
            <Text className={`text-[10px] font-semibold mt-1 ${currentScreen === 'home' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('explore')} className="items-center flex-1">
            <Search size={24} color={currentScreen === 'explore' ? (userSettings.dark_mode ? '#ffffff' : '#0f172a') : '#94a3b8'} />
            <Text className={`text-[10px] font-semibold mt-1 ${currentScreen === 'explore' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>Explore</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setCurrentScreen('logistics')} className="items-center flex-1">
            <Truck size={24} color={currentScreen === 'logistics' ? (userSettings.dark_mode ? '#ffffff' : '#0f172a') : '#94a3b8'} />
            <Text className={`text-[10px] font-semibold mt-1 ${currentScreen === 'logistics' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>Logistics</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen('saved')} className="items-center flex-1">
            <Heart size={24} color={currentScreen === 'saved' ? (userSettings.dark_mode ? '#ffffff' : '#0f172a') : '#94a3b8'} />
            <Text className={`text-[10px] font-semibold mt-1 ${currentScreen === 'saved' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="items-center flex-1">
            <User size={24} color={currentScreen === 'profile' ? (userSettings.dark_mode ? '#ffffff' : '#0f172a') : '#94a3b8'} />
            <Text className={`text-[10px] font-semibold mt-1 ${currentScreen === 'profile' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
