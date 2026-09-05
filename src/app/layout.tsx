import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Critiq | Media Tracker",
  description: "Plataforma modular para rankear tus medios favoritos.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
