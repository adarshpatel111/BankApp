import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useState } from "react";
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "../components/AppScreen";
import { Theme, ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function AppSettingsScreen() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const colors = themeColors[theme];
  const navigation = useNavigation<any>();

  const themes: Theme[] = ["blue", "orange", "dark"];

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  return (
    <AppScreen colors={colors}>
      <ScrollView style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Settings
          </Text>
        </View>

        {/* Section */}
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>
          GENERAL
        </Text>

        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          colors={colors}
          onPress={() => {}}
        />

        <SettingItem
          icon="person-outline"
          label="Account"
          colors={colors}
          onPress={() => {}}
        />

        {/* Theme Section */}
        <Text
          style={[styles.sectionTitle, { color: colors.muted, marginTop: 28 }]}
        >
          APPEARANCE
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleDropdown}
          >
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.value, { color: colors.muted }]}>
                {theme.toUpperCase()}
              </Text>
            </View>
            <View style={styles.themeDotRow}>
              <View
                style={[
                  styles.themeDot,
                  { backgroundColor: themeColors[theme].primary },
                ]}
              />
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.muted}
              />
            </View>
          </TouchableOpacity>

          {open && (
            <View style={styles.dropdownList}>
              {themes.map((t) => {
                const active = theme === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTheme(t);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: active ? "700" : "500",
                      }}
                    >
                      {t.toUpperCase()}
                    </Text>
                    <View
                      style={[
                        styles.themeDot,
                        { backgroundColor: themeColors[t].primary },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function SettingItem({ icon, label, onPress, colors }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor: colors.card }]}
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={[styles.itemText, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 0.6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 13,
    marginTop: 2,
  },
  dropdownList: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  themeDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
