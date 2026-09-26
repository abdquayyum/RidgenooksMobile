  const DetailsScreen = () => {
    if (!selectedProperty) return null;
    const p = selectedProperty;
    const displayImages = p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"];

    return (
      <View className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-white'}`}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="relative h-72 w-full">
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {displayImages.map((img, idx) => (
                <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => {
                  setGalleryImages(displayImages);
                  setGalleryIndex(idx);
                  setShowGallery(true);
                }}>
                  <Image source={{uri: img}} style={{ width, height: 288 }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full flex-row items-center">
              <ImageIcon size={14} color="#ffffff" className="mr-2" />
              <Text className="text-white text-xs font-bold">1 / {displayImages.length}</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => setCurrentScreen('home')} className="absolute top-12 left-5 h-10 w-10 bg-black/30 rounded-full items-center justify-center">
            <ChevronLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View className="p-5">
          <Text className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-3 mt-2">Admin Tools</Text>
          <View className={`${userSettings.dark_mode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl border mb-6 overflow-hidden shadow-sm`}>
            <TouchableOpacity onPress={() => setCurrentScreen("admin")} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center"><View className="h-10 w-10 bg-amber-100 rounded-full items-center justify-center mr-3"><Lock size={18} color="#d97706" /></View><Text className={`font-bold text-sm ${userSettings.dark_mode ? "text-amber-500" : "text-amber-600"}`}>Admin Dashboard</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
            <View className="flex-row justify-between items-center mb-3">
              <View className="bg-amber-100 px-3 py-1 rounded-md"><Text className="text-amber-800 text-xs font-bold">{p.category}</Text></View>
              <View className={`flex-row items-center px-2 py-1 rounded-md ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <Star size={14} color="#f59e0b" className="fill-current" />
                <Text className={`text-xs font-bold ml-1 ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-700'}`}>{p.rating} <Text className={`font-normal ${userSettings.dark_mode ? 'text-slate-500' : 'text-slate-500'}`}>({p.reviews})</Text></Text>
              </View>
            </View>
            <Text className={`text-2xl font-bold mb-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.title}</Text>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1 pr-2">
                <MapPin size={16} color="#64748b" />
                <Text className={`text-sm ml-1 ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`} numberOfLines={1}>{p.location} • {p.distance}km away</Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  setMapRegion({ latitude: p.latitude || 6.5244, longitude: p.longitude || 3.3792, latitudeDelta: 0.01, longitudeDelta: 0.01 });
                  setCurrentScreen('explore');
                }} 
                className="flex-row items-center bg-blue-500/10 px-3 py-1.5 rounded-full"
              >
                <Navigation size={14} color="#3b82f6" />
                <Text className="text-blue-500 font-semibold text-xs ml-1">Map</Text>
              </TouchableOpacity>
            </View>
            
            <View className={`flex-row justify-between border-y py-4 mb-6 ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="items-center flex-1"><Building size={20} color="#94a3b8" /><Text className={`font-bold mt-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.beds} <Text className="font-normal text-slate-500 text-xs">Beds</Text></Text></View>
              <View className={`w-px h-full ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`} />
              <View className="items-center flex-1"><Box size={20} color="#94a3b8" /><Text className={`font-bold mt-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.baths} <Text className="font-normal text-slate-500 text-xs">Baths</Text></Text></View>
              <View className={`w-px h-full ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`} />
              <View className="items-center flex-1"><MapIcon size={20} color="#94a3b8" /><Text className={`font-bold mt-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.sqft} <Text className="font-normal text-slate-500 text-xs">Sqft</Text></Text></View>
            </View>

            <Text className={`font-bold text-lg mb-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Overview</Text>
            <Text className={`text-sm leading-relaxed mb-6 ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>
              This stunning property offers the perfect blend of modern architecture and comfortable living. Fully furnished with premium amenities, high-speed Wi-Fi, 24/7 power supply, and state-of-the-art security systems.
            </Text>

            <Text className={`font-bold text-lg mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Amenities</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {['Swimming Pool', 'Gym', '24/7 Security', 'Backup Generator', 'Smart Home', 'Parking'].map(amenity => (
                <View key={amenity} className={`px-3 py-2 rounded-full flex-row items-center ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <CheckCircle2 size={14} color="#f59e0b" className="mr-1" />
                  <Text className={`text-xs font-semibold ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-700'}`}>{amenity}</Text>
                </View>
              ))}
            </View>
            
            <Text className={`font-bold text-lg mb-4 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Listed by</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('chat')} className={`flex-row items-center p-4 rounded-2xl border mb-6 shadow-sm active:bg-slate-100 ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <View className="h-12 w-12 bg-slate-200 rounded-full items-center justify-center mr-4 overflow-hidden border border-slate-300">
                <Image source={{uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a"}} className="h-full w-full" />
              </View>
              <View className="flex-1">
                <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Ridgenooks Agent</Text>
                <Text className="text-slate-500 text-xs mt-0.5 flex-row items-center">Verified Property Manager</Text>
              </View>
              <View className="h-10 w-10 bg-amber-100 rounded-full items-center justify-center">
                <MessageCircle size={20} color="#d97706" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View className={`absolute bottom-0 w-full border-t p-5 flex-row justify-between items-center shadow-lg ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`} style={{ paddingBottom: insets.bottom + 20 }}>
          <View>
            <Text className="text-xs text-slate-500 uppercase font-semibold">Price</Text>
            <Text className={`font-bold text-2xl ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(p.price)} <Text className="text-sm font-normal text-slate-500">{p.unit}</Text></Text>
          </View>
          <TouchableOpacity onPress={() => { setCheckoutNights(1); setCheckoutGuests(1); setShowCheckout(true); }} className="bg-amber-500 px-8 py-3.5 rounded-xl shadow-sm">
            <Text className="text-slate-900 font-bold text-lg">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ChatScreen = () => {
    const [chatInput, setChatInput] = useState("");
    const ws = useRef(null);

    useEffect(() => {
      // Connect to WebSocket using user's email
      if (currentUser?.email) {
        const wsUrl = `ws://192.168.1.160:8000/ws/chat/${currentUser.email}`;
        ws.current = new WebSocket(wsUrl);
        
        ws.current.onmessage = (e) => {
          const data = e.data;
          const [sender, msg] = data.split("|", 2);
          if (sender === 'admin') {
            setMessages(prev => [...prev, { sender: 'agent', text: msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
          }
        };
        
        return () => {
          ws.current.close();
        };
      }
    }, [currentUser]);

    const sendMessage = () => {
      if (chatInput.trim().length > 0 && ws.current) {
        // Optimistic UI update
        setMessages(prev => [...prev, { sender: 'user', text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        // Send to backend
        ws.current.send(chatInput);
        setChatInput("");
      }
    };

    return (
      <View className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-white'}`}>
        <View className="pt-16 pb-4 px-5 bg-slate-900 flex-row items-center justify-between shadow-sm z-10">
          <TouchableOpacity onPress={() => setCurrentScreen('details')} className="h-10 w-10 bg-white/10 rounded-full items-center justify-center">
            <ChevronLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View className="flex-row items-center flex-1 ml-4">
            <View className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden mr-3">
              <Image source={{uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a"}} className="h-full w-full" />
            </View>
            <View>
              <Text className="text-white font-bold text-base">Ridgenooks Agent</Text>
              <Text className="text-amber-400 text-xs font-semibold">Online</Text>
            </View>
          </View>
          <TouchableOpacity className="h-10 w-10 bg-white/10 rounded-full items-center justify-center">
            <Phone size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})} className={`flex-1 px-5 pt-6 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <Text className="text-center text-slate-500 text-xs font-semibold mb-6">Today</Text>
            {messages.map((msg, index) => (
              <View key={index} className={`max-w-[80%] mb-4 ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                <View className={`px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-500 rounded-tr-sm' : (userSettings.dark_mode ? 'bg-slate-800 border-slate-700 rounded-tl-sm' : 'bg-white border-slate-200 rounded-tl-sm shadow-sm')}`}>
                  <Text className={`${msg.sender === 'user' ? 'text-slate-900 font-medium' : (userSettings.dark_mode ? 'text-white' : 'text-slate-700')}`}>{msg.text}</Text>
                </View>
                <Text className={`text-[10px] text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</Text>
              </View>
            ))}
          </ScrollView>
          <View className={`p-4 border-t flex-row items-center pb-8 ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <TouchableOpacity className={`h-10 w-10 rounded-full items-center justify-center mr-2 ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Plus size={20} color="#64748b" />
            </TouchableOpacity>
            <TextInput 
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Type a message..." 
              placeholderTextColor="#94a3b8"
              className={`flex-1 h-12 rounded-full px-5 ${userSettings.dark_mode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
            />
            <TouchableOpacity 
              onPress={() => {
                if(chatMessage.trim()) {
                  setMessages([...messages, { id: Date.now(), text: chatMessage, sender: 'user', time: 'Just now' }]);
                  setChatMessage("");
                  setTimeout(() => {
                    setMessages(prev => [...prev, { id: Date.now(), text: "I'll get back to you shortly! Let me check the details.", sender: 'agent', time: 'Just now' }]);
                  }, 1500);
                }
              }} 
              className="h-12 w-12 bg-amber-500 rounded-full items-center justify-center ml-2 shadow-sm"
            >
              <Send size={18} color="#0f172a" className="ml-1" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  const logTransaction = async (ref, amount, gateway) => {
    try {
      const payload = {
        property_id: selectedProperty?.id || 0,
        amount: amount,
        currency: currencySymbol === "$" ? "USD" : "NGN",
        status: "Completed",
        ref: ref || `REF_${Date.now()}`,
        check_in: checkInDate,
        check_out: checkOutDate
      };
      
      const res = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
         console.warn("Backend rejected transaction:", await res.text());
      }
      
      loadUserData(currentUser.email);
    } catch(e) {
      console.error("Failed to log transaction:", e);
    }
  };

  const handleCheckoutClick = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Missing Dates", "Please select a valid check-in and check-out date.");
      return;
    }
    const rawPrice = selectedProperty ? getRawPrice(selectedProperty.price) : 0;
    const subtotal = rawPrice * checkoutNights;
    const fee = currencySymbol === '$' ? 25 : 25000;
    const total = subtotal + fee;

    setShowCheckout(false); 

    setTimeout(() => {
      if (paymentGateway === 'paystack') {
        popup.checkout({
          email: currentUser.email || "test@test.com",
          amount: total, 
          onSuccess: async (res) => {
            const txRef = res?.transactionRef?.reference || res?.reference || `PSTK_${Date.now()}`;
            await logTransaction(txRef, total, "paystack");
            Alert.alert("Success", "Payment Successful!");
            setCurrentScreen('transactions');
          },
          onCancel: () => { Alert.alert("Cancelled", "Payment cancelled."); }
        });
      } else {
        setShowStripeSim(true);
      }
    }, 500);
  };

  const CheckoutOverlay = () => {
    if (!showCheckout || !selectedProperty) return null;
    const p = selectedProperty;
    
    // Dynamic math
    const rawPrice = getRawPrice(p.price);
    const subtotal = rawPrice * checkoutNights;
    const fee = currencySymbol === '$' ? 25 : 25000;
    const total = subtotal + fee;


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
        <TouchableOpacity className="absolute inset-0" onPress={() => setShowCheckout(false)} />
        <View className={`w-full rounded-t-3xl p-6 shadow-2xl ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-white'}`} style={{ paddingBottom: insets.bottom + 20 }}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Booking Configuration</Text>
            <TouchableOpacity onPress={() => setShowCheckout(false)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View className={`p-4 rounded-xl mb-4 flex-row border ${userSettings.dark_mode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <Image source={{uri: p.images[0]}} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1 justify-center">
              <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.title}</Text>
              <Text className="text-slate-500 text-xs mt-1">{p.location}</Text>
            </View>
            <View className="justify-center items-end">
              <Text className={`font-bold text-amber-500`}>{currencySymbol}{getDisplayPrice(p.price)}</Text>
              <Text className="text-slate-500 text-[10px] mt-0.5">/ {p.unit}</Text>
            </View>
          </View>

          {/* Custom Calendar */}
          {renderCalendar()}
          <View className="flex-row justify-between items-center mb-6 px-2">
            <View>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-in</Text>
              <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkInDate ? checkInDate : '--'}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-out</Text>
              <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkOutDate ? checkOutDate : '--'}</Text>
            </View>
          </View>

          <View className={`mb-6 p-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500">Subtotal ({checkoutNights} {checkoutNights === 1 ? 'night' : 'nights'})</Text>
              <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{subtotal.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500">Service Fee</Text>
              <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{fee.toLocaleString()}</Text>
            </View>
            <View className={`flex-row justify-between mt-2 pt-2 border-t ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Total</Text>
              <Text className={`font-bold text-xl text-amber-500`}>{currencySymbol}{total.toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleCheckoutClick} className={`w-full py-4 rounded-xl items-center ${paymentGateway === 'paystack' ? 'bg-[#09A5DB]' : 'bg-[#635BFF]'}`}>
            <View className="flex-row items-center">
              {paymentGateway === 'paystack' ? <CreditCard size={20} color="#fff" className="mr-2" /> : <Lock size={20} color="#fff" className="mr-2" />}
              <Text className="text-white font-bold text-lg">Pay {currencySymbol}{total.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const StripeSimulator = () => {
