  const PropertyCard = ({ property }) => (
    <TouchableOpacity onPress={() => { setSelectedProperty(property); setCurrentScreen('details'); }} className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl overflow-hidden mb-5 border shadow-sm`}>
      <Image source={{uri: property.images[0]}} className="w-full h-48" />
      <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full">
        <Text className="text-slate-900 text-xs font-bold">{property.category}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleSaved(property)} className="absolute top-3 right-3 h-10 w-10 bg-white/90 rounded-full items-center justify-center">
        <Heart size={20} color={savedPropertyIds.includes(property.id) ? "#ef4444" : "#94a3b8"} className={savedPropertyIds.includes(property.id) ? "fill-red-500" : ""} />
      </TouchableOpacity>
      <View className="p-4">
        <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{property.title}</Text>
        <View className="flex-row items-center mt-1 mb-3">
          <MapPin size={14} color="#64748b" />
          <Text className={`text-sm ml-1 ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{property.location}</Text>
        </View>
        <Text className={`font-bold text-xl ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(property.price)} <Text className={`text-sm font-normal ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{property.unit}</Text></Text>
      </View>
    </TouchableOpacity>
  );
