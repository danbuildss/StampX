"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
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
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href || pathname.startsWith(link.href)
                  ? "text-[var(--text)] bg-white/[0.06]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.04]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/create"
            className="ml-2 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            <Plus size={14} />
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
}
