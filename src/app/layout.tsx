import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EgC",
  description: "The Eternal Game of Chess",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <SiteHeader />

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "18px",
              padding: "14px 18px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#111",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#111",
              },
            },
          }}
        />
      </body>
    </html>
  );
}