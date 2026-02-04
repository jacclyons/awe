export type ThemeMode = "dark" | "light";
export type ThemeColor = "monochrome" | "green" | "blue" | "orange" | "red";

export interface Theme {
  mode: ThemeMode;
  color: ThemeColor;
}

const STORAGE_KEY = "awe-theme";

const DEFAULT_THEME: Theme = {
  mode: "dark",
  color: "monochrome",
};

export function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw) as Theme;
    if (
      (parsed.mode === "dark" || parsed.mode === "light") &&
      ["monochrome", "green", "blue", "orange", "red"].includes(parsed.color)
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function storeTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme.mode);
  document.documentElement.setAttribute("data-color", theme.color);
}
