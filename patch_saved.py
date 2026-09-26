with open("src/app/(tabs)/saved.tsx", "r") as f:
    content = f.read()

content = content.replace("import React from 'react';", "import React, { useState } from 'react';")
content = content.replace("import { View, Text, ScrollView } from 'react-native';", "import { View, Text, ScrollView, RefreshControl } from 'react-native';")

old_hook = "const { userSettings, properties, savedPropertyIds } = useGlobalState();"
new_hook = """  const { userSettings, properties, savedPropertyIds, loadUserData, currentUser } = useGlobalState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(currentUser?.email);
    setRefreshing(false);
  };"""
content = content.replace(old_hook, new_hook)

content = content.replace("<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>", "<ScrollView contentContainerStyle={{ paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={userSettings?.dark_mode ? '#ffffff' : '#000000'} />}>")

with open("src/app/(tabs)/saved.tsx", "w") as f:
    f.write(content)
print("Refresh added to saved")
