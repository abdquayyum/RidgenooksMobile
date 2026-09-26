import re

with open("src/app/transactions.tsx", "r") as f:
    content = f.read()

content = content.replace("import { View, Text, ScrollView, TouchableOpacity } from 'react-native';", "import React, { useState } from 'react';\nimport { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';")
content = content.replace("import React from 'react';\n", "")

old_hook = "const { userSettings, transactions, setSelectedTransaction } = useGlobalState();"
new_hook = """  const { userSettings, transactions, setSelectedTransaction, loadUserData, currentUser } = useGlobalState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(currentUser?.email);
    setRefreshing(false);
  };"""
content = content.replace(old_hook, new_hook)

content = content.replace("<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>", "<ScrollView contentContainerStyle={{ paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={userSettings?.dark_mode ? '#ffffff' : '#000000'} />}>")

with open("src/app/transactions.tsx", "w") as f:
    f.write(content)
print("Refresh added to transactions")
