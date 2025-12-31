import { router } from "expo-router";
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
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function RegisterScreen() {
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  // Steps: 1 = Verify Customer, 2 = OTP, 3 = Create Password
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [customerId, setCustomerId] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // STEP 1: Verify customer and send OTP
  const sendOtp = async () => {
    if (!customerId || !mobile) {
      Alert.alert("Error", "Customer ID and Mobile are required");
      return;
    }

    try {
      await api.post("/send-otp", {
        customerId,
        mobile,
      });
      // setStep(2);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Verification failed");
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Enter OTP");
      return;
    }

    try {
      await api.post(`/verify-otp`, {
        customerId,
        otp,
      });
      setStep(3);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Invalid OTP");
    }
  };

  // STEP 3: Create Password
  const createPassword = async () => {
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await api.post(`/create-password`, {
        customerId,
        password,
      });

      Alert.alert("Success", "Account created successfully", [
        { text: "Login", onPress: () => router.push("/(auth)/login") },
      ]);
    } catch {
      Alert.alert("Error", "Unable to create password");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {step === 1 && "Verify Customer"}
          {step === 2 && "OTP Verification"}
          {step === 3 && "Create Password"}
        </Text>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <TextInput
              placeholder="Customer ID"
              placeholderTextColor={colors.muted}
              value={customerId}
              onChangeText={setCustomerId}
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
            />

            <TextInput
              placeholder="Registered Mobile Number"
              placeholderTextColor={colors.muted}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={sendOtp}
            >
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor={colors.muted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={verifyOtp}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Create Password"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
              />
              <Text
                style={[styles.showHide, { color: colors.primary }]}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={createPassword}
            >
              <Text style={styles.buttonText}>Create Password</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Already registered? Login
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
    position: "relative",
  },
  showHide: {
    position: "absolute",
    right: 16,
    top: 18,
    fontWeight: "600",
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
