  const TransactionsScreen = () => (
    <View className={`flex-1 pt-16 px-5 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="mb-6 flex-row items-center">
        <ChevronLeft size={24} color={userSettings.dark_mode ? '#ffffff' : '#0f172a'} />
        <Text className={`font-bold ml-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back to Profile</Text>
      </TouchableOpacity>
      <Text className={`text-2xl font-bold mb-6 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction History</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {transactions.length === 0 ? (
          <Text className="text-slate-500 text-center mt-10">No transactions found.</Text>
        ) : (
          transactions.map(txn => (
            <TouchableOpacity 
              key={txn.id} 
              onPress={() => setSelectedTransaction(txn)}
              className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-4 rounded-2xl mb-4 border shadow-sm flex-row justify-between items-center`}
            >
              <View className="flex-1 mr-4">
                <Text className={`font-bold mb-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>{txn.property}</Text>
                <Text className="text-slate-500 text-xs">{txn.date} • {txn.id}</Text>
              </View>
              <View className="items-end">
                <Text className={`font-bold mb-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{txn.amount.toLocaleString()}</Text>
                <Text className="text-emerald-500 text-xs font-semibold">{txn.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const RequestsScreen = () => (
    <View className={`flex-1 pt-16 px-5 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="mb-6 flex-row items-center">
        <ChevronLeft size={24} color={userSettings.dark_mode ? '#ffffff' : '#0f172a'} />
        <Text className={`font-bold ml-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back to Profile</Text>
      </TouchableOpacity>
      <Text className={`text-2xl font-bold mb-6 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>My Logistics Requests</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {requests.length === 0 ? (
          <Text className="text-slate-500 text-center mt-10">No requests found.</Text>
        ) : (
          requests.map(req => (
            <View key={req.id} className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-4 rounded-2xl mb-4 border shadow-sm flex-row justify-between items-center`}>
              <View>
                <Text className={`font-bold mb-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{req.type}</Text>
                <Text className="text-slate-500 text-xs">ID: {req.id} • {req.date}</Text>
              </View>
              <View className="bg-amber-100 px-3 py-1 rounded-md">
                <Text className="text-amber-700 text-xs font-bold">{req.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const SettingsScreen = () => {
    const handleCurrencyChange = (curr) => {
      if (curr === 'NGN') {
        setCurrencySymbol('₦');
        setPaymentGateway('paystack');
      } else {
        setCurrencySymbol('$');
        setPaymentGateway('stripe');
      }
    };

    return (
      <View className={`flex-1 pt-16 px-5 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="mb-6 flex-row items-center">
          <ChevronLeft size={24} color={userSettings.dark_mode ? '#ffffff' : '#0f172a'} />
          <Text className={`font-bold ml-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back</Text>
        </TouchableOpacity>
        <Text className={`text-2xl font-bold mb-6 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Settings</Text>
        <View className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl border overflow-hidden shadow-sm p-4`}>
          
          {/* Currency Toggle */}
          <View className={`flex-row justify-between items-center py-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
            <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-700'}`}>Currency</Text>
            <View className={`flex-row rounded-lg p-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <TouchableOpacity onPress={() => handleCurrencyChange('NGN')} className={`px-4 py-1.5 rounded-md ${currencySymbol === '₦' ? (userSettings.dark_mode ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm') : ''}`}>
                <Text className={`text-xs font-bold ${currencySymbol === '₦' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>NGN (₦)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCurrencyChange('USD')} className={`px-4 py-1.5 rounded-md ${currencySymbol === '$' ? (userSettings.dark_mode ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm') : ''}`}>
                <Text className={`text-xs font-bold ${currencySymbol === '$' ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>USD ($)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className={`flex-row justify-between items-center py-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
            <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-700'}`}>Push Notifications</Text>
            <Switch 
              value={userSettings.push_notifications} 
              onValueChange={(val) => handleUpdateSettings("push_notifications", val)} 
              trackColor={{ true: '#f59e0b' }} 
            />
          </View>
          <View className={`flex-row justify-between items-center py-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
            <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-700'}`}>Location Services</Text>
            <Switch 
              value={userSettings.location_services} 
              onValueChange={(val) => {
                handleUpdateSettings("location_services", val);
                if(val) detectLocation();
              }} 
              trackColor={{ true: '#f59e0b' }} 
            />
          </View>
          <View className="flex-row justify-between items-center py-4">
            <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-700'}`}>Dark Mode</Text>
            <Switch 
              value={userSettings.dark_mode} 
              onValueChange={(val) => handleUpdateSettings("dark_mode", val)} 
              trackColor={{ true: '#f59e0b' }} 
            />
          </View>
        </View>
      </View>
    );
  };

  const PaymentMethodsScreen = () => {
    const [showAddCard, setShowAddCard] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const formatCardNumber = (text) => {
      return text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiry = (text) => {
      let cleaned = text.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
      }
      return cleaned;
    };

    const handleSaveCard = () => {
      if(cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
        Alert.alert("Error", "Please complete all card details securely.");
        return;
      }
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert("Success", "Card Tokenized Successfully via PCI-DSS Compliant Gateway!");
        setShowAddCard(false);
      }, 1500);
    };

    return (
      <View className={`flex-1 pt-16 px-5 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="mb-6 flex-row items-center">
          <ChevronLeft size={24} color={userSettings.dark_mode ? '#ffffff' : '#0f172a'} />
          <Text className={`font-bold ml-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back</Text>
        </TouchableOpacity>
        <Text className={`text-2xl font-bold mb-6 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Payment Methods</Text>
        
        {/* Visual Card representation */}
        <View className="bg-slate-900 p-6 rounded-2xl mb-8 shadow-xl relative overflow-hidden h-48 justify-between">
          <View className="absolute -right-16 -top-16 h-48 w-48 bg-white/5 rounded-full" />
          <View className="absolute -left-10 -bottom-10 h-32 w-32 bg-amber-500/10 rounded-full" />
          <View className="flex-row justify-between items-center z-10">
            <Text className="text-white font-bold text-lg tracking-widest">RIDGENOOKS</Text>
            <View className="flex-row items-center">
              <View className="h-6 w-6 rounded-full bg-red-500/80 mr-[-10px] z-10" />
              <View className="h-6 w-6 rounded-full bg-amber-500/80" />
            </View>
          </View>
          <View className="z-10">
            <Text className="text-slate-300 text-xs mb-1 uppercase tracking-widest font-semibold">Card Number</Text>
            <Text className="text-white font-mono tracking-widest text-xl mb-4">
              {cardNumber ? cardNumber : '**** **** **** ****'}
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-slate-300 text-[10px] uppercase tracking-widest font-semibold">Cardholder</Text>
                <Text className="text-white font-bold tracking-widest mt-1">{currentUser.name.toUpperCase() || 'USER'}</Text>
              </View>
              <View>
                <Text className="text-slate-300 text-[10px] uppercase tracking-widest font-semibold">Expires</Text>
                <Text className="text-white font-bold tracking-widest mt-1">{cardExpiry ? cardExpiry : 'MM/YY'}</Text>
              </View>
            </View>
          </View>
        </View>

        {showAddCard ? (
          <View className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-5 rounded-3xl border shadow-lg`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Secure Add Card</Text>
              <Lock size={16} color="#10b981" />
            </View>
            
            <View className={`border rounded-xl px-4 py-1 mb-4 flex-row items-center ${userSettings.dark_mode ? 'border-slate-600 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
              <CreditCard size={18} color="#94a3b8" />
              <TextInput 
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="0000 0000 0000 0000" 
                placeholderTextColor="#94a3b8" 
                keyboardType="number-pad" 
                maxLength={19}
                className={`flex-1 p-3 ml-2 font-mono ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} 
              />
            </View>

            <View className="flex-row justify-between mb-6">
              <View className={`border rounded-xl px-4 py-1 flex-1 mr-2 flex-row items-center ${userSettings.dark_mode ? 'border-slate-600 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                <CalendarDays size={18} color="#94a3b8" />
                <TextInput 
                  value={cardExpiry}
                  onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                  placeholder="MM/YY" 
                  placeholderTextColor="#94a3b8" 
                  keyboardType="number-pad"
                  maxLength={5}
                  className={`flex-1 p-3 ml-2 font-mono ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} 
                />
              </View>
              <View className={`border rounded-xl px-4 py-1 flex-1 ml-2 flex-row items-center ${userSettings.dark_mode ? 'border-slate-600 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                <Lock size={18} color="#94a3b8" />
                <TextInput 
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  placeholder="CVV" 
                  secureTextEntry
                  placeholderTextColor="#94a3b8" 
                  keyboardType="number-pad" 
                  maxLength={4}
                  className={`flex-1 p-3 ml-2 font-mono ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} 
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSaveCard} disabled={isSaving} className="bg-[#10b981] py-4 rounded-xl items-center flex-row justify-center">
              {isSaving ? <ActivityIndicator color="#fff" /> : (
                <>
                  <ShieldCheck size={18} color="#fff" className="mr-2" />
                  <Text className="text-white font-bold text-lg">Save & Tokenize</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddCard(false)} className="mt-4 py-2 items-center">
              <Text className="text-slate-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setShowAddCard(true)} className={`border-2 border-dashed p-5 rounded-2xl items-center flex-row justify-center active:bg-slate-100 ${userSettings.dark_mode ? 'border-slate-600' : 'border-slate-300'}`}>
            <Plus size={24} color={userSettings.dark_mode ? '#cbd5e1' : '#64748b'} className="mr-2" />
            <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-500'}`}>Add New Payment Method</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;

    const renderCalendar = () => {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
      
      let days = [];
      for (let i = 0; i < firstDay; i++) days.push(null);
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), i);
        days.push(d);
      }

      return (
        <View className="mb-6">
          <Text className={`font-bold mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Select Dates</Text>
          <View className="flex-row flex-wrap">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d,i) => (
              <Text key={i} className="w-[14%] text-center text-xs font-bold text-slate-400 mb-2">{d}</Text>
            ))}
            {days.map((date, idx) => {
              if (!date) return <View key={`empty-${idx}`} className="w-[14%] h-10" />;
              
              const dateStr = date.toISOString().split('T')[0];
              const isBlocked = bookedDates[dateStr];
              const isStart = checkInDate === dateStr;
              const isEnd = checkOutDate === dateStr;
              const isBetween = checkInDate && checkOutDate && dateStr > checkInDate && dateStr < checkOutDate;
              const isPast = date < new Date(today.setHours(0,0,0,0));
              
              const disabled = isBlocked || isPast;
              
              let bgClass = "bg-transparent";
              let textClass = userSettings.dark_mode ? 'text-slate-300' : 'text-slate-700';
              
              if (isStart || isEnd) { bgClass = "bg-amber-500 rounded-full"; textClass = "text-white font-bold"; }
              else if (isBetween) { bgClass = "bg-amber-500/20"; textClass = "text-amber-700"; }
              else if (disabled) { textClass = "text-slate-300 line-through"; }

              return (
                <TouchableOpacity 
                  key={idx} 
                  disabled={disabled}
                  onPress={() => {
                    if (!checkInDate || (checkInDate && checkOutDate)) {
                      setCheckInDate(dateStr); setCheckOutDate(null);
                    } else if (dateStr > checkInDate) {
                      let isValid = true;
                      let curr = new Date(checkInDate);
                      while (curr <= date) {
                        if (bookedDates[curr.toISOString().split('T')[0]]) isValid = false;
                        curr.setDate(curr.getDate() + 1);
                      }
                      if (isValid) setCheckOutDate(dateStr);
                      else { setCheckInDate(dateStr); setCheckOutDate(null); }
                    } else {
                      setCheckInDate(dateStr); setCheckOutDate(null);
                    }
                  }}
                  className={`w-[14%] h-10 items-center justify-center ${bgClass}`}
                >
                  <Text className={textClass}>{date.getDate()}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      );
    };

    return (
      <View className="absolute inset-0 z-50 justify-end bg-slate-900/60" style={{ elevation: 50 }}>
        <TouchableOpacity className="absolute inset-0" onPress={() => setSelectedTransaction(null)} />
        <View className={`w-full rounded-t-3xl p-6 shadow-2xl ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-white'}`} style={{ paddingBottom: insets.bottom + 40 }}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction Receipt</Text>
            <TouchableOpacity onPress={() => setSelectedTransaction(null)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View className={`items-center py-6 mb-6 rounded-2xl ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <View className="h-16 w-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
              <CheckCircle2 size={32} color="#10b981" />
            </View>
            <Text className={`text-4xl font-bold mb-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{selectedTransaction.amount.toLocaleString()}</Text>
            <Text className="text-emerald-500 font-semibold">{selectedTransaction.status}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">Property</Text>
            <Text className={`font-semibold text-base ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTransaction.property}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">Transaction ID</Text>
            <Text className={`font-semibold text-base ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTransaction.id}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">Date</Text>
            <Text className={`font-semibold text-base ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTransaction.date}</Text>
          </View>
          
          <TouchableOpacity 
            className="w-full bg-amber-500 py-4 rounded-xl items-center mt-4"
            onPress={() => setSelectedTransaction(null)}
          >
            <Text className="text-white font-bold text-lg">Close Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
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
