import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeMode, ThemeColor } from "@/lib/theme";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const COLORS: { value: ThemeColor; label: string }[] = [
  { value: "monochrome", label: "Monochrome" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Red" },
];

export function ThemeDropdown() {
  const { theme, setMode, setColor } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          aria-label="Theme options"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        {MODES.map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setMode(value)}
            className={theme.mode === value ? "bg-accent" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        {COLORS.map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setColor(value)}
            className={theme.color === value ? "bg-accent" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
