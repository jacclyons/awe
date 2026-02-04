import { useState, useEffect, useCallback } from "react";
import type { Theme, ThemeMode, ThemeColor } from "@/lib/theme";
import { getStoredTheme, storeTheme, applyTheme } from "@/lib/theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
    storeTheme(theme);
  }, [theme]);

  const setTheme = useCallback((updates: Partial<Theme>) => {
    setThemeState((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    setTheme({ mode });
  }, []);

  const setColor = useCallback((color: ThemeColor) => {
    setTheme({ color });
  }, []);

  return { theme, setTheme, setMode, setColor };
}
