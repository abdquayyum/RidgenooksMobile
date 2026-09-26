import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Redirect } from 'expo-router';
import { useGlobalState } from '../context/GlobalStateContext';

const LOGO_TRANSPARENT_SRC = require('../../assets/logo_transparent.png');

export default function AuthScreen() {
  const { isAuthenticated, setIsAuthenticated, setAuthToken, API_URL, setCurrentUser } = useGlobalState();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSubmit = async () => {
    if (!email || !password || (isRegister && (!name || !phone || !confirmPassword))) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (isRegister && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const res = await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Registration failed');
        Alert.alert('Success', 'Account created! Please sign in with your details.');
        setIsRegister(false); // Switch to login view
        setPassword(''); // Clear password for security
        setConfirmPassword('');
      } else {
        
        const res = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');
        setAuthToken(data.access_token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);

      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-slate-950" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View className="items-center mb-8">
          <Image source={LOGO_TRANSPARENT_SRC} style={{ width: 150, height: 150 }} resizeMode="contain" />
          <Text className="text-3xl font-bold text-white mt-4">Welcome to Ridgenooks</Text>
          <Text className="text-slate-400 mt-2 text-center">Your premium destination for seamless bookings and logistics.</Text>
        </View>

        <View className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
          {isRegister && (
            <View className="mb-4">
              <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Full Name</Text>
              <TextInput value={name} onChangeText={setName} placeholderTextColor="#94a3b8" placeholder="John Doe" className="h-14 px-4 bg-slate-950 rounded-xl text-white border border-slate-800" />
            </View>
          )}
          {isRegister && (
            <View className="mb-4">
              <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Phone Number</Text>
              <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#94a3b8" placeholder="+1234567890" className="h-14 px-4 bg-slate-950 rounded-xl text-white border border-slate-800" />
            </View>
          )}
          <View className="mb-4">
            <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Email Address</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#94a3b8" placeholder="john@example.com" className="h-14 px-4 bg-slate-950 rounded-xl text-white border border-slate-800" />
          </View>
          <View className="mb-4">
            <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Password</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#94a3b8" placeholder="••••••••" className="h-14 px-4 bg-slate-950 rounded-xl text-white border border-slate-800" />
          </View>
          {isRegister && (
            <View className="mb-6">
              <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Confirm Password</Text>
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholderTextColor="#94a3b8" placeholder="••••••••" className="h-14 px-4 bg-slate-950 rounded-xl text-white border border-slate-800" />
            </View>
          )}
          <TouchableOpacity onPress={handleSubmit} disabled={loading} className={`h-14 bg-amber-500 rounded-xl items-center justify-center shadow-md ${!isRegister ? 'mt-2' : ''}`}>
            {loading ? <ActivityIndicator color="#0f172a" /> : <Text className="text-slate-900 font-bold text-lg">{isRegister ? 'Create Account' : 'Sign In'}</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)} className="mt-8 items-center">
          <Text className="text-slate-400">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <Text className="text-amber-500 font-bold">{isRegister ? 'Sign In' : 'Register'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
