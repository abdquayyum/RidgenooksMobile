import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, Edit2, Trash2 } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';

export default function AdminDashboardScreen() {
  const { userSettings, API_URL, getAuthHeader, refreshProperties, properties, currencySymbol, getDisplayPrice } = useGlobalState();
  const [adminTab, setAdminTab] = useState('manage'); // manage, create, logistics
  const [adminRequests, setAdminRequests] = useState([]);
  
  // Form fields
  const [editingId, setEditingId] = useState(null);
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

  const loadEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setPrice(p.price.toString());
    setUnit(p.unit);
    // Split location: "Exact Location, Country"
    const parts = p.location.split(', ');
    if (parts.length > 1) {
      setCountry(parts.pop());
      setExactLoc(parts.join(', '));
    } else {
      setCountry("Nigeria");
      setExactLoc(p.location);
    }
    setDescription(p.description || "");
    setBeds(p.beds?.toString() || "1");
    setBaths(p.baths?.toString() || "1");
    setSqft(p.sqft?.toString() || "1000");
    setAdminTab('create');
  };

  const handleDelete = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this property?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          const res = await fetch(`${API_URL}/api/properties/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
          });
          if(res.ok) {
            Alert.alert("Success", "Property deleted.");
            refreshProperties();
          } else {
            Alert.alert("Error", "Failed to delete.");
          }
        } catch(e) {
          Alert.alert("Error", "Server error.");
        }
      }}
    ]);
  };

  const handleCreateOrUpdate = async () => {
    if (!title || !price || !country || !exactLoc) {
      Alert.alert("Error", "Please fill required fields (Title, Price, Country, Exact Location).");
      return;
    }
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        // UPDATE (using FormData because that's how we structured the endpoints)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('unit', unit);
        formData.append('location', `${exactLoc}, ${country}`);
        formData.append('description', description);
        formData.append('beds', beds);
        formData.append('baths', baths);
        formData.append('sqft', sqft);

        const res = await fetch(`${API_URL}/api/properties/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: formData
        });

        if(res.ok) {
          Alert.alert("Success", "Property updated!");
          setEditingId(null);
          refreshProperties();
          setAdminTab('manage');
        } else {
          Alert.alert("Error", "Failed to update property.");
        }
      } else {
        // CREATE
        const payload = {
          title, category, price: parseFloat(price), unit, 
          location: `${exactLoc}, ${country}`, 
          description, beds: parseInt(beds), baths: parseInt(baths), 
          sqft: parseInt(sqft), images: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
        };
        const res = await fetch(`${API_URL}/api/properties`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        });
        if(res.ok) {
          Alert.alert("Success", "Property posted globally!");
          refreshProperties();
          setAdminTab('manage');
        } else {
          Alert.alert("Error", "Failed to post property.");
        }
      }
      // Reset
      setTitle(""); setPrice(""); setExactLoc(""); setDescription(""); setEditingId(null);
    } catch(e) {
      Alert.alert("Error", "Server error.");
    }
    setIsSubmitting(false);
  };

  return (
    <View className={`flex-1 pt-16 px-4 ${userSettings?.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 bg-slate-200 rounded-full items-center justify-center mr-3">
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Admin Panel</Text>
      </View>

      <View className="flex-row mb-6 bg-slate-200 rounded-xl p-1 flex-wrap">
        <TouchableOpacity onPress={() => setAdminTab('manage')} className={`flex-1 min-w-[30%] py-3 rounded-lg items-center ${adminTab === 'manage' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`font-bold text-xs ${adminTab === 'manage' ? 'text-slate-900' : 'text-slate-500'}`}>Manage</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setEditingId(null); setTitle(""); setPrice(""); setExactLoc(""); setDescription(""); setAdminTab('create'); }} className={`flex-1 min-w-[30%] py-3 rounded-lg items-center ${adminTab === 'create' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`font-bold text-xs ${adminTab === 'create' ? 'text-slate-900' : 'text-slate-500'}`}>Post New</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAdminTab('logistics')} className={`flex-1 min-w-[30%] py-3 rounded-lg items-center ${adminTab === 'logistics' ? 'bg-white shadow-sm' : ''}`}>
          <Text className={`font-bold text-xs ${adminTab === 'logistics' ? 'text-slate-900' : 'text-slate-500'}`}>Logistics</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {adminTab === 'manage' && (
          <View>
            {properties.length === 0 ? <Text className="text-slate-500 text-center mt-10">No properties available.</Text> : properties.map(p => (
              <View key={p.id} className={`${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-4 rounded-2xl mb-4 border shadow-sm flex-row items-center`}>
                <Image source={{ uri: p.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" }} className="w-16 h-16 rounded-xl mr-3" />
                <View className="flex-1">
                  <Text className={`font-bold text-sm mb-1 ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>{p.title}</Text>
                  <Text className="text-amber-500 font-semibold text-xs">{currencySymbol}{getDisplayPrice(p.price)}</Text>
                </View>
                <View className="flex-row">
                  <TouchableOpacity onPress={() => loadEdit(p)} className="h-10 w-10 bg-blue-50 rounded-full items-center justify-center mr-2">
                    <Edit2 size={18} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(p.id)} className="h-10 w-10 bg-red-50 rounded-full items-center justify-center">
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {adminTab === 'create' && (
          <View>
            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">{editingId ? 'Edit Title' : 'Property Title'}</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Luxury Villa" className={`h-12 px-4 rounded-xl mb-4 border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
            
            {/* Made responsive by changing to column layout on mobile */}
            <View className="mb-4">
              <View className="mb-3"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Category</Text><TextInput value={category} onChangeText={setCategory} className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="mb-3"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Price</Text><TextInput value={price} onChangeText={setPrice} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="mb-3"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Unit</Text><TextInput value={unit} onChangeText={setUnit} className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
            </View>

            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Country</Text>
            <View className="flex-row mb-4 flex-wrap">
              {['Nigeria', 'USA', 'UK', 'UAE'].map(c => (
                <TouchableOpacity key={c} onPress={() => setCountry(c)} className={`px-4 py-2 rounded-full mr-2 mb-2 border ${country === c ? 'bg-blue-500 border-blue-500' : (userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-200')}`}>
                  <Text className={country === c ? 'text-white font-bold' : (userSettings?.dark_mode ? 'text-slate-400' : 'text-slate-600')}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Exact Location (City, Area)</Text>
            <TextInput value={exactLoc} onChangeText={setExactLoc} placeholder="e.g. Lekki Phase 1" className={`h-12 px-4 rounded-xl mb-4 border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />

            {/* Made responsive by stacking vertically instead of row */}
            <View className="mb-4">
              <View className="mb-3"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Beds</Text><TextInput value={beds} onChangeText={setBeds} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="mb-3"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Baths</Text><TextInput value={baths} onChangeText={setBaths} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
              <View className="mb-3"><Text className="text-slate-500 text-xs mb-1 uppercase font-bold">Sqft</Text><TextInput value={sqft} onChangeText={setSqft} keyboardType="numeric" className={`h-12 px-4 rounded-xl border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} /></View>
            </View>

            <Text className="text-slate-500 text-xs mb-1 uppercase font-bold tracking-wider">Description</Text>
            <TextInput value={description} onChangeText={setDescription} multiline placeholder="Describe the property..." className={`h-24 px-4 py-3 rounded-xl mb-6 border ${userSettings?.dark_mode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />

            <TouchableOpacity onPress={handleCreateOrUpdate} disabled={isSubmitting} className="h-14 bg-amber-500 rounded-xl items-center justify-center shadow-sm flex-row">
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <><Edit2 size={20} color="#fff" className="mr-2" /><Text className="text-white font-bold text-lg">{editingId ? 'Update Property' : 'Post Live Property'}</Text></>}
            </TouchableOpacity>
          </View>
        )}

        {adminTab === 'logistics' && (
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
