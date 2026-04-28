import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Em Manutenção | Eduardo Braide",
  description: "Site em manutenção. Voltaremos em breve.",
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
