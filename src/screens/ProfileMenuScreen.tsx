import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "../components/AppScreen";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function ProfileMenuScreen() {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];
  const navigation = useNavigation<any>();

  if (!user) return null;

  const MenuItem = ({
    label,
    icon,
    onPress,
  }: {
    label: string;
    icon: any;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={[styles.menuText, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </TouchableOpacity>
  );

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerLeft}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user.FirstName} {user.MiddleName} {user.LastName}
            </Text>
            <Text style={{ color: colors.muted }}>
              Customer ID: {user.CustomerId}
            </Text>
          </View>

          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatar}>
                {user.FirstName.toUpperCase().charAt(0)}
                {user.LastName.toUpperCase().charAt(0)}
              </Text>
            )}
          </View>
        </View>

        {/* MENU LIST */}
        <MenuItem
          label="Customer Profile Update"
          icon="person-circle-outline"
          onPress={() => router.push("/customer-profile")}
        />
        <MenuItem
          label="Contact Details"
          icon="call-outline"
          onPress={() => router.push("/customer-contact-details")}
        />

        <View style={styles.menuContainer}>
          <MenuItem
            label="Change Login PIN"
            icon="key-outline"
            onPress={() => router.push("/change-password")}
          />

          <MenuItem
            label="App Settings"
            icon="settings-outline"
            onPress={() => router.push("/app-settings")}
          />
        </View>

        {/* LOGOUT AT BOTTOM */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.border }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={22} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerLeft: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },

  avatarContainer: {
    borderRadius: 25,
    overflow: "hidden",
  },
  avatar: {
    width: 45,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff",
  },

  /* MENU */
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  menuText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
  },

  /* LOGOUT */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
