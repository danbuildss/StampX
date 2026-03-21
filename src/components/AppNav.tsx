"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Plus, Bot, Sun, Moon, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getPendingStamps } from "@/lib/actions";

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

export default function AppNav() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getPendingStamps().then(({ data }) => setPendingCount(data.length));
  }, [pathname]);

  const NAV_LINKS = [
    { href: "/feed", label: "Feed", icon: null },
    { href: "/agents", label: "Agents", icon: <Bot size={13} /> },
    { href: "/profile/demo", label: "Profile", icon: null },
  ];

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

          {/* Review link with pending badge */}
          <Link
            href="/review"
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/review"
                ? "text-[var(--text)] bg-white/[0.06]"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.04]"
            )}
          >
            <ClipboardCheck size={13} />
            Review
            {pendingCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: "#14b8a6" }}
              >
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </Link>

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
