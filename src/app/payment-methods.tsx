import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, CreditCard } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function PaymentMethodsScreen() {
    const { userSettings } = useGlobalState();

  return (
    <View className={`flex-1 pt-16 px-5 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center">
        <ChevronLeft size={24} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
        <Text className={`font-bold ml-2 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back</Text>
      </TouchableOpacity>
      
      <Text className={`text-2xl font-bold mb-6 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Payment Methods</Text>
      
      <View className="flex-1 items-center justify-center mb-10">
        <CreditCard size={48} color="#cbd5e1" className="mb-4" />
        <Text className="text-slate-500 text-center font-medium">No saved cards.</Text>
      </View>

      <View className="absolute bottom-10 left-5 right-5">
        <TouchableOpacity className="flex-row items-center justify-center py-4 rounded-xl bg-amber-500 shadow-sm">
          <Plus size={20} color="#ffffff" />
          <Text className="text-white font-bold text-lg ml-2">Add New Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
