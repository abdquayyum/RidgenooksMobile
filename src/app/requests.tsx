import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Truck } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function RequestsScreen() {
    const { userSettings, requests } = useGlobalState();

  return (
    <View className={`flex-1 pt-16 px-5 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center">
        <ChevronLeft size={24} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
        <Text className={`font-bold ml-2 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back</Text>
      </TouchableOpacity>
      <Text className={`text-2xl font-bold mb-6 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>My Requests</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {requests.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Truck size={48} color="#cbd5e1" className="mb-4" />
            <Text className="text-slate-500 text-center">No active logistics requests.</Text>
          </View>
        ) : (
          requests.map(req => (
            <View key={req.id} className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-5 rounded-2xl mb-4 border shadow-sm`}>
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className={`font-bold text-lg ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{req.service}</Text>
                  <Text className="text-slate-500 text-xs">{new Date(req.created_at).toLocaleDateString()}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${req.status === 'Pending' ? 'bg-amber-100' : 'bg-green-100'}`}>
                  <Text className={`text-[10px] font-bold ${req.status === 'Pending' ? 'text-amber-700' : 'text-green-700'}`}>{req.status}</Text>
                </View>
              </View>
              <View className="mb-2">
                <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Origin</Text>
                <Text className={`${userSettings?.dark_mode ? 'text-slate-300' : 'text-slate-700'}`}>{req.origin}</Text>
              </View>
              {req.destination && (
                <View className="mb-2">
                  <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Destination</Text>
                  <Text className={`${userSettings?.dark_mode ? 'text-slate-300' : 'text-slate-700'}`}>{req.destination}</Text>
                </View>
              )}
              {req.date_pref && (
                <View>
                  <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Preferred Date</Text>
                  <Text className={`${userSettings?.dark_mode ? 'text-slate-300' : 'text-slate-700'}`}>{req.date_pref}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
