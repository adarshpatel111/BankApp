import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import AppScreen from "../components/AppScreen";
import api from "../api/api";

export default function ChangeLoginPIN() {
  const { token } = useContext(AuthContext); // assuming you have token for API
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

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
      // Replace with your API endpoint
      const response = await api.get("/change-login-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPIN, newPIN }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login PIN changed successfully.");
        setOldPIN("");
        setNewPIN("");
        setConfirmPIN("");
      } else {
        Alert.alert("Error", data.message || "Failed to change PIN.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Change Login PIN
        </Text>

        <TextInput
          placeholder="Old PIN"
          placeholderTextColor={colors.muted || "#999"}
          value={oldPIN}
          onChangeText={setOldPIN}
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
        />

        <TextInput
          placeholder="New PIN"
          placeholderTextColor={colors.muted || "#999"}
          value={newPIN}
          onChangeText={setNewPIN}
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
        />

        <TextInput
          placeholder="Confirm New PIN"
          placeholderTextColor={colors.muted || "#999"}
          value={confirmPIN}
          onChangeText={setConfirmPIN}
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleChangePIN}
        >
          <Text style={styles.buttonText}>Change PIN</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
