import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useGlobalState } from '../../context/GlobalStateContext';
import PropertyCard from '../../components/PropertyCard';

export default function SavedScreen() {
    const { userSettings, properties, savedPropertyIds, loadUserData, currentUser } = useGlobalState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(currentUser?.email);
    setRefreshing(false);
  };
  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <View className={`flex-1 pt-16 px-5 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Text className={`text-2xl font-bold mb-6 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Saved Properties</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={userSettings?.dark_mode ? '#ffffff' : '#000000'} />}>
        {savedProperties.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <Heart size={48} color="#cbd5e1" className="mb-4" />
            <Text className="text-slate-500">No saved properties yet.</Text>
          </View>
        ) : (
          savedProperties.map(property => <PropertyCard key={property.id} property={property} />)
        )}
      </ScrollView>
    </View>
  );
}
