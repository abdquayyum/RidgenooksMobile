import { Tabs } from "expo-router";
import { Home, Search, Truck, Heart, User } from "lucide-react-native";
import { useGlobalState } from "../../context/GlobalStateContext";
import { View, Text } from "react-native";

export default function TabLayout() {
  const { userSettings, insets } = useGlobalState();
  const isDark = userSettings?.dark_mode;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1e293b" : "#f1f5f9",
          height: 70 + (insets?.bottom || 0),
          paddingBottom: (insets?.bottom || 0) + 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: isDark ? "#ffffff" : "#0f172a",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logistics"
        options={{
          title: "Logistics",
          tabBarIcon: ({ color }) => <Truck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
