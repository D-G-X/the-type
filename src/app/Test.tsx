// components/ThemeToggle.tsx
"use client";

import { useTheme } from "./hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="px-4 py-2 rounded border">
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}
