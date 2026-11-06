import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIREWISE-X | NASA Space Apps Challenge 2026",
  description: "Evidence-Grounded Research Engine for Microgravity Fire Safety (NASA BASS-II PSI-25)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#070d19] text-[#e8edf7]">{children}</body>
    </html>
  );
}
