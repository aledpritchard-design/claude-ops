import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "os.Claude — Aled Pritchard",
  description: "AI product design, Knowledge systems, Conversation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body>{children}</body>
    </html>
  );
}
