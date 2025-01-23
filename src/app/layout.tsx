import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import { GenerationProvider } from "@/context/GenerationContext";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GenSpec",
  description: "Automtic Documentation Generator for working with code and AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApiKeyProvider>
          <GenerationProvider>{children}</GenerationProvider>
        </ApiKeyProvider>
        <Toaster />
      </body>
    </html>
  );
}
