import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "blue" | "orange" | "dark";

export const ThemeContext = createContext({
  theme: "blue" as Theme,
  setTheme: (t: Theme) => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("blue");
  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem("theme", t);
  };

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("theme");
      if (saved) setThemeState(saved as Theme);
    };
    loadTheme();
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
