with open("src/components/PropertyCard.tsx", "r") as f:
    content = f.read()

old_details = """        <View className="flex-row items-center mt-1 mb-3">
          <MapPin size={14} color="#64748b" />
          <Text className={`text-sm ml-1 ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{property.location}</Text>
        </View>
        <Text"""

new_details = """        <View className="flex-row items-center mt-1 mb-2">
          <MapPin size={14} color="#64748b" />
          <Text className={`text-sm ml-1 ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{property.location}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <View className="flex-row items-center mr-4 bg-slate-100 px-2 py-1 rounded-md"><Text className="text-slate-700 text-xs font-bold mr-1">{property.beds}</Text><Text className="text-slate-500 text-xs">Beds</Text></View>
          <View className="flex-row items-center mr-4 bg-slate-100 px-2 py-1 rounded-md"><Text className="text-slate-700 text-xs font-bold mr-1">{property.baths}</Text><Text className="text-slate-500 text-xs">Baths</Text></View>
          <View className="flex-row items-center bg-slate-100 px-2 py-1 rounded-md"><Text className="text-slate-700 text-xs font-bold mr-1">{property.sqft}</Text><Text className="text-slate-500 text-xs">sqft</Text></View>
        </View>
        <Text"""

content = content.replace(old_details, new_details)

with open("src/components/PropertyCard.tsx", "w") as f:
    f.write(content)
print("PropertyCard patched!")
