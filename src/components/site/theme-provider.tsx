import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "dark" | "light" | "stadium";
export type Bg = "default" | "stadium" | "court" | "clay";

const THEMES: Theme[] = ["dark", "light", "stadium"];
const BGS: Bg[] = ["default", "stadium", "court", "clay"];

type Ctx = {
  theme: Theme;
  bg: Bg;
  setTheme: (t: Theme) => void;
  setBg: (b: Bg) => void;
  cycleTheme: () => void;
  cycleBg: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [bg, setBgState] = useState<Bg>("default");

  useEffect(() => {
    const t = (localStorage.getItem("sportlive_theme") as Theme) || "dark";
    const b = (localStorage.getItem("sportlive_bg") as Bg) || "default";
    setThemeState(THEMES.includes(t) ? t : "dark");
    setBgState(BGS.includes(b) ? b : "default");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sportlive_theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute("data-bg", bg);
    localStorage.setItem("sportlive_bg", bg);
  }, [bg]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setBg = useCallback((b: Bg) => setBgState(b), []);
  const cycleTheme = useCallback(
    () => setThemeState((t) => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]),
    [],
  );
  const cycleBg = useCallback(
    () => setBgState((b) => BGS[(BGS.indexOf(b) + 1) % BGS.length]),
    [],
  );

  return (
    <ThemeCtx.Provider value={{ theme, bg, setTheme, setBg, cycleTheme, cycleBg }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be inside <ThemeProvider>");
  return ctx;
}
