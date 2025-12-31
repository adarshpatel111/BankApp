import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import api from "../api/api";

export interface Account {
  AccountNumber: string;
  ProductName: string;
  Balance: number;
  encryptedAccount?: string;
}

export interface User {
  CustomerId: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Dob: string | null;
  MobileNo: string | null;
  PerMobileNo: string | null;
  accounts: Account[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  selectedAccount: Account | null;
  loading: boolean;
  login: (customerId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserProducts: () => Promise<Account[]>;
  selectAccount: (acc: Account) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  selectedAccount: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  getUserProducts: async () => [],
  selectAccount: () => {},
});

interface LoginResponse {
  token: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD TOKEN ON APP START ---------- */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) return;

        setToken(storedToken);

        const me = await api.get("/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        setUser({ ...me, accounts: [] });
      } catch (e) {
        await AsyncStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  /* ---------- LOGIN ---------- */
  const login = async (customerId: string, password: string) => {
    setLoading(true);
    try {
      const res: LoginResponse = await api.post("/login", {
        customerId,
        password,
      });

      setToken(res.token);
      await AsyncStorage.setItem("token", res.token);

      const me = await api.get("/me", {
        headers: { Authorization: `Bearer ${res.token}` },
      });

      setUser({ ...me, accounts: [] });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- PRODUCTS ---------- */
  const getUserProducts = async () => {
    if (!token) return [];

    const res = await api.get("/user-products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser((prev) => (prev ? { ...prev, accounts: res.products } : prev));

    return res.products;
  };

  const selectAccount = (acc: Account) => {
    setSelectedAccount(acc);
  };

  /* ---------- LOGOUT ---------- */
  const logout = async () => {
    setLoading(true);
    setUser(null);
    setToken(null);
    setSelectedAccount(null);
    await AsyncStorage.removeItem("token");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedAccount,
        loading,
        login,
        logout,
        getUserProducts,
        selectAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
