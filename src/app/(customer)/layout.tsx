import { CartProvider } from "@/components/providers/cart-provider";
import CartDrawer from "@/components/layout/cart-drawer";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <Navbar />
        {children}
        <CartDrawer />
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}