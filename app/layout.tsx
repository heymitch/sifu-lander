import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Sifu — Work normally. Get SOPs automatically.",
  description:
    "Free, open-source action logger for macOS. Records your workflows, detects patterns, generates step-by-step documentation. Privacy-first.",
  openGraph: {
    title: "Sifu — Work normally. Get SOPs automatically.",
    description:
      "Free, open-source action logger for macOS. Records your workflows, detects patterns, generates step-by-step documentation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
