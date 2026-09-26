with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# I will add an Amenities section and Host section right after Overview
old_overview = """          <Text className={`font-bold text-lg mb-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Overview</Text>
          <Text className={`text-sm leading-relaxed mb-6 ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>{p.description}</Text>
        </View>"""

new_overview = """          <Text className={`font-bold text-lg mb-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Overview</Text>
          <Text className={`text-sm leading-relaxed mb-6 ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>{p.description}</Text>

          {/* Amenities Section */}
          <Text className={`font-bold text-lg mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Amenities</Text>
          <View className="flex-row flex-wrap mb-6">
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Fast Wi-Fi</Text></View>
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Free Parking</Text></View>
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Swimming Pool</Text></View>
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Air Conditioning</Text></View>
          </View>

          {/* Host Section */}
          <Text className={`font-bold text-lg mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Hosted by</Text>
          <View className="flex-row items-center mb-6">
            <Image source={{uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'}} className="w-12 h-12 rounded-full mr-3" />
            <View>
              <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>RidgeNooks Management</Text>
              <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Joined in 2024 • Superhost</Text>
            </View>
          </View>
        </View>"""

content = content.replace(old_overview, new_overview)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Details patched!")
