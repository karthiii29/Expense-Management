import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "dark" | "light" | "auto";
export type AccentColor = "blue" | "purple" | "green" | "amber" | "pink";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (a: AccentColor) => void;
  effectiveTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  accentColor: "blue",
  setAccentColor: () => {},
  effectiveTheme: "dark",
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("iq-theme") as ThemeMode) || "dark";
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return (localStorage.getItem("iq-accent") as AccentColor) || "blue";
  });

  const getEffective = (t: ThemeMode): "dark" | "light" => {
    if (t === "auto") {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return t;
  };

  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">(() => getEffective(theme));

  useEffect(() => {
    const eff = getEffective(theme);
    setEffectiveTheme(eff);
    const root = document.documentElement;
    if (eff === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("iq-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (accentColor === "blue") {
      root.removeAttribute("data-accent");
    } else {
      root.setAttribute("data-accent", accentColor);
    }
    localStorage.setItem("iq-accent", accentColor);
  }, [accentColor]);

  // Listen for system preference changes when mode is "auto"
  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      const eff = e.matches ? "light" : "dark";
      setEffectiveTheme(eff);
      const root = document.documentElement;
      if (eff === "light") root.setAttribute("data-theme", "light");
      else root.removeAttribute("data-theme");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setAccentColor = (a: AccentColor) => setAccentColorState(a);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
