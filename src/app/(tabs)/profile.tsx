import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Camera, Lock, User, Settings, ChevronRight, FileText, LogOut, Phone, CreditCard } from 'lucide-react-native';
import { useGlobalState } from '../../context/GlobalStateContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { userSettings, currentUser, setCurrentUser, setIsAuthenticated, insets, logout } = useGlobalState();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setCurrentUser({ ...currentUser, image: result.assets[0].uri });
    }
  };

  return (
    <View className={`flex-1 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ paddingTop: (insets?.top || 40) + 30 }} className="bg-slate-900 pb-12 px-6 items-center rounded-b-3xl shadow-md">
          <View className="relative mb-6">
            <View className="h-24 w-24 rounded-full border-4 border-amber-500 overflow-hidden">
              {currentUser?.image ? <Image source={{uri: currentUser.image}} className="h-full w-full" /> : <View className="flex-1 items-center justify-center bg-slate-800"><User size={40} color="#94a3b8" /></View>}
            </View>
            <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-0 h-8 w-8 bg-amber-500 rounded-full border-2 border-slate-900 items-center justify-center">
              <Camera size={14} color="#0f172a" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-white mb-2">{currentUser?.name}</Text>
          <Text className="text-slate-400 text-base">{currentUser?.email}</Text>
        </View>
        <View className="p-5">

          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Account</Text>
          <View className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl border mb-6 overflow-hidden shadow-sm`}>
            <TouchableOpacity onPress={() => router.push('/settings')} className={`flex-row items-center justify-between p-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><Settings size={18} color="#64748b" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Settings</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/transactions')} className={`flex-row items-center justify-between p-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><FileText size={18} color="#64748b" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction History</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/payment-methods')} className={`flex-row items-center justify-between p-4 ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><CreditCard size={18} color="#64748b" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Payment Methods</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Logistics & Support</Text>
          <View className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl border mb-6 overflow-hidden shadow-sm`}>
            <TouchableOpacity onPress={() => router.push('/chat')} className={`flex-row items-center justify-between p-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-blue-50 rounded-full items-center justify-center mr-3"><Phone size={18} color="#3b82f6" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Live Support</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/requests')} className={`flex-row items-center justify-between p-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-amber-50 rounded-full items-center justify-center mr-3"><FileText size={18} color="#d97706" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>My Requests</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => { await logout(); }} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center"><View className="h-10 w-10 bg-red-50 rounded-full items-center justify-center mr-3"><LogOut size={18} color="#ef4444" /></View><Text className="font-semibold text-red-500 text-sm">Log Out</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
