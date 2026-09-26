import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useGlobalState } from '../context/GlobalStateContext';
import { ChevronLeft, Phone, Paperclip, Send } from 'lucide-react-native';

export default function ChatScreen() {
    const { userSettings, currentUser, messages, setMessages, chatInput, setChatInput } = useGlobalState();
  const scrollViewRef = useRef();
  const ws = useRef(null);

  useEffect(() => {
    if (currentUser?.email) {
      // ws url hardcoded for local test logic, matching the previous logic
      const wsUrl = `wss://api.ridgenooksinc.com/ws/chat/${currentUser.email}`;
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onmessage = (e) => {
        const data = e.data;
        const [sender, msg] = data.split("|", 2);
        if (sender === 'admin') {
          setMessages(prev => [...prev, { sender: 'agent', text: msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        }
      };
      
      return () => {
        ws.current.close();
      };
    }
  }, [currentUser]);

  const sendMessage = () => {
    if (chatInput.trim().length > 0 && ws.current) {
      setMessages(prev => [...prev, { sender: 'user', text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      ws.current.send(chatInput);
      setChatInput("");
    }
  };

  return (
    <View className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-white'}`}>
      <View className="pt-16 pb-4 px-5 bg-slate-900 flex-row items-center justify-between shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 bg-white/10 rounded-full items-center justify-center">
          <ChevronLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View className="flex-row items-center flex-1 ml-4">
          <View className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden mr-3">
            <Image source={{uri: "https://images.unsplash.com/photo-1560250097-0b93528c311a"}} style={{height: '100%', width: '100%'}} />
          </View>
          <View>
            <Text className="text-white font-bold text-base">Ridgenooks Agent</Text>
            <Text className="text-amber-400 text-xs font-semibold">Online</Text>
          </View>
        </View>
        <TouchableOpacity className="h-10 w-10 bg-white/10 rounded-full items-center justify-center">
          <Phone size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})} className={`flex-1 px-5 pt-6 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <Text className="text-center text-slate-500 text-xs font-semibold mb-6">Today</Text>
          {messages.map((msg, index) => (
            <View key={index} className={`max-w-[80%] mb-4 ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
              <View className={`px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-500 rounded-tr-sm' : (userSettings.dark_mode ? 'bg-slate-800 border-slate-700 rounded-tl-sm' : 'bg-white border-slate-200 rounded-tl-sm shadow-sm')}`}>
                <Text className={`${msg.sender === 'user' ? 'text-slate-900 font-medium' : (userSettings.dark_mode ? 'text-white' : 'text-slate-700')}`}>{msg.text}</Text>
              </View>
              <Text className={`text-[10px] text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View className={`px-5 py-4 flex-row items-center border-t ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <TouchableOpacity className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3">
            <Paperclip size={18} color="#64748b" />
          </TouchableOpacity>
          <View className={`flex-1 h-12 rounded-full px-4 justify-center ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <TextInput 
              placeholder="Type a message..." 
              placeholderTextColor="#94a3b8" 
              className={`flex-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} 
              value={chatInput}
              onChangeText={setChatInput}
            />
          </View>
          <TouchableOpacity onPress={sendMessage} className="h-12 w-12 bg-amber-500 rounded-full items-center justify-center ml-3 shadow-md">
            <Send size={18} color="#ffffff" className="ml-1" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
