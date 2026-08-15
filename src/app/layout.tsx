import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/components/providers/cart-provider";
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
  title: {
    default: "ReTech - Premium Refurbished & New Electronics",
    template: "%s | ReTech",
  },
  description: "Shop premium refurbished and brand-new laptops, desktops, monitors, and accessories at ReTech. Quality tested with warranty. Tech That Works. Value That Lasts.",
  keywords: ["refurbished laptops", "new laptops", "desktops", "monitors", "electronics", "ReTech", "gaming laptops", "business laptops"],
  authors: [{ name: "ReTech" }],
  creator: "ReTech",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ReTech - Premium Refurbished & New Electronics",
    description: "Shop premium refurbished and brand-new laptops, desktops, monitors, and accessories at ReTech. Quality tested with warranty.",
    siteName: "ReTech",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReTech - Premium Refurbished & New Electronics",
    description: "Shop premium refurbished and brand-new laptops, desktops, monitors, and accessories at ReTech.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
