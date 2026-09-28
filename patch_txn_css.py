import sys

with open('src/app/transactions.tsx', 'r') as f:
    content = f.read()

# Fix the Close Icon contrast
old_close_icon = "<TouchableOpacity onPress={() => setSelectedTxn(null)} className={`h-10 w-10 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>"
new_close_icon = "<TouchableOpacity onPress={() => setSelectedTxn(null)} className={`h-10 w-10 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-700' : 'bg-slate-200'}`}>"
if old_close_icon in content:
    content = content.replace(old_close_icon, new_close_icon)

# Wait, the cancel icon in transactions modal is actually:
old_modal_close = """<TouchableOpacity onPress={() => setSelectedTxn(null)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                  <X size={20} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
                </TouchableOpacity>"""
new_modal_close = """<TouchableOpacity onPress={() => setSelectedTxn(null)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <X size={20} color={userSettings?.dark_mode ? '#ffffff' : '#0f172a'} />
                </TouchableOpacity>"""
if old_modal_close in content:
    content = content.replace(old_modal_close, new_modal_close)

# Fix the Bottom Button contrast
old_bottom_button = """<TouchableOpacity 
                  onPress={() => setSelectedTxn(null)} 
                  className="mt-8 h-14 bg-slate-900 dark:bg-white rounded-2xl items-center justify-center shadow-lg"
                >
                  <Text className={`font-bold text-lg ${userSettings?.dark_mode ? 'text-slate-900' : 'text-white'}`}>Close Receipt</Text>
                </TouchableOpacity>"""
new_bottom_button = """<TouchableOpacity 
                  onPress={() => setSelectedTxn(null)} 
                  className={`mt-8 h-14 rounded-2xl items-center justify-center shadow-lg ${userSettings?.dark_mode ? 'bg-white' : 'bg-slate-900'}`}
                >
                  <Text className={`font-bold text-lg ${userSettings?.dark_mode ? 'text-slate-900' : 'text-white'}`}>Close Receipt</Text>
                </TouchableOpacity>"""
if old_bottom_button in content:
    content = content.replace(old_bottom_button, new_bottom_button)

with open('src/app/transactions.tsx', 'w') as f:
    f.write(content)
print("CSS patched!")
