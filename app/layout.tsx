import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaddoTech - Fast & Cheap Data Bundles in Ghana",
  description: "Buy MTN, Telecel, and AirtelTigo data bundles instantly. Fast, secure, and affordable data purchase platform.",
  keywords: "data bundles Ghana, MTN data, Telecel data, AirtelTigo data, buy data Ghana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
