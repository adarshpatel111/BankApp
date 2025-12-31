import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "../components/AppScreen";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function CustomerProfileUpdate() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];
  const navigation = useNavigation<any>();

  if (!user) return null;

  const formatDob = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const [firstName] = useState(user.FirstName || "");
  const [middleName] = useState(user.MiddleName || "");
  const [lastName] = useState(user.LastName || "");
  const [dob, setDob] = useState(formatDob(user.Dob || ""));
  const [address, setAddress] = useState(user.Address || "");

  const getReadOnlyStyle = (colors: any) => ({
    borderColor: colors.border,
    color: colors.muted,
    backgroundColor: colors.card,
  });

  const onSave = async () => {
    try {
      const payload = {
        customerId: user.CustomerId,
        dob, // FIXED (lowercase)
        address,
      };

      // await api.put("/customer/profile", payload);

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to update profile");
    }
  };

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Customer Profile Update
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* Customer ID */}
          <Text style={[styles.label, { color: colors.text }]}>
            Customer ID
          </Text>
          <TextInput
            value={user.CustomerId}
            editable={false}
            style={[styles.input, getReadOnlyStyle(colors)]}
          />

          {/* First Name */}
          <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
          <TextInput
            value={firstName}
            editable={false}
            style={[styles.input, getReadOnlyStyle(colors)]}
          />

          {/* Middle Name */}
          <Text style={[styles.label, { color: colors.text }]}>
            Middle Name
          </Text>
          <TextInput
            value={middleName}
            editable={false}
            style={[styles.input, getReadOnlyStyle(colors)]}
          />

          {/* Last Name */}
          <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
          <TextInput
            value={lastName}
            editable={false}
            style={[styles.input, getReadOnlyStyle(colors)]}
          />

          {/* DOB (editable) */}
          <Text style={[styles.label, { color: colors.text }]}>
            Date of Birth
          </Text>
          <TextInput
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.muted}
            editable={false}
            style={[
              styles.input,
              getReadOnlyStyle(colors),
              { borderColor: colors.border },
            ]}
          />

          {/* Address (editable) */}
          <Text style={[styles.label, { color: colors.text }]}>Address</Text>
          <TextInput
            value={address as string}
            onChangeText={setAddress}
            multiline
            style={[
              styles.input,
              styles.textArea,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onSave}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 14,
  },

  form: { flex: 1 },

  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },

  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  button: {
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
