import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import AppScreen from "../components/AppScreen";
import { AuthContext } from "../context/AuthContext";

export default function CustomerContactDetails() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const colors = themeColors[theme];
  const navigation = useNavigation<any>();

  if (!user) return null;

  const readOnlyStyle = {
    borderColor: colors.border,
    color: colors.muted,
    backgroundColor: colors.card,
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
            Contact Details
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* Mobile Number */}
          <Text style={[styles.label, { color: colors.text }]}>
            Mobile Number
          </Text>
          <TextInput
            value={user.MobileNo ?? ""}
            editable={false}
            style={[styles.input, readOnlyStyle]}
          />

          {/* Email */}
          <Text style={[styles.label, { color: colors.text }]}>
            Email Address
          </Text>
          <TextInput
            value={user.Email ?? "N/A"}
            editable={false}
            style={[styles.input, readOnlyStyle]}
          />

          {/* Alternate Mobile */}
          <Text style={[styles.label, { color: colors.text }]}>
            Alternate Mobile
          </Text>
          <TextInput
            value={user.PerMobileNo ?? "N/A"}
            editable={false}
            style={[styles.input, readOnlyStyle]}
          />
        </View>
      </View>
    </AppScreen>
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
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 14,
  },

  form: {
    flex: 1,
  },

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
});
