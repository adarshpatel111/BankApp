import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../utils/themeColors";

export default function AppScreen({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <>
      <StatusBar
        barStyle={
          colors.background === "#0F172A" ? "light-content" : "dark-content"
        }
        backgroundColor={colors.primary}
      />

      <SafeAreaView style={{ backgroundColor: colors.primary }} />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
