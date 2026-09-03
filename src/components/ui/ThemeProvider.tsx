"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "blush" | "noir" | "modern";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "blush", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("blush");

  useEffect(() => {
    const stored = localStorage.getItem("wedding-theme") as Theme;
    if (stored) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored === "blush" ? "" : stored);
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("wedding-theme", t);
    document.documentElement.setAttribute("data-theme", t === "blush" ? "" : t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
