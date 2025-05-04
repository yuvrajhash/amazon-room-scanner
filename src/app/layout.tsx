import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Amazon Room Scanner | AI-Powered Room Design",
  description: "Scan your room with AI technology to get personalized furniture and design recommendations based on your space and style preferences.",
  keywords: "room scanner, AI design, furniture recommendations, interior design, Amazon",
  authors: [{ name: "Amazon Room Scanner Team" }],
  openGraph: {
    title: "Amazon Room Scanner | AI-Powered Room Design",
    description: "Get personalized furniture recommendations with our AI room scanner",
    url: "https://amazon-room-scanner.netlify.app",
    siteName: "Amazon Room Scanner",
    images: [
      {
        url: "/images/amazon.png",
        width: 1200,
        height: 630,
        alt: "Amazon Room Scanner Preview",
      },
    ],
    locale: "en_US",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
