  const LocationPickerModal = () => {
    if (!showLocationModal) return null;
    const locations = ["Auto", "All Locations", "Lagos, Nigeria", "Abuja, Nigeria", "New York, USA", "London, UK", "Dubai, UAE"];
    
    return (
      <View className="absolute inset-0 z-50 justify-end bg-slate-900/60" style={{ elevation: 50 }}>
        <TouchableOpacity className="absolute inset-0" onPress={() => setShowLocationModal(false)} />
        <View className={`w-full rounded-t-3xl p-6 shadow-2xl ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-white'}`} style={{ paddingBottom: insets.bottom + 20 }}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Select Location</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            {locations.map((loc, idx) => {
              const isSelected = selectedLocationFilter === loc;
              return (
                <TouchableOpacity 
                  key={idx}
                  onPress={() => {
                    setSelectedLocationFilter(loc);
                    setShowLocationModal(false);
                    // Also attempt to set currency based on location string
                    if (loc.includes('Nigeria') || (loc === 'Auto' && userLocationText.includes('Nigeria'))) {
                      setCurrencySymbol('₦');
                      setPaymentGateway('paystack');
                    } else if (loc !== 'All Locations') {
                      setCurrencySymbol('$');
                      setPaymentGateway('stripe');
                    }
                  }}
                  className={`py-4 flex-row items-center justify-between border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}
                >
                  <View className="flex-row items-center">
                    <MapPin size={20} color={isSelected ? '#f59e0b' : '#94a3b8'} className="mr-3" />
                    <Text className={`font-medium text-lg ${isSelected ? (userSettings.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
                      {loc === 'Auto' ? `Auto (${userLocationText})` : loc}
                    </Text>
                  </View>
                  {isSelected && <View className="h-3 w-3 rounded-full bg-amber-500" />}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </View>
    );
  };
