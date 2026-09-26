with open("src/app/(tabs)/index.tsx", "r") as f:
    content = f.read()

# We know the top part is fine up to `        <View className="mt-6 mb-2">`
idx = content.find('<View className="mt-6 mb-2">')
if idx != -1:
    top_part = content[:idx]
    bottom_part = """        <View className="mt-6 mb-2">
          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setActiveTab(cat)}
                className={`mr-3 px-6 py-2.5 rounded-full ${activeTab === cat ? 'bg-amber-500 border-amber-500' : (userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')} border shadow-sm`}
              >
                <Text className={`font-bold text-sm ${activeTab === cat ? 'text-slate-900' : (userSettings?.dark_mode ? 'text-slate-300' : 'text-slate-600')}`}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Properties list */}
          <View className="px-5 mt-4">
            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className={`text-lg font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'All' ? 'Featured Properties' : `${activeTab} Listings`}</Text>
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
        </View>
      </ScrollView>
    </View>
  );
}
"""
    with open("src/app/(tabs)/index.tsx", "w") as f:
        f.write(top_part + bottom_part)
    print("Fixed syntax in index.tsx")
