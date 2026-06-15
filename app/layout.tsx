import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hedera Policy Agent",
  description:
    "AI agent with enforced spend limits, counterparty restrictions, and daily budget policies on Hedera testnet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#0a0a0a] text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
