import React, { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function HelpScreen() {
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("Validation", "Please describe your issue.");
      return;
    }
    Alert.alert("Submitted", "Support ticket created successfully.");
    setMessage("");
  };

  const quickActions = [
    { title: "KYC Issues", desc: "Verification & documents" },
    { title: "Failed Payment", desc: "UPI / Bank transfer" },
    { title: "Card Block", desc: "Lost or stolen card" },
    { title: "Report Fraud", desc: "Suspicious activity" },
  ];

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Help Center</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          We are here to help you
        </Text>
      </View>

      <View style={styles.grid}>
        {quickActions.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={[
              styles.quickCard,
              {
                backgroundColor: colors.card,
                boxShadow: `0px 8px 16px ${colors.shadow}`,
              },
            ]}
          >
            <Text style={[styles.quickTitle, { color: colors.primary }]}>
              {item.title}
            </Text>
            <Text style={[styles.quickDesc, { color: colors.muted }]}>
              {item.desc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Raise a Support Ticket
        </Text>

        <TextInput
          style={[
            styles.textArea,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Explain your issue in detail"
          placeholderTextColor={colors.muted}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Create Ticket</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Instant Support
        </Text>
        <Text style={[styles.info, { color: colors.muted }]}>
          📞 1800-000-000 (24x7)
        </Text>
        <Text style={[styles.info, { color: colors.muted }]}>
          💬 Live Chat Available
        </Text>
        <Text style={[styles.info, { color: colors.muted }]}>
          ✉️ support@yourbank.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  quickCard: {
    width: "48%",
    margin: "1%",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickDesc: {
    fontSize: 13,
    marginTop: 6,
  },
  card: {
    margin: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 90,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  info: {
    fontSize: 14,
    marginBottom: 8,
  },
});
