import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";
import AppScreen from "../components/AppScreen";
import { Ionicons } from "@expo/vector-icons";

export default function CreditOrDebitScreen() {
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  const cardStatus = [
    {
      type: "Debit Card",
      icon: "card-outline",
      owned: false,
    },
    {
      type: "Credit Card",
      icon: "wallet-outline",
      owned: false,
    },
  ];

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Cards</Text>

        {cardStatus.map((item) => (
          <View
            key={item.type}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <Ionicons name={item.icon} size={26} color={colors.text} />

            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: colors.text }]}>
                {item.type}
              </Text>
              <Text style={[styles.status, { color: colors.muted }]}>
                Not issued to this account
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.action, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.actionText}>Request</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  textWrap: {
    flex: 1,
    marginLeft: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  status: {
    fontSize: 13,
    marginTop: 2,
  },
  action: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
});
