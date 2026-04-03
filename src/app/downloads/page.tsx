import type { Metadata } from "next";
import { DownloadGrid } from "@/components/downloads/DownloadGrid";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Baixe músicas, jingles, fotos e materiais gráficos da campanha de Eduardo Braide.",
};

export default function DownloadsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm font-semibold">Materiais oficiais</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            <span className="text-primary">Downloads</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Baixe músicas, jingles, fotos e materiais gráficos para compartilhar e apoiar a campanha.
          </p>
        </div>

        {/* Download Grid */}
        <DownloadGrid />
      </div>
    </div>
  );
}
