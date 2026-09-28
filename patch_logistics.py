import sys

with open('src/app/(tabs)/logistics.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';", 
    "import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';"
)

old_modal = """      <Modal visible={showLogisticsForm} transparent animationType="slide">
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
      </Modal>"""

new_modal = """      <Modal visible={showLogisticsForm} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="flex-1"
        >
          <View className="flex-1 justify-end bg-slate-900/80">
            <View className={`w-full max-h-[85%] rounded-t-[40px] p-8 shadow-2xl ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-white'}`} style={{ paddingBottom: (insets?.bottom || 0) + 20 }}>
              <View className="flex-row justify-between items-center mb-8">
                <Text className={`text-2xl font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Request {selectedService?.title}</Text>
                <TouchableOpacity onPress={() => setShowLogisticsForm(false)} className={`h-10 w-10 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <X size={24} color={userSettings?.dark_mode ? '#cbd5e1' : '#64748b'} />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View className="mb-8">
                  <TextInput value={logOrigin} onChangeText={setLogOrigin} placeholderTextColor="#94a3b8" placeholder="Pickup/Origin Address" className={`w-full border rounded-2xl px-5 py-5 mb-5 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  <TextInput value={logDest} onChangeText={setLogDest} placeholderTextColor="#94a3b8" placeholder="Dropoff/Destination (Optional)" className={`w-full border rounded-2xl px-5 py-5 mb-5 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  <TextInput value={logDate} onChangeText={setLogDate} placeholderTextColor="#94a3b8" placeholder="Preferred Date (DD/MM/YYYY)" className={`w-full border rounded-2xl px-5 py-5 mb-5 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                  <TextInput value={logDetails} onChangeText={setLogDetails} placeholderTextColor="#94a3b8" placeholder="Additional Details..." multiline numberOfLines={3} style={{ textAlignVertical: 'top' }} className={`w-full border rounded-2xl px-5 py-5 h-32 text-base ${userSettings?.dark_mode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
                </View>

                <TouchableOpacity onPress={submitLogisticsRequest} disabled={submittingLogistics} className="w-full bg-amber-500 py-5 rounded-2xl items-center mb-4">
                  {submittingLogistics ? <ActivityIndicator color="#0f172a" /> : <Text className="text-slate-900 font-bold text-xl">Submit Request</Text>}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>"""

if old_modal in content:
    content = content.replace(old_modal, new_modal)
    with open('src/app/(tabs)/logistics.tsx', 'w') as f:
        f.write(content)
    print("Patched logistics.tsx successfully!")
else:
    print("Could not find old modal in logistics.tsx.")
