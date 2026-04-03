import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
