import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Search, Filter, X, MapPin, Calendar, Clock, CreditCard, Hash } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function TransactionsScreen() {
  const { userSettings, transactions, loadUserData, currentUser, properties } = useGlobalState();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Completed, Pending, Failed
  const [selectedTxn, setSelectedTxn] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(currentUser?.email);
    setRefreshing(false);
  };

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(txn => {
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch = 
        String(txn.ref || txn.id || '').toLowerCase().includes(q) || 
        String(txn.property_title || '').toLowerCase().includes(q) ||
        String(txn.amount || '').includes(q);
        
      const matchesFilter = activeFilter === 'All' || (txn.status || '').toLowerCase() === (activeFilter || '').toLowerCase();
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [transactions, searchQuery, activeFilter]);

  const FILTERS = ['All', 'Completed', 'Pending', 'Failed'];

  const parseDate = (d) => new Date(d);
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed' || s === 'success') return { bg: 'bg-green-100', text: 'text-green-700' };
    if (s === 'pending') return { bg: 'bg-amber-100', text: 'text-amber-700' };
    if (s === 'failed') return { bg: 'bg-red-100', text: 'text-red-700' };
    return { bg: 'bg-slate-100', text: 'text-slate-700' };
  };


  return (
    <View className={`flex-1 pt-14 ${userSettings?.dark_mode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <View className="px-5 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-slate-800/10 dark:bg-white/10">
          <ChevronLeft size={24} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
        </TouchableOpacity>
        <Text className={`text-3xl font-black tracking-tight ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transactions</Text>
      </View>

      <View className="px-5 mb-4">
        <View className={`flex-row items-center h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <Search size={18} color="#94a3b8" />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by ref, title, or amount..."
            placeholderTextColor="#94a3b8"
            className={`flex-1 ml-3 h-full font-medium ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}
          />
        </View>
      </View>

      <View className="px-5 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {FILTERS.map(filter => (
            <TouchableOpacity 
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`mr-2 px-4 py-2 rounded-full border ${activeFilter === filter ? 'bg-amber-500 border-amber-500' : (userSettings?.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')}`}
            >
              <Text className={`font-bold ${activeFilter === filter ? 'text-slate-950' : (userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-600')}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={userSettings?.dark_mode ? '#ffffff' : '#000000'} />}>
        {filteredTransactions.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
              <Search size={32} color="#94a3b8" />
            </View>
            <Text className={`text-lg font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>No Transactions</Text>
            <Text className="text-slate-500 text-center mt-2 px-6">We couldn't find any transactions matching your filters.</Text>
          </View>
        ) : (
          filteredTransactions.map(txn => {
            const colors = getStatusColor(txn.status);
            return (
              <TouchableOpacity 
                key={txn.id} 
                onPress={() => setSelectedTxn(txn)}
                activeOpacity={0.7}
                className={`${userSettings?.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-5 rounded-3xl mb-4 border shadow-sm`}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 mr-4">
                    <Text className={`font-bold text-lg leading-tight mb-1 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{txn.property_title || `Booking #${txn.ref || txn.id}`}</Text>
                    <View className="flex-row items-center">
                      <Clock size={12} color="#94a3b8" />
                      <Text className="text-slate-400 text-xs ml-1">{parseDate(txn.date).toLocaleDateString()} • {parseDate(txn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className={`font-black text-xl tracking-tight ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>
                      {txn.currency === 'USD' ? '$' : '₦'}{txn.amount.toLocaleString()}
                    </Text>
                    <View className={`px-2 py-1 rounded-md mt-1 ${colors.bg}`}>
                      <Text className={`text-[10px] font-black uppercase tracking-wider ${colors.text}`}>{txn.status}</Text>
                    </View>
                  </View>
                </View>
                <View className={`pt-3 border-t flex-row items-center justify-between ${userSettings?.dark_mode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <Text className="text-slate-400 text-xs font-medium">Ref: {txn.ref || txn.id}</Text>
                  <Text className="text-amber-500 text-xs font-bold">View Details →</Text>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>

      {/* Transaction Details Modal */}
      <Modal visible={!!selectedTxn} animationType="slide" transparent>
        {selectedTxn && (
          <View className="flex-1 justify-end bg-slate-950/60">
            <View className={`w-full h-[85%] rounded-t-[40px] shadow-2xl p-6 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-white'}`}>
              <View className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full self-center mb-6" />
              
              <View className="flex-row justify-between items-center mb-6">
                <Text className={`text-2xl font-black tracking-tight ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Receipt</Text>
                <TouchableOpacity onPress={() => setSelectedTxn(null)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <X size={20} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                <View className={`items-center justify-center py-8 rounded-3xl mb-6 ${userSettings?.dark_mode ? 'bg-slate-950 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                  <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total Amount Paid</Text>
                  <Text className={`text-5xl font-black tracking-tighter ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedTxn.currency === 'USD' ? '$' : '₦'}{selectedTxn.amount.toLocaleString()}
                  </Text>
                  <View className={`mt-4 px-3 py-1.5 rounded-lg ${getStatusColor(selectedTxn.status).bg}`}>
                    <Text className={`text-xs font-black uppercase tracking-wider ${getStatusColor(selectedTxn.status).text}`}>{selectedTxn.status}</Text>
                  </View>
                </View>

                <Text className={`text-sm font-black uppercase tracking-widest mb-4 ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-400'}`}>Booking Information</Text>
                
                <View className={`rounded-3xl p-5 mb-6 ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <View className="flex-row items-center mb-4">
                    <View className="h-10 w-10 rounded-full bg-amber-500/20 items-center justify-center mr-4">
                      <MapPin size={20} color="#d97706" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-400 text-xs font-bold mb-1">Property</Text>
                      <Text className={`font-bold text-base ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTxn.property_title || 'Unknown Property'}</Text>
                    </View>
                  </View>

                  {selectedTxn.check_in && selectedTxn.check_out && (
                    <View className="flex-row items-center mb-4">
                      <View className="h-10 w-10 rounded-full bg-blue-500/20 items-center justify-center mr-4">
                        <Calendar size={20} color="#3b82f6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-400 text-xs font-bold mb-1">Stay Dates</Text>
                        <Text className={`font-bold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>
                          {parseDate(selectedTxn.check_in).toLocaleDateString()} - {parseDate(selectedTxn.check_out).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 rounded-full bg-purple-500/20 items-center justify-center mr-4">
                      <CreditCard size={20} color="#a855f7" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-400 text-xs font-bold mb-1">Payment Method</Text>
                      <Text className={`font-bold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>
                        {String(selectedTxn.id).startsWith('pi_') ? 'Stripe Checkout' : 'Paystack Checkout'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text className={`text-sm font-black uppercase tracking-widest mb-4 ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-400'}`}>Transaction Details</Text>
                
                <View className={`rounded-3xl p-5 ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <View className={`flex-row justify-between py-3 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <Text className="text-slate-400 font-medium">Reference ID</Text>
                    <Text className={`font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTxn.ref || selectedTxn.id}</Text>
                  </View>
                  <View className={`flex-row justify-between py-3 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <Text className="text-slate-400 font-medium">Date</Text>
                    <Text className={`font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{parseDate(selectedTxn.date).toLocaleDateString()}</Text>
                  </View>
                  <View className="flex-row justify-between py-3">
                    <Text className="text-slate-400 font-medium">Time</Text>
                    <Text className={`font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{parseDate(selectedTxn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={() => setSelectedTxn(null)} 
                  className={`mt-8 h-14 rounded-2xl items-center justify-center shadow-lg ${userSettings?.dark_mode ? 'bg-white' : 'bg-slate-900'}`}
                >
                  <Text className={`font-bold text-lg ${userSettings?.dark_mode ? 'text-slate-900' : 'text-white'}`}>Close Receipt</Text>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
