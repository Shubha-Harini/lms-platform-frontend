import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/Layout/AppShell";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kodemy | Master Growth Engineering",
  description: "Advanced Learning Management System with deep progress tracking and minimalist focus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white selection:bg-accent/10 antialiased`}>
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#2563eb',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
