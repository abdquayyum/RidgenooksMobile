import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { MapPin, ChevronDown, Search, Filter, User } from 'lucide-react-native';
import { useGlobalState } from '../../context/GlobalStateContext';
import PropertyCard from '../../components/PropertyCard';

export default function HomeScreen() {
    const { 
    userSettings, currentUser, activeLocation, setShowLocationModal, 
    searchQuery, setSearchQuery, activeTab, setActiveTab, filteredProperties,
    insets
  } = useGlobalState();

  const categories = ["All", "Apartments", "Villas", "Lofts", "Penthouses", "Studios"];

  return (
    <View className={`flex-1 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ paddingTop: (insets?.top || 40) + 30 }} className="pb-10 px-6 bg-slate-900 rounded-b-3xl shadow-md">
          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity onPress={() => setShowLocationModal(true)}>
              <Text className="text-slate-400 text-xs mb-0.5">Location</Text>
              <View className="flex-row items-center">
                <MapPin size={14} color="#f59e0b" />
                <Text className="text-white font-semibold ml-1 text-sm">{activeLocation}</Text>
                <ChevronDown size={14} color="#94a3b8" className="ml-1" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')} className="h-10 w-10 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              {currentUser?.image ? <Image source={{uri: currentUser.image}} style={{width:"100%", height:"100%"}} /> : <View className="flex-1 items-center justify-center bg-slate-800"><User size={20} color="#94a3b8" /></View>}
            </TouchableOpacity>
          </View>
          <Text className="text-3xl font-bold text-white mb-6 mt-2">Find your perfect place.</Text>
          <View className="flex-row bg-slate-800 rounded-xl items-center px-5 py-4 border border-slate-700">
            <Search size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Search properties or locations..." 
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-white font-medium"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View className="h-8 w-px bg-slate-700 mx-3" />
            <TouchableOpacity><Filter size={20} color="#f59e0b" /></TouchableOpacity>
          </View>
        </View>

                <View className="mt-6 mb-2">
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
