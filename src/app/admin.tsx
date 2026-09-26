import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function AdminDashboardScreen() {
    const { userSettings, API_URL, getAuthHeader } = useGlobalState();
  const [adminTab, setAdminTab] = useState('properties');
  const [adminRequests, setAdminRequests] = useState([]);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Short Stay");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("night");
  const [country, setCountry] = useState("Nigeria");
  const [exactLoc, setExactLoc] = useState("");
  const [description, setDescription] = useState("");
  const [beds, setBeds] = useState("1");
  const [baths, setBaths] = useState("1");
  const [sqft, setSqft] = useState("1000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (adminTab === 'logistics') {
      fetch(`${API_URL}/api/admin/requests`, { headers: getAuthHeader() })
        .then(res => res.json())
        .then(data => setAdminRequests(data))
        .catch(e => console.error(e));
    }
  }, [adminTab]);

  const handleCreateProperty = async () => {
    if (!title || !price || !country || !exactLoc) {
      Alert.alert("Error", "Please fill required fields (Title, Price, Country, Exact Location).");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      title, category, price: parseFloat(price), unit, 
      location: `${exactLoc}, ${country}`, 
      description, beds: parseInt(beds), baths: parseInt(baths), 
      sqft: parseInt(sqft), images: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
    };

    try {
      const res = await fetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if(res.ok) {
        Alert.alert("Success", "Property posted globally!");
        setTitle(""); setPrice(""); setExactLoc(""); setDescription("");
      } else {
        Alert.alert("Error", "Failed to post property.");
      }
    } catch(e) {
      Alert.alert("Error", "Server error.");
    }
    setIsSubmitting(false);
  };

  return (
    <View className={`flex-1 pt-16 px-5 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 bg-slate-200 rounded-full items-center justify-center mr-3">
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Admin Panel</Text>
      </View>

      <View className="flex-row mb-6 bg-slate-200 rounded-xl p-1">
        <TouchableOpacity onPress={() => setAdminTab('properties')} className={`flex-1 py-3 rounded-lg items-center ${adminTab === 'properties' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`font-bold ${adminTab === 'properties' ? 'text-slate-900' : 'text-slate-500'}`}>Post Property</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAdminTab('logistics')} className={`flex-1 py-3 rounded-lg items-center ${adminTab === 'logistics' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`font-bold ${adminTab === 'logistics' ? 'text-slate-900' : 'text-slate-500'}`}>Logistics</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {adminTab === 'properties' ? (
          <View>
            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Property Title</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Luxury Villa" className={`h-12 px-4 rounded-xl mb-4 border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Category</Text><TextInput value={category} onChangeText={setCategory} className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="flex-1 mx-1"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Price</Text><TextInput value={price} onChangeText={setPrice} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="flex-1 ml-2"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Unit</Text><TextInput value={unit} onChangeText={setUnit} className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
            </View>

            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Country (Categorization)</Text>
            <View className="flex-row mb-4">
              {['Nigeria', 'USA', 'UK', 'UAE'].map(c => (
                <TouchableOpacity key={c} onPress={() => setCountry(c)} className={`px-4 py-2 rounded-full mr-2 border ${country === c ? 'bg-blue-500 border-blue-500' : (userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-200')}`}>
                  <Text className={country === c ? 'text-white font-bold' : (userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-600')}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Exact Location (City, Area)</Text>
            <TextInput value={exactLoc} onChangeText={setExactLoc} placeholder="e.g. Lekki Phase 1" className={`h-12 px-4 rounded-xl mb-4 border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Beds</Text><TextInput value={beds} onChangeText={setBeds} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="flex-1 mx-1"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Baths</Text><TextInput value={baths} onChangeText={setBaths} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="flex-1 ml-2"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Sqft</Text><TextInput value={sqft} onChangeText={setSqft} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
            </View>

            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Description</Text>
            <TextInput value={description} onChangeText={setDescription} multiline placeholder="Describe the property..." className={`h-24 px-4 py-3 rounded-xl mb-6 border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />

            <TouchableOpacity onPress={handleCreateProperty} disabled={isSubmitting} className="h-14 bg-amber-500 rounded-xl items-center justify-center shadow-sm flex-row">
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <><Plus size={20} color="#fff" className="mr-2" /><Text className="text-white font-bold text-lg">Post Live Property</Text></>}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {adminRequests.length === 0 ? <Text className="text-slate-500 text-center mt-10">No logistics requests globally.</Text> : adminRequests.map(req => (
              <View key={req.id} className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-4 rounded-2xl mb-4 border shadow-sm`}>
                <View className="flex-row justify-between mb-2">
                  <Text className={`font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>{req.type}</Text>
                  <Text className="text-amber-500 font-semibold text-xs">{req.status}</Text>
                </View>
                <Text className={`text-xs ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>User: <Text className="font-bold">{req.user}</Text></Text>
                <Text className={`text-xs ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>From: {req.origin || 'N/A'}</Text>
                <Text className={`text-xs ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>To: {req.destination || 'N/A'}</Text>
                <Text className={`text-xs ${userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Date: {req.date}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
