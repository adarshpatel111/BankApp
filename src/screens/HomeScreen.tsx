import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "../components/AppScreen";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { themeColors } from "../utils/themeColors";

export default function HomeScreen({ navigation }: any) {
  const { user, getUserProducts } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  const [showBalance, setShowBalance] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  if (!user) return null;

  // Fetch user products once on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getUserProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    loadProducts();
  }, []);
  const maskAccountNumber = (accountNumber: number) => {
    if (!accountNumber) return "";

    const str = accountNumber.toString();
    const last4 = str.slice(-4);
    const masked = "*".repeat(Math.max(0, str.length - 4));

    return masked + last4;
  };

  const renderAccountCard = (item: any) => {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primary + "99"]}
        style={styles.accountCard}
      >
        <Text style={styles.accountType}>{item.ProductName || item.type}</Text>
        <Text style={styles.accountType}>
          {maskAccountNumber(item.AccountNumber || item.accountNumber)}
        </Text>
        <Text style={styles.balance}>
          {showBalance ? `₹ ${item.Balance || item.balance}` : "₹ *****"}
        </Text>
        <Ionicons
          name="card-outline"
          size={24}
          color="#fff"
          style={{ position: "absolute", top: 10, right: 10 }}
        />
      </LinearGradient>
    );
  };

  return (
    <AppScreen colors={colors}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Welcome back
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {user.FirstName} {user.MiddleName} {user.LastName}
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>
              Customer Id: {user.CustomerId}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/profile-menu")}
            style={styles.avatarContainer}
          >
            <Text style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {user.FirstName.toUpperCase().charAt(0)}
              {user.LastName.toUpperCase().charAt(0)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show/Hide Balance Toggle */}
        <View style={styles.balanceToggleContainer}>
          <Text style={{ color: colors.text, fontWeight: "600" }}>
            {showBalance ? "Balance Visible" : "Balance Hidden"}
          </Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Ionicons
              name={showBalance ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Accounts / User Products */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Your Accounts
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={products}
          keyExtractor={(item) => item.AccountNumber}
          renderItem={({ item }) => renderAccountCard(item)}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {/* Passbook */}
        <View style={styles.passbookContainer}>
          <TouchableOpacity
            onPress={() => router.push("/passbook")}
            style={[styles.passbookButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="book-outline" size={28} color="#fff" />
            <Text style={styles.passbookText}>Passbook</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  greeting: { fontSize: 14, opacity: 0.7 },
  name: { fontSize: 16, fontWeight: "700" },

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

  balanceToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  accountCard: {
    width: 180,
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginRight: 14,
    justifyContent: "center",
    boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
    elevation: 5,
    position: "relative",
  },

  accountType: { fontSize: 16, color: "#fff", opacity: 0.9 },
  balance: { fontSize: 22, fontWeight: "700", marginTop: 10, color: "#fff" },

  passbookContainer: {
    marginTop: 30,
    alignItems: "flex-start",
  },
  passbookButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  passbookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
