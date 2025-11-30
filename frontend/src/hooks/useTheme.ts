import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const applyThemeClass = (theme: Theme) => {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const initializeTheme = () => {
  const initialTheme = getPreferredTheme();
  applyThemeClass(initialTheme);
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setDarkMode = useCallback(
    (isDark: boolean) => setTheme(isDark ? "dark" : "light"),
    [],
  );

  return {
    theme,
    isDarkMode: theme === "dark",
    toggleTheme,
    setDarkMode,
  };
};

