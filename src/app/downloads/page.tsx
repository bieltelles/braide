import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Baixe músicas, fotos e materiais da campanha de Eduardo Braide.",
};

export default function DownloadsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            <span className="text-primary">Downloads</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Materiais para participação popular. Baixe e compartilhe!
          </p>
        </div>
        <div className="text-center text-muted-foreground py-20">
          Em breve: Músicas, fotos e materiais gráficos para download.
        </div>
      </div>
    </div>
  );
}
