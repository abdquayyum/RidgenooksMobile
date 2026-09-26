  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;
    return (
      <View className="absolute inset-0 z-50 justify-end bg-slate-900/60" style={{ elevation: 50 }}>
        <TouchableOpacity className="absolute inset-0" onPress={() => setSelectedTransaction(null)} />
        <View className={`w-full rounded-t-3xl p-6 shadow-2xl ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-white'}`} style={{ paddingBottom: insets.bottom + 40 }}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Transaction Receipt</Text>
            <TouchableOpacity onPress={() => setSelectedTransaction(null)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View className={`items-center py-6 mb-6 rounded-2xl ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <View className="h-16 w-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
              <CheckCircle2 size={32} color="#10b981" />
            </View>
            <Text className={`text-4xl font-bold mb-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{selectedTransaction.amount.toLocaleString()}</Text>
            <Text className="text-emerald-500 font-semibold">{selectedTransaction.status}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">Property</Text>
            <Text className={`font-semibold text-base ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTransaction.property}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">Transaction ID</Text>
            <Text className={`font-semibold text-base ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTransaction.id}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">Date</Text>
            <Text className={`font-semibold text-base ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{selectedTransaction.date}</Text>
          </View>
          
          <TouchableOpacity 
            className="w-full bg-amber-500 py-4 rounded-xl items-center mt-4"
            onPress={() => setSelectedTransaction(null)}
          >
            <Text className="text-white font-bold text-lg">Close Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
