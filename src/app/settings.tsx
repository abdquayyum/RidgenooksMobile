import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function SettingsScreen() {
  const { userSettings, setUserSettings, detectLocation, currencySymbol, setCurrencySymbol, setPaymentGateway } = useGlobalState();
  const handleUpdateSettings = (key, val) => setUserSettings({ ...userSettings, [key]: val });

  const handleCurrencyChange = (curr) => {
    if (curr === 'NGN') {
      setCurrencySymbol('₦');
      setPaymentGateway('paystack');
    } else {
      setCurrencySymbol('$');
      setPaymentGateway('stripe');
    }
  };

  return (
    <View className={`flex-1 pt-16 px-5 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center">
        <ChevronLeft size={24} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
        <Text className={`font-bold ml-2 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Back</Text>
      </TouchableOpacity>
      <Text className={`text-2xl font-bold mb-6 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Settings</Text>
      <View className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl border overflow-hidden shadow-sm p-4`}>
        
        {/* Currency Toggle */}
        <View className={`flex-row justify-between items-center py-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
          <Text className={`font-semibold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-700'}`}>Currency</Text>
          <View className={`flex-row rounded-lg p-1 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <TouchableOpacity onPress={() => handleCurrencyChange('NGN')} className={`px-4 py-1.5 rounded-md ${currencySymbol === '₦' ? (userSettings?.dark_mode ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm') : ''}`}>
              <Text className={`text-xs font-bold ${currencySymbol === '₦' ? (userSettings?.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>NGN (₦)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCurrencyChange('USD')} className={`px-4 py-1.5 rounded-md ${currencySymbol === '$' ? (userSettings?.dark_mode ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm') : ''}`}>
              <Text className={`text-xs font-bold ${currencySymbol === '$' ? (userSettings?.dark_mode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>USD ($)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className={`flex-row justify-between items-center py-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
          <Text className={`font-semibold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-700'}`}>Push Notifications</Text>
          <Switch 
            value={userSettings?.push_notifications} 
            onValueChange={(val) => handleUpdateSettings("push_notifications", val)} 
            trackColor={{ true: '#f59e0b' }} 
          />
        </View>
        <View className={`flex-row justify-between items-center py-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
          <Text className={`font-semibold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-700'}`}>Location Services</Text>
          <Switch 
            value={userSettings?.location_services} 
            onValueChange={(val) => {
              handleUpdateSettings("location_services", val);
              if(val) detectLocation();
            }} 
            trackColor={{ true: '#f59e0b' }} 
          />
        </View>
        <View className="flex-row justify-between items-center py-4">
          <Text className={`font-semibold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-700'}`}>Dark Mode</Text>
          <Switch 
            value={userSettings?.dark_mode} 
            onValueChange={(val) => handleUpdateSettings("dark_mode", val)} 
            trackColor={{ true: '#f59e0b' }} 
          />
        </View>
      </View>
    </View>
  );
}
