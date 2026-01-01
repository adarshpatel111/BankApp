import { AuthContext } from "@/src/context/AuthContext";
import { ThemeContext } from "@/src/context/ThemeContext";
import { themeColors } from "@/src/utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useContext } from "react";

export default function TabNavigator() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "index")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "cards")
            iconName = focused ? "card" : "card-outline";
          if (route.name === "help")
            iconName = focused ? "help" : "help-outline";
          if (route.name === "more")
            iconName = focused
              ? "ellipsis-horizontal"
              : "ellipsis-horizontal-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "My Accounts" }} />
      <Tabs.Screen name="cards" options={{ title: "Cards" }} />
      <Tabs.Screen name="help" options={{ title: "Help" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}
