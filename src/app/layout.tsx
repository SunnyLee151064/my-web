import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { initDatabase } from "@/lib/db";
import ClientLayout from "./ClientLayout";

// 初始化数据库
initDatabase().catch((error) => {
  console.error("Database initialization error:", error);
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lee's",
  description: "Sunny's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
