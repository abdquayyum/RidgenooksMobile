with open("src/app/(tabs)/profile.tsx", "r") as f:
    content = f.read()

import re

# We need to import CreditCard from lucide-react-native if not there
if "CreditCard" not in content:
    content = content.replace("Phone }", "Phone, CreditCard }")

old_account = """            <TouchableOpacity onPress={() => router.push('/transactions')} className={`flex-row items-center justify-between p-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><FileText size={18} color="#64748b" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction History</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>"""

new_account = """            <TouchableOpacity onPress={() => router.push('/transactions')} className={`flex-row items-center justify-between p-4 border-b ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><FileText size={18} color="#64748b" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction History</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/payment-methods')} className={`flex-row items-center justify-between p-4 ${userSettings?.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row items-center"><View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3"><CreditCard size={18} color="#64748b" /></View><Text className={`font-semibold text-sm ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Payment Methods</Text></View>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>"""

content = content.replace(old_account, new_account)

with open("src/app/(tabs)/profile.tsx", "w") as f:
    f.write(content)
print("Profile patched!")
