import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api/api";
import AppScreen from "../components/AppScreen";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function ChangeLoginPIN() {
  const { token } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];
  const navigation = useNavigation<any>();

  const [oldPIN, setOldPIN] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const handleChangePIN = async () => {
    if (!oldPIN || !newPIN || !confirmPIN) {
      return Alert.alert("Error", "All fields are required.");
    }

    if (newPIN !== confirmPIN) {
      return Alert.alert("Error", "New PIN and confirmation do not match.");
    }

    try {
      const response = await api.post(
        "/change-login-pin",
        { oldPIN, newPIN },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Login PIN changed successfully.");
        setOldPIN("");
        setNewPIN("");
        setConfirmPIN("");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to change PIN.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Change Login PIN
          </Text>
        </View>

        {/* Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <PinInput
            label="Current PIN"
            value={oldPIN}
            onChange={setOldPIN}
            colors={colors}
          />

          <PinInput
            label="New PIN"
            value={newPIN}
            onChange={setNewPIN}
            colors={colors}
          />

          <PinInput
            label="Confirm New PIN"
            value={confirmPIN}
            onChange={setConfirmPIN}
            colors={colors}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleChangePIN}
          >
            <Text style={styles.buttonText}>Update PIN</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.note, { color: colors.muted }]}>
          Your PIN must be numeric and confidential. Do not share it with
          anyone.
        </Text>
      </View>
    </AppScreen>
  );
}

function PinInput({ label, value, onChange, colors }: any) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.muted, marginBottom: 6 }}>{label}</Text>

      <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          keyboardType="numeric"
          maxLength={6}
          style={[styles.inputField, { color: colors.text }]}
          placeholder="••••••"
          placeholderTextColor={colors.muted}
        />

        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  inputField: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  eyeButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
});
