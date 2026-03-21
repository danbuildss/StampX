import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StampX — Stamp your work. Prove your value.",
  description:
    "StampX turns your work into verifiable onchain proof for humans and AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
