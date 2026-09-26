import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Truck, Box, ShieldCheck, ChevronLeft, ArrowRight, X } from 'lucide-react-native';
import { useGlobalState } from '../../context/GlobalStateContext';

const LOGO_TRANSPARENT_SRC = require('../../../assets/logo_transparent.png');

const LOGISTICS_SERVICES = [
  { id: 1, title: "Moving & Relocation", icon: Truck, desc: "Seamless home and office moving services." },
  { id: 2, title: "Construction Materials", icon: Box, desc: "Site delivery for building materials." },
  { id: 3, title: "Legal & Surveying", icon: ShieldCheck, desc: "Land verification and legal documentation." },
];

export default function LogisticsScreen() {
    const { 
    userSettings, insets, showLogisticsForm, setShowLogisticsForm, 
    selectedService, setSelectedService, logOrigin, setLogOrigin, 
    logDest, setLogDest, logDate, setLogDate, logDetails, setLogDetails, 
    submittingLogistics, setSubmittingLogistics, API_URL, getAuthHeader, 
    loadUserData, currentUser 
  } = useGlobalState();

  const handleOpenForm = (service) => {
    setSelectedService(service);
    setLogOrigin(""); setLogDest(""); setLogDate(""); setLogDetails("");
    setShowLogisticsForm(true);
  };

  const submitLogisticsRequest = async () => {
    if(!logOrigin) { Alert.alert("Error", "Origin is required."); return; }
    setSubmittingLogistics(true);
    try {
      await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ 
          service: selectedService.title,
          origin: logOrigin,
          destination: logDest,
          date_pref: logDate,
          details: logDetails
        })
      });
      Alert.alert("Success", `${selectedService.title} request submitted successfully!`);
      setShowLogisticsForm(false);
      loadUserData(currentUser.email);
      router.push('/requests');
    } catch(e) {
      Alert.alert("Error", "Error connecting to server.");
    }
    setSubmittingLogistics(false);
  };

  return (
    <View className={`flex-1 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="pt-16 pb-6 px-5 bg-slate-900 rounded-b-3xl">
          <View className="items-center justify-center mb-6 mt-4">
            <Image source={LOGO_TRANSPARENT_SRC} className="h-28 w-28" resizeMode="contain" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2 text-center">Ridgenooks Logistics</Text>
          <Text className="text-slate-300 text-sm text-center px-4">Complete solutions for property management, moving, and land acquisition.</Text>
        </View>
        <View className="p-5">
          <Text className={`font-bold text-lg mb-6 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Our Services</Text>
          {LOGISTICS_SERVICES.map(service => (
            <TouchableOpacity key={service.id} onPress={() => handleOpenForm(service)} className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-5 rounded-2xl mb-6 border flex-row items-start shadow-md`}>
              <View className="h-14 w-14 bg-amber-100 rounded-xl items-center justify-center mr-5">
                <service.icon size={28} color="#d97706" />
              </View>
              <View className="flex-1 justify-center">
                <Text className={`font-bold text-lg mb-1 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{service.title}</Text>
                <Text className={`text-sm mb-3 leading-relaxed ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>{service.desc}</Text>
                <View className="flex-row items-center">
                  <Text className="text-sm font-bold text-amber-500 uppercase tracking-wider">Request Service</Text>
                  <ArrowRight size={16} color="#f59e0b" className="ml-2" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showLogisticsForm} transparent animationType="slide">
        <View className="flex-1 justify-end bg-slate-900/80">
          <View className={`w-full rounded-t-[40px] p-8 shadow-2xl ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-white'}`} style={{ paddingBottom: (insets?.bottom || 0) + 20 }}>
            <View className="flex-row justify-between items-center mb-8">
              <Text className={`text-2xl font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Request {selectedService?.title}</Text>
              <TouchableOpacity onPress={() => setShowLogisticsForm(false)} className={`h-10 w-10 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <X size={24} color={userSettings?.dark_mode ? '#cbd5e1' : '#64748b'} />
              </TouchableOpacity>
            </View>
            
            <View className="mb-8">
              <TextInput value={logOrigin} onChangeText={setLogOrigin} placeholderTextColor="#94a3b8" placeholder="Pickup/Origin Address" className={`w-full border rounded-2xl px-5 py-5 mb-5 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              <TextInput value={logDest} onChangeText={setLogDest} placeholderTextColor="#94a3b8" placeholder="Dropoff/Destination (Optional)" className={`w-full border rounded-2xl px-5 py-5 mb-5 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              <TextInput value={logDate} onChangeText={setLogDate} placeholderTextColor="#94a3b8" placeholder="Preferred Date (DD/MM/YYYY)" className={`w-full border rounded-2xl px-5 py-5 mb-5 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
              <TextInput value={logDetails} onChangeText={setLogDetails} placeholderTextColor="#94a3b8" placeholder="Additional Details..." multiline numberOfLines={3} className={`w-full border rounded-2xl px-5 py-5 h-32 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
            </View>

            <TouchableOpacity onPress={submitLogisticsRequest} disabled={submittingLogistics} className="w-full bg-amber-500 py-5 rounded-2xl items-center">
              {submittingLogistics ? <ActivityIndicator color="#0f172a" /> : <Text className="text-slate-900 font-bold text-xl">Submit Request</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
