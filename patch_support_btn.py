with open("src/app/index.tsx", "r") as f:
    content = f.read()

old_requests_btn = """<TouchableOpacity onPress={() => setCurrentScreen('requests')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>"""

new_support_btn = """<TouchableOpacity onPress={() => router.push('/chat')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-blue-50 rounded-full items-center justify-center mr-3"><Phone size={18} color="#3b82f6" /></View><Text className={`font-semibold text-sm ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Live Support</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreen('requests')} className={`flex-row items-center justify-between p-4 border-b ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>"""

content = content.replace(old_requests_btn, new_support_btn)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
