import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export type Theme = "blue" | "orange" | "dark";

export const ThemeContext = createContext({
  theme: "orange" as Theme,
  setTheme: (t: Theme) => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("orange");
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
