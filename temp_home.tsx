  const HomeScreen = () => {
    return (
      <View className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="pt-16 pb-6 px-5 bg-slate-900 rounded-b-3xl">
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                <Text className="text-slate-400 text-xs mb-0.5">Location</Text>
                <View className="flex-row items-center">
                  <MapPin size={14} color="#f59e0b" />
                  <Text className="text-white font-semibold ml-1 text-sm">{activeLocation}</Text>
                  <ChevronDown size={14} color="#94a3b8" className="ml-1" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')} className="h-10 w-10 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <Image source={{uri: currentUser.image}} className="h-full w-full" />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-white mb-4">Find your perfect place.</Text>
            <View className="flex-row bg-slate-800 rounded-xl items-center px-4 py-3 border border-slate-700">
              <Search size={20} color="#94a3b8" />
              <TextInput placeholderTextColor="#94a3b8" placeholder="Search properties..." value={searchQuery} onChangeText={setSearchQuery} className="text-white ml-2 flex-1 h-6 p-0" />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 px-5 py-2 h-16">
            {CATEGORIES.map(cat => {
              const isActive = activeTab === cat;
              return (
                <TouchableOpacity key={cat} onPress={() => setActiveTab(cat)} className={`px-5 py-2.5 rounded-full mr-3 border ${isActive ? 'bg-amber-500 border-amber-500' : (userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')}`}>
                  <Text className={`${isActive ? 'text-slate-900' : (userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600')} font-medium`}>{cat}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          <View className="mt-6 px-5">
            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className={`text-lg font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'All' ? 'Featured Properties' : `${activeTab} Listings`}</Text>
                <Text className="text-sm font-semibold text-slate-500">{filteredProperties.length} found</Text>
              </View>
            </View>
            {filteredProperties.length === 0 ? (
               <View className="py-10 items-center justify-center">
                 <Search size={48} color="#cbd5e1" className="mb-4" />
                 <Text className="text-slate-500">No properties found.</Text>
               </View>
            ) : (
              filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const LogisticsScreen = () => {
