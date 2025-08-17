import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileConsoleProvider } from "./components/MobileConsoleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arisa - キャストレコメンドサービス",
  description: "エリア・接客スタイル・予算に応じた信頼できるキャストを見つけよう。SNS更新を継続する努力型キャストの集客を支援するプラットフォーム。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-ios`}
      >
        <MobileConsoleProvider>
          {children}
        </MobileConsoleProvider>
      </body>
    </html>
  );
}
