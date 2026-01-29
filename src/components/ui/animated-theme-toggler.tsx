"use client";

import { useCallback, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted] = useState(() => typeof window !== "undefined");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isDark =
    theme === "dark" ||
    (!theme &&
      mounted &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || !mounted) return;

    const currentIsDark =
      theme === "dark" ||
      (!theme && document.documentElement.classList.contains("dark"));
    const newTheme = currentIsDark ? "light" : "dark";

    if (typeof document.startViewTransition === "function") {
      await document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      }).ready;
    } else {
      setTheme(newTheme);
    }

    if (typeof document.startViewTransition === "function") {
      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    }
  }, [theme, setTheme, mounted, duration]);

  if (!mounted) {
    return (
      <button
        ref={buttonRef}
        className={cn(
          "h-8 w-8 md:h-9 md:w-9 flex items-center justify-center",
          className
        )}
        disabled
        {...props}
      >
        <Sun className="w-4 h-4 opacity-50" />
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "h-8 w-8 md:h-9 md:w-9 flex items-center justify-center bg-secondary border border-border text-foreground hover:bg-muted rounded-md transition-colors",
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
