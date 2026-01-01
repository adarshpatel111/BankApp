import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import api from "../api/api";
import AppScreen from "../components/AppScreen";
import { Account, AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { encryptAccountNumber } from "../utils/crypto";
import { formatDate } from "../utils/Formate";
import { themeColors } from "../utils/themeColors";

type Transaction = {
  TransactionId: string;
  TransactionTime: string;
  Amount: number;
  Description?: string;
  Balance?: number;
  Type?: 1 | 2;
};

export default function PassbookScreen() {
  const { token, selectedAccount, selectAccount, getUserProducts } =
    useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const colors = themeColors[theme];

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* -------------------- FETCH ACCOUNTS -------------------- */
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoadingAccounts(true);
        const res = await getUserProducts();
        const products = res ?? [];

        const prods = await Promise.all(
          products.map(async (p: Account) => ({
            ...p,
            encryptedAccount: await encryptAccountNumber(p.AccountNumber),
          }))
        );

        setAccounts(prods);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (token) fetchAccounts();
  }, [token]);

  /* -------------------- FETCH TRANSACTIONS -------------------- */
  const fetchTransactions = async () => {
    if (!selectedAccount) return;

    setLoadingTransactions(true);
    try {
      const res = await api.get(
        `/transactions?acc=${encodeURIComponent(
          selectedAccount.encryptedAccount!
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(res.data.transactions ?? []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  /* -------------------- ACCOUNT CHANGE -------------------- */
  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    } else {
      // Reset to initial state
      setTransactions([]);
      setLoadingTransactions(false);
    }
  }, [selectedAccount]);

  /* -------------------- REFRESH HANDLER -------------------- */
  const handleRefresh = async () => {
    setRefreshing(true);

    if (selectedAccount) {
      await fetchTransactions(); // hit API
    } else {
      // initial page state
      setTransactions([]);
      setLoadingTransactions(false);
    }

    setRefreshing(false);
  };

  if (loadingAccounts)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <AppScreen colors={colors}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={[styles.header, { color: colors.text }]}>
          Select Account
        </Text>

        {/* -------------------- ACCOUNT PICKER -------------------- */}
        <View
          style={[
            styles.pickerContainer,
            {
              borderColor: colors.primary + "99",
              backgroundColor: colors.card,
            },
          ]}
        >
          <Picker
            selectedValue={selectedAccount?.AccountNumber ?? ""}
            onValueChange={(value) => {
              const acc = accounts.find((a) => a.AccountNumber === value);
              if (acc) {
                selectAccount(acc);
              }
            }}
            style={{ color: colors.text }}
          >
            <Picker.Item label="-- Select an account --" value="" />
            {accounts.map((acc) => (
              <Picker.Item
                key={acc.AccountNumber}
                label={`${acc.ProductName} (${acc.AccountNumber})`}
                value={acc.AccountNumber}
              />
            ))}
          </Picker>

          <Ionicons
            name="close-circle-outline"
            size={20}
            color={colors.muted}
            onPress={() => selectAccount([])}
            style={{ position: "absolute", right: 10, top: 14 }}
          />
        </View>

        {/* -------------------- TRANSACTIONS -------------------- */}
        <View style={{ flex: 1, marginTop: 16 }}>
          {loadingTransactions ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : selectedAccount ? (
            transactions.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No transactions found
              </Text>
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={(item) => item.TransactionId}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                renderItem={({ item }) => {
                  const isCredit = item.Type === 1;

                  return (
                    <View
                      style={[
                        styles.txContainer,
                        {
                          backgroundColor: colors.card,
                          boxShadow: `0px 8px 16px ${colors.shadow}`,
                        },
                      ]}
                    >
                      <View style={styles.txRow}>
                        <Text style={[styles.txText, { color: colors.text }]}>
                          {formatDate(item.TransactionTime)}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.txAmount,
                              { color: isCredit ? "green" : "red" },
                            ]}
                          >
                            ₹ {item.Amount}
                          </Text>
                          <Ionicons
                            name={
                              isCredit
                                ? "arrow-down-outline"
                                : "arrow-up-outline"
                            }
                            size={16}
                            color={isCredit ? "green" : "red"}
                            style={{
                              marginLeft: 4,
                              transform: [{ rotate: "45deg" }],
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.txRow}>
                        <Text style={[styles.txText, { color: colors.muted }]}>
                          {item.Description
                            ? item.Description.length > 20
                              ? item.Description.substring(0, 20) + "..."
                              : item.Description
                            : ""}
                        </Text>

                        <Text style={[styles.txAmount, { color: colors.text }]}>
                          ₹ {item.Balance}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            )
          ) : (
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Please select an account to see transactions
            </Text>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  txContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    elevation: 3,
  },

  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  txText: {
    fontSize: 14,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
