import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Chat } from "@/app/_components/chat";
import { QueryProvider } from "@/app/_lib/query-client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeFit",
  description: "LifeFit é um aplicativo de treinamento personalizado que ajuda você a alcançar seus objetivos de saúde e fitness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <QueryProvider>
            <Suspense fallback={null}>
              <NuqsAdapter>
                {children}
                <Chat />
              </NuqsAdapter>
            </Suspense>
          </QueryProvider>
        </body>
    </html>
  );
}
