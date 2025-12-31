import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext, Theme } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import AppScreen from "../components/AppScreen";

export default function ThemeScreen() {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes: Theme[] = ["blue", "orange", "dark"];

  return (
    <AppScreen colors={themeColors[theme]}>
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors[theme].background },
        ]}
      >
        <Text style={[styles.title, { color: themeColors[theme].text }]}>
          Choose Theme
        </Text>

        {themes.map((t) => {
          const active = theme === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTheme(t)}
              style={[
                styles.themeCard,
                {
                  borderColor: active
                    ? themeColors[t].primary
                    : themeColors[theme].border,
                },
              ]}
            >
              <Text style={{ color: themeColors[theme].text, fontSize: 16 }}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  themeCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 14,
  },
});
