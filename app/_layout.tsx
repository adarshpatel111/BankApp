import { AuthContext, AuthProvider } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
