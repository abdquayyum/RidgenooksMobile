  const ProfileScreen = () => (
    <View className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="bg-slate-900 pt-16 pb-8 px-5 items-center rounded-b-3xl">
          <View className="relative mb-4">
            <View className="h-24 w-24 rounded-full border-4 border-amber-500 overflow-hidden">
              <Image source={{uri: currentUser.image}} className="h-full w-full" />
            </View>
            <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-0 h-8 w-8 bg-amber-500 rounded-full border-2 border-slate-900 items-center justify-center">
              <Camera size={14} color="#0f172a" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-white">{currentUser.name}</Text>
          <Text className="text-slate-400 text-sm">{currentUser.email}</Text>
        </View>
        <View className="p-5">
          <Text className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-3 mt-2">Admin Tools</Text>
          <View className={`${userSettings.dark_mode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl border mb-6 overflow-hidden shadow-sm`}>
            <TouchableOpacity onPress={() => setCurrentScreen("admin")} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center"><View className="h-10 w-10 bg-amber-100 rounded-full items-center justify-center mr-3"><Lock size={18} color="#d97706" /></View><Text className={`font-bold text-sm ${userSettings.dark_mode ? "text-amber-500" : "text-amber-600"}`}>Admin Dashboard</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Account</Text>
          <View className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl border mb-6 overflow-hidden shadow-sm`}>
            <TouchableOpacity onPress={() => setCurrentScreen('payment_methods')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><Wallet size={18} color="#475569" /></View><Text className={`font-semibold text-sm ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Payment Methods</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreen('transactions')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><Clock size={18} color="#475569" /></View><Text className={`font-semibold text-sm ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction History</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreen('settings')} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><Settings size={18} color="#475569" /></View><Text className={`font-semibold text-sm ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Settings</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Logistics & Support</Text>
          <View className={`${userSettings.dark_mode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl border mb-6 overflow-hidden shadow-sm`}>
            <TouchableOpacity onPress={() => router.push('/chat')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-blue-50 rounded-full items-center justify-center mr-3"><Phone size={18} color="#3b82f6" /></View><Text className={`font-semibold text-sm ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Live Support</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreen('requests')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-amber-50 rounded-full items-center justify-center mr-3"><FileText size={18} color="#d97706" /></View><Text className={`font-semibold text-sm ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>My Requests</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIsAuthenticated(false); setCurrentScreen('home'); }} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center"><View className="h-10 w-10 bg-red-50 rounded-full items-center justify-center mr-3"><LogOut size={18} color="#ef4444" /></View><Text className="font-semibold text-red-500 text-sm">Log Out</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
