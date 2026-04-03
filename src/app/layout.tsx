import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Providers } from "@/components/shared/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Eduardo Braide | Pré-candidato a Governador do Maranhão",
    template: "%s | Eduardo Braide",
  },
  description:
    "Site oficial da pré-candidatura de Eduardo Braide ao Governo do Maranhão. Conheça a trajetória, plano de governo e como apoiar.",
  keywords: [
    "Eduardo Braide",
    "Governador",
    "Maranhão",
    "Pré-candidato",
    "São Luís",
    "PSD",
    "Eleições 2026",
  ],
  openGraph: {
    title: "Eduardo Braide | Pré-candidato a Governador do Maranhão",
    description:
      "Juntos por um Maranhão mais justo, desenvolvido e com oportunidades para todos.",
    type: "website",
    locale: "pt_BR",
    siteName: "Eduardo Braide",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
