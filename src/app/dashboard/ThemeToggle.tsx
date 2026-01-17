"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = theme === "light" ? "dark" : "light";

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setTheme(next)}
    >
      {theme === "light" ? "Dark" : "Light"} mode
    </Button>
  );
}

