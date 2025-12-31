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
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import { router } from "expo-router";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];
  const navigation = useNavigation<any>();

  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login(customerId, password);
    } catch (err: any) {
      Alert.alert("Login Failed", err?.message || "Login failed");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Secure Bank Login
        </Text>

        <TextInput
          placeholder="CustomerId"
          placeholderTextColor={colors.muted}
          value={customerId}
          onChangeText={setCustomerId}
          keyboardType="default"
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: -5,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});
