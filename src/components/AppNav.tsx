"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Plus, Bot, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("stampx-theme") as "dark" | "light" | null;
    const current = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    setTheme(stored || current || "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("stampx-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/agents", label: "Agents", icon: <Bot size={13} /> },
  { href: "/profile/demo", label: "Profile" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-[var(--text)]">StampX</span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href || pathname.startsWith(link.href)
                  ? "text-[var(--text)] bg-white/[0.06]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.04]"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <ThemeToggle />

          <Link
            href="/create"
            className="ml-1 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            <Plus size={14} />
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
}
