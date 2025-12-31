import { AuthContext } from "@/src/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export default function AuthLayout() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
