import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function TransactionsScreen() {
      const { userSettings, transactions, setSelectedTransaction, loadUserData, currentUser } = useGlobalState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(currentUser?.email);
    setRefreshing(false);
  };

  return (
    <View className={`flex-1 pt-16 px-5 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center">
        <ChevronLeft size={24} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
        <Text className={`font-bold ml-2 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back</Text>
      </TouchableOpacity>
      <Text className={`text-2xl font-bold mb-6 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction History</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={userSettings?.dark_mode ? '#ffffff' : '#000000'} />}>
        {transactions.length === 0 ? (
          <Text className="text-slate-500 text-center mt-10">No transactions found.</Text>
        ) : (
          transactions.map(txn => (
            <TouchableOpacity 
              key={txn.id} 
              onPress={() => setSelectedTransaction(txn)}
              className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-4 rounded-2xl mb-4 border shadow-sm flex-row justify-between items-center`}
            >
              <View>
                <Text className={`font-bold text-base ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{txn.property_title || `Booking #${txn.id}`}</Text>
                <Text className="text-slate-500 text-xs mt-1">{new Date(txn.date).toLocaleDateString()}</Text>
                <Text className="text-slate-400 text-xs mt-1">Ref: {txn.ref}</Text>
              </View>
              <View className="items-end">
                <Text className={`font-bold text-lg ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>
                  {txn.currency === 'USD' ? '$' : '₦'}{txn.amount.toLocaleString()}
                </Text>
                <View className={`px-2 py-1 rounded-full mt-1 ${txn.status === 'Completed' ? 'bg-green-100' : 'bg-amber-100'}`}>
                  <Text className={`text-[10px] font-bold ${txn.status === 'Completed' ? 'text-green-700' : 'text-amber-700'}`}>{txn.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
