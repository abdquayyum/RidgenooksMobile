with open("src/app/(tabs)/index.tsx", "r") as f:
    content = f.read()

# Fix the extra <View className="px-5"> issue
content = content.replace('<View className="mt-6 mb-2">\n          <View className="px-5">', '<View className="mt-6 mb-2">')

# Add px-5 wrapper just around the Featured Properties header and the cards list
old_featured = """          <View className="flex-row justify-between items-end mb-4">
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
        </View>"""

new_featured = """        <View className="px-5">
          <View className="flex-row justify-between items-end mb-4 mt-4">
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
        </View>"""

content = content.replace(old_featured, new_featured)

with open("src/app/(tabs)/index.tsx", "w") as f:
    f.write(content)
