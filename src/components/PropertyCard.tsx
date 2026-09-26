import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Heart, MapPin } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function PropertyCard({ property }) {
    const { userSettings, currencySymbol, getDisplayPrice, setSelectedProperty, savedPropertyIds, setSavedPropertyIds, API_URL, getAuthHeader } = useGlobalState();
  const isSaved = savedPropertyIds.includes(property.id);

  const toggleSaved = async (p) => {
    try {
      const res = await fetch(`${API_URL}/api/saved`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ property_id: p.id })
      });
      if (res.ok) {
        if (isSaved) setSavedPropertyIds(prev => prev.filter(id => id !== p.id));
        else setSavedPropertyIds(prev => [...prev, p.id]);
      }
    } catch(e) {
      console.warn(e);
    }
  };

  return (
    <TouchableOpacity onPress={() => { setSelectedProperty(property); router.push(`/property/${property.id}`); }} className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl overflow-hidden mb-5 border shadow-sm`}>
      <Image source={{uri: property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"}} className="w-full h-48" />
      <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full">
        <Text className="text-slate-900 text-xs font-bold">{property.category}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleSaved(property)} className="absolute top-3 right-3 h-10 w-10 bg-white/90 rounded-full items-center justify-center">
        <Heart size={20} color={isSaved ? "#ef4444" : "#94a3b8"} fill={isSaved ? "#ef4444" : "transparent"} />
      </TouchableOpacity>
      <View className="p-4">
        <Text className={`font-bold text-lg ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{property.title}</Text>
        <View className="flex-row items-center mt-1 mb-2">
          <MapPin size={14} color="#64748b" />
          <Text className={`text-sm ml-1 ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{property.location}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <View className="flex-row items-center mr-4 bg-slate-100 px-2 py-1 rounded-md"><Text className="text-slate-700 text-xs font-bold mr-1">{property.beds}</Text><Text className="text-slate-500 text-xs">Beds</Text></View>
          <View className="flex-row items-center mr-4 bg-slate-100 px-2 py-1 rounded-md"><Text className="text-slate-700 text-xs font-bold mr-1">{property.baths}</Text><Text className="text-slate-500 text-xs">Baths</Text></View>
          <View className="flex-row items-center bg-slate-100 px-2 py-1 rounded-md"><Text className="text-slate-700 text-xs font-bold mr-1">{property.sqft}</Text><Text className="text-slate-500 text-xs">sqft</Text></View>
        </View>
        <Text className={`font-bold text-xl ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(property.price)} <Text className={`text-sm font-normal ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{property.unit}</Text></Text>
      </View>
    </TouchableOpacity>
  );
}
