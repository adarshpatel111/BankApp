import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import * as ImagePicker from "expo-image-picker";
import AppScreen from "../components/AppScreen";
import api from "../api/api";

export default function ProfileScreen() {
  const { user, token, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!user) return null;

  const changePassword = async () => {
    try {
      await api.post(
        "/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Password updated");
      setOldPassword("");
      setNewPassword("");
    } catch {
      Alert.alert("Error", "Failed to update password");
    }
  };

  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    const res = await ImagePicker.launchImageLibraryAsync();
    if (!res.canceled) Alert.alert("Avatar selected");
  };

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={{ uri: user.avatar || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />

        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={{ color: colors.muted }}>{user.username}</Text>

        <TouchableOpacity onPress={pickImage}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Change Avatar
          </Text>
        </TouchableOpacity>

        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Change Password
          </Text>

          <TextInput
            placeholder="Old Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />

          <TextInput
            placeholder="New Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={changePassword}
          >
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={logout}>
          <Text style={[styles.logout, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
  },
  link: {
    marginTop: 8,
    fontWeight: "500",
  },
  section: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  logout: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "600",
  },
});
