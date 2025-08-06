import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SoundScape - Tu Plataforma de Música Inteligente",
  description: "Descubre, organiza y disfruta tu música con la ayuda de inteligencia artificial. Crea playlists personalizadas y explora nuevos sonidos.",
  keywords: ["música", "playlist", "inteligencia artificial", "streaming", "canciones"],
  authors: [{ name: "SoundScape Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}