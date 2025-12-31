import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
} from "react-native";
import { ThemeContext, Theme } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import AppScreen from "../components/AppScreen";

export default function SettingsScreen() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const colors = themeColors[theme];

  const themes: Theme[] = ["blue", "orange", "dark"];
  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };
  return (
    <AppScreen colors={colors}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          General Settings
        </Text>

        {/* Example setting: Notifications */}
        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => alert("Notification settings")}
          colors={colors}
        />

        {/* Example setting: Account */}
        <SettingItem
          icon="person-outline"
          label="Account"
          onPress={() => alert("Account settings")}
          colors={colors}
        />

        {/* Example setting: Theme Selection */}
        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 30 }]}
        >
          Theme
        </Text>
        <View style={styles.DropDowncontainer}>
          {/* Dropdown Header */}
          <TouchableOpacity
            onPress={toggleDropdown}
            style={[styles.dropdownHeader, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {theme.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Dropdown Options */}
          {open &&
            themes.map((t) => {
              const active = theme === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTheme(t)}
                  style={[
                    styles.dropdownItem,
                    {
                      borderColor: colors.border,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                  ]}
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
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: "50%",
                      backgroundColor: themeColors[t].primary,
                      marginRight: 12,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function SettingItem({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={[styles.settingText, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  settingText: { fontSize: 16, marginLeft: 12, flex: 1 },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  DropDowncontainer: {
    width: "100%",
    marginTop: 10,
  },
  dropdownHeader: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
  },
});
